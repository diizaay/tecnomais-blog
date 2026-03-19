'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface SearchOverlayProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100)
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
            setQuery('')
            setResults([])
        }
        return () => { document.body.style.overflow = 'auto' }
    }, [isOpen])

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleEsc)
        return () => window.removeEventListener('keydown', handleEsc)
    }, [onClose])

    useEffect(() => {
        const debounceTimer = setTimeout(async () => {
            if (query.length < 2) {
                setResults([])
                return
            }

            setIsLoading(true)
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                setResults(data.articles || [])
            } catch (error) {
                console.error('Search failed:', error)
            } finally {
                setIsLoading(false)
            }
        }, 300)

        return () => clearTimeout(debounceTimer)
    }, [query])

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-xl flex flex-col"
                >
                    {/* Header */}
                    <div className="container mx-auto px-6 max-w-7xl pt-12 flex justify-between items-center">
                        <div className="flex-1 max-w-3xl relative">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-[#1d1d1f] w-8 h-8" strokeWidth={2.5} />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search articles, authors, topics..."
                                className="w-full bg-transparent border-none text-[32px] md:text-[48px] font-bold text-[#1d1d1f] placeholder-gray-300 pl-12 focus:outline-none focus:ring-0"
                            />
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Results Container */}
                    <div className="flex-grow overflow-y-auto mt-12 pb-20">
                        <div className="container mx-auto px-6 max-w-7xl">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <Loader2 className="animate-spin mb-4" size={32} />
                                    <p className="text-[19px] font-medium">Searching our archives...</p>
                                </div>
                            ) : query.length > 0 && results.length === 0 ? (
                                <div className="py-20 text-center">
                                    <p className="text-[24px] font-medium text-gray-400">No results found for "{query}"</p>
                                    <p className="text-[17px] text-gray-500 mt-2">Try different keywords or check your spelling.</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {results.map((article) => (
                                        <Link 
                                            key={article.id} 
                                            href={`/artigo/${article.slug}`}
                                            onClick={onClose}
                                            className="group flex gap-6 items-start border-b border-gray-100 pb-8 last:border-0"
                                        >
                                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                                                <Image 
                                                    src={article.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400'} 
                                                    alt={article.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <span className="text-[13px] font-bold text-[#0066cc] uppercase tracking-wider mb-2 block">
                                                    {article.categories?.[0]?.name || 'News'}
                                                </span>
                                                <h3 className="text-[20px] md:text-[24px] font-bold text-[#1d1d1f] line-clamp-2 leading-tight group-hover:text-[#0066cc] transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-[15px] text-[#86868b] mt-2 line-clamp-2 md:block hidden">
                                                    {article.excerpt}
                                                </p>
                                                <div className="mt-4 flex items-center text-[14px] font-medium text-[#1d1d1f]">
                                                    View Details <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center">
                                    <h3 className="text-[20px] font-semibold text-gray-400 mb-8 uppercase tracking-[0.2em]">Quick Suggestions</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {['Artificial Intelligence', 'Productivity', 'Future Tech', 'Programming'].map(tag => (
                                            <button 
                                                key={tag}
                                                onClick={() => setQuery(tag)}
                                                className="px-6 py-3 bg-gray-50 text-[#1d1d1f] rounded-full text-[16px] font-bold border border-gray-200 hover:bg-[#0066cc] hover:text-white hover:border-[#0066cc] transition-all"
                                            >
                                                {tag}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
