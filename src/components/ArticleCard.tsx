'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Article, Category } from '@prisma/client'
import { useRouter } from 'next/navigation'
import OptimizedCloudinaryImage from './OptimizedCloudinaryImage'

interface ArticleWithCategories extends Article {
    categories?: Category[]
}

interface ArticleCardProps {
    article: ArticleWithCategories
    priority?: boolean
}

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
    const router = useRouter()
    
    // Mock image for development if none exists
    const imageUrl = article.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'

    const handleClick = () => {
        router.push(`/artigo/${article.slug}`)
    }

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            className="apple-card overflow-hidden group flex flex-col h-full cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex-1 flex flex-col">
                <div className="relative w-full h-[240px] bg-gray-100 overflow-hidden">
                    <OptimizedCloudinaryImage
                        src={imageUrl}
                        alt={article.title}
                        width={600}
                        height={400}
                        type="thumbnail"
                        priority={priority}
                        className="object-cover transition-transform duration-700 group-hover:scale-105 w-full h-full"
                    />
                </div>
                <div className="p-5 md:p-8 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-2 mb-3 md:mb-4">
                        {(article as any).categories?.slice(0, 1).map((cat: any) => (
                            <Link 
                                key={cat.id}
                                href={`/categoria/${cat.slug}`}
                                className="text-[10px] md:text-[11px] font-bold tracking-widest uppercase text-[#0066cc] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100/50 hover:bg-[#0066cc] hover:text-white transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <span className="text-gray-300 text-[10px] md:text-[11px] font-bold flex items-center">&bull;</span>
                        <span className="text-gray-500 text-[10px] md:text-[11px] font-bold flex items-center" suppressHydrationWarning>
                            {new Date(article.publishedDate).toLocaleDateString('en-US')}
                        </span>
                    </div>
                    <h3 className="text-[19px] md:text-[24px] font-bold leading-tight mb-2 md:mb-3 text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors line-clamp-3">
                        {article.title}
                    </h3>
                    <p className="hidden md:block text-[17px] text-[#86868b] leading-relaxed line-clamp-3 mb-6 flex-1">
                        {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-3 md:pt-0 border-t border-gray-50 md:border-0">
                        <Link 
                            href={`/autor/${encodeURIComponent(article.author)}`}
                            className="text-[13px] md:text-[14px] font-bold text-[#1d1d1f] hover:text-[#0066cc] hover:underline transition-all"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {article.author}
                        </Link>
                        <span className="text-[13px] md:text-[14px] font-medium text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity">
                            Read &rarr;
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
