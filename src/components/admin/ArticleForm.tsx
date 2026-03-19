'use client'

import { useState, useRef, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { forwardRef } from 'react'
import { Article, Category } from '@prisma/client'
import 'react-quill/dist/quill.snow.css'

const ReactQuillBase = dynamic(() => import('react-quill'), { ssr: false })

const ReactQuill = forwardRef((props: any, ref) => (
    <ReactQuillBase {...props} forwardedRef={ref} />
))
ReactQuill.displayName = 'ReactQuill'


interface ArticleFormProps {
    initialData?: Article | null
    categories: Category[]
}

export default function ArticleForm({ initialData, categories }: ArticleFormProps) {
    const router = useRouter()
    const quillRef = useRef<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [editorModules, setEditorModules] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        featuredImage: initialData?.featuredImage || '',
        categoryIds: (initialData as any)?.categoryIds || [],
        author: initialData?.author || 'AdminUser',
        tags: (initialData as any)?.tags?.map((t: any) => t.name).join(', ') || '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleContentChange = (content: string) => {
        setFormData(prev => ({ ...prev, content }))
    }

    const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return
        setIsUploading(true)
        const file = e.target.files[0]
        const uploadData = new FormData()
        uploadData.append('file', file)

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: uploadData
            })
            const data = await res.json()
            if (data.url) {
                setFormData(prev => ({ ...prev, featuredImage: data.url }))
            }
        } catch (error) {
            alert('Failed to upload image')
        } finally {
            setIsUploading(false)
        }
    }

    const imageHandlerRef = useRef<(() => void) | null>(null);

    // Initialize Quill and Modules
    useEffect(() => {
        const initQuill = async () => {
            if (typeof window === 'undefined' || editorModules) return;

            const Quill = (await import('quill')).default;
            (window as any).Quill = Quill;
            const ImageResize = (await import('quill-image-resize-module-react')).default;
            const ImageDrop = (await import('quill-image-drop-module')).ImageDrop;

            // Custom Image Blot
            const ImageBlot = Quill.import('formats/image') as any;
            class StyledImageBlot extends ImageBlot {
                static blotName = 'image';
                static tagName = 'img';
                static create(value: any) {
                    const node = super.create(value);
                    if (typeof value === 'object') {
                        node.setAttribute('src', value.src);
                        if (value.alt) node.setAttribute('alt', value.alt);
                        if (value.title) node.setAttribute('title', value.title);
                    } else {
                        node.setAttribute('src', value);
                    }
                    return node;
                }
                static value(node: HTMLElement) {
                    return {
                        src: node.getAttribute('src'),
                        alt: node.getAttribute('alt'),
                        title: node.getAttribute('title')
                    };
                }
            }
            
            // Register format (force override default)
            Quill.register(StyledImageBlot, true);

            // Register modules
            try {
                if (!Quill.import('modules/imageResize')) {
                    Quill.register('modules/imageResize', ImageResize);
                }
                if (!Quill.import('modules/imageDrop')) {
                    Quill.register('modules/imageDrop', ImageDrop);
                }
            } catch (e) {
                // Silently handle if already registered or fails
            }

            imageHandlerRef.current = function(this: any) {
                const quillInstance = this.quill || quillRef.current?.getEditor();
                if (!quillInstance) return;

                const range = quillInstance.getSelection(true);
                const input = document.createElement('input')
                input.setAttribute('type', 'file')
                input.setAttribute('accept', 'image/*')
                
                input.onchange = async () => {
                    if (!input.files || input.files.length === 0) return;

                    const file = input.files[0];
                    const fd = new FormData();
                    fd.append('file', file);

                    const index = range ? range.index : quillInstance.getLength();
                    quillInstance.insertText(index, 'Uploading image...', { 'color': '#0066cc', 'italic': true });

                    try {
                        const res = await fetch('/api/admin/upload', {
                            method: 'POST',
                            body: fd
                        });
                        
                        if (!res.ok) throw new Error(`Server error: ${res.status}`);

                        const data = await res.json();

                        if (data.url) {
                            const title = prompt('Enter Image Title (for SEO):', file.name.split('.')[0]) || '';
                            const alt = prompt('Enter Alt Text (description):', title) || title;

                            quillInstance.deleteText(index, 18);
                            quillInstance.insertEmbed(index, 'image', {
                                src: data.url,
                                alt: alt,
                                title: title
                            }, 'user');
                            
                            quillInstance.setSelection(index + 1, 0, 'user');
                        }
                    } catch (error: any) {
                        alert('Erro no upload: ' + error.message);
                        quillInstance.deleteText(index, 18);
                    }
                }
                
                document.body.appendChild(input);
                input.click();
                document.body.removeChild(input);
            }

            setEditorModules({
                toolbar: {
                    container: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        [{ 'size': ['small', false, 'large', 'huge'] }],
                        [{ 'font': [] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'script': 'sub' }, { 'script': 'super' }],
                        ['blockquote', 'code-block'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
                        [{ 'direction': 'rtl' }, { 'align': [] }],
                        ['link', 'image', 'video'],
                        ['clean']
                    ],
                    handlers: {
                        image: function(this: any) {
                            if (imageHandlerRef.current) {
                                imageHandlerRef.current.call(this);
                            }
                        }
                    }
                },
                imageResize: {
                    parchment: Quill.import('parchment'),
                    modules: ['Resize', 'DisplaySize', 'Toolbar']
                },
                imageDrop: true
            });
        };
        
        initQuill();
    }, [editorModules])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const url = initialData ? `/api/admin/artigos/${initialData.id}` : '/api/admin/artigos'
            const method = initialData ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    categoryIds: formData.categoryIds.length > 0 ? formData.categoryIds : []
                })
            })

            if (res.ok) {
                router.push('/admin/artigos')
                router.refresh()
            } else {
                const errorText = await res.text()
                alert(`Error saving article: ${errorText}`)
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred while saving the article.')
        } finally {
            setIsLoading(false)
        }
    }

    const generateSlug = () => {
        if (!formData.title) return
        const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        setFormData(prev => ({ ...prev, slug }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-[24px] font-bold text-[#1d1d1f]">{initialData ? 'Edit Article' : 'New Article'}</h2>
                <div className="space-x-4">
                    <Link href="/admin/artigos" className="text-gray-500 hover:text-gray-800 font-medium">Cancel</Link>
                    <button type="submit" disabled={isLoading} className="btn-apple-primary !px-6 !py-2">
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Title</label>
                    <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]" />
                </div>
                <div>
                    <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Slug</label>
                    <div className="flex space-x-2">
                        <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]" />
                        <button type="button" onClick={generateSlug} className="bg-gray-100 text-gray-600 px-4 rounded-xl font-medium hover:bg-gray-200 text-sm">Generate</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Categories (Select multiple)</label>
                    <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100 max-h-[150px] overflow-y-auto">
                        {categories.map(c => (
                            <label key={c.id} className="flex items-center space-x-2 text-[14px] cursor-pointer hover:text-[#0066cc]">
                                <input
                                    type="checkbox"
                                    checked={formData.categoryIds.includes(c.id)}
                                    onChange={(e) => {
                                        const ids = e.target.checked 
                                            ? [...formData.categoryIds, c.id]
                                            : formData.categoryIds.filter((id: string) => id !== c.id);
                                        setFormData(prev => ({ ...prev, categoryIds: ids }));
                                    }}
                                    className="rounded border-gray-300 text-[#0066cc] focus:ring-[#0066cc]"
                                />
                                <span>{c.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Featured Image</label>
                    <div className="flex space-x-2">
                        <input type="url" name="featuredImage" value={formData.featuredImage} onChange={handleChange} placeholder="Image URL or upload" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]" />
                        <label className="cursor-pointer bg-gray-100 text-gray-600 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 text-sm flex items-center shrink-0">
                            {isUploading ? 'Uploading...' : 'Upload File'}
                            <input type="file" accept="image/*" className="hidden" disabled={isUploading} onChange={handleFeaturedImageUpload} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Author</label>
                    <input type="text" name="author" required value={formData.author} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]" />
                </div>
                <div>
                    <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Tags / Topics (Comma separated)</label>
                    <input type="text" name="tags" placeholder="e.g. AI, Future, Technology" value={(formData as any).tags} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]" />
                </div>
            </div>

            <div>
                <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Excerpt</label>
                <textarea name="excerpt" required rows={3} value={formData.excerpt} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]"></textarea>
            </div>

            <div>
                <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Content</label>
                <div className="bg-white rounded-xl overflow-hidden border border-gray-200 focus-within:border-[#0066cc] min-h-[450px]">
                    {editorModules ? (
                        <ReactQuill
                            ref={quillRef}
                            theme="snow"
                            value={formData.content}
                            onChange={handleContentChange}
                            modules={editorModules}
                            className="h-[400px] mb-12"
                        />
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-gray-400">
                            Loading editor...
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}
