'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Category } from '../../generated/prisma'

interface CategoryFormProps {
    initialData?: Category | null
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const url = initialData ? `/api/admin/categorias/${initialData.id}` : '/api/admin/categorias'
            const method = initialData ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                router.push('/admin/categorias')
                router.refresh()
            } else {
                alert('An error occurred while saving the category.')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred while saving the category.')
        } finally {
            setIsLoading(false)
        }
    }

    const generateSlug = () => {
        if (!formData.name) return
        const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        setFormData(prev => ({ ...prev, slug }))
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                <h2 className="text-[24px] font-bold text-[#1d1d1f]">{initialData ? 'Edit Category' : 'New Category'}</h2>
                <div className="space-x-4">
                    <Link href="/admin/categorias" className="text-gray-500 hover:text-gray-800 font-medium">Cancel</Link>
                    <button type="submit" disabled={isLoading} className="btn-apple-primary !px-6 !py-2">
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Name</label>
                <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]" />
            </div>

            <div>
                <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Slug</label>
                <div className="flex space-x-2">
                    <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]" />
                    <button type="button" onClick={generateSlug} className="bg-gray-100 text-gray-600 px-4 rounded-xl font-medium hover:bg-gray-200 text-sm">Generate</button>
                </div>
            </div>
        </form>
    )
}
