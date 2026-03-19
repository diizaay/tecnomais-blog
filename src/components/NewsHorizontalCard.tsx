'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface NewsHorizontalCardProps {
    article: any
}

export default function NewsHorizontalCard({ article }: NewsHorizontalCardProps) {
    const router = useRouter()
    const imageUrl = article.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'

    const handleClick = () => {
        router.push(`/artigo/${article.slug}`)
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group py-8 border-b border-gray-100 last:border-0 cursor-pointer"
            onClick={handleClick}
        >
            <div className="flex flex-row md:flex-row gap-4 md:gap-8 items-start md:items-center">
                <div className="flex-1 order-1">
                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                        {(article as any).categories?.slice(0, 1).map((cat: any) => (
                            <Link 
                                key={cat.id}
                                href={`/categoria/${cat.slug}`}
                                className="text-[10px] md:text-[12px] font-bold tracking-widest uppercase text-[#0066cc] bg-blue-50 px-1.5 md:px-2 py-0.5 rounded hover:bg-[#0066cc] hover:text-white transition-colors"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {cat.name}
                            </Link>
                        ))}
                        <span className="text-gray-300 hidden md:inline">&bull;</span>
                        <span className="text-gray-500 text-[11px] md:text-[13px] font-medium" suppressHydrationWarning>{new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-[18px] md:text-[28px] font-bold leading-tight mb-2 md:mb-4 text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors line-clamp-3 md:line-clamp-none">
                        {article.title}
                    </h3>
                    <p className="hidden md:block text-[17px] text-[#424245] leading-relaxed line-clamp-2 md:line-clamp-3">
                        {article.excerpt}
                    </p>
                    <div className="hidden md:flex mt-6 items-center text-[14px] font-medium text-gray-500">
                        <span>By </span>
                        <Link 
                            href={`/autor/${encodeURIComponent(article.author)}`}
                            className="ml-1 font-bold text-[#1d1d1f] hover:text-[#0066cc] hover:underline transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {article.author}
                        </Link>
                    </div>
                </div>
                <div className="w-[80px] h-[80px] md:w-1/3 md:h-auto md:aspect-[16/10] relative rounded-lg md:rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 order-2">
                    <Image
                        src={imageUrl}
                        alt={article.title}
                        fill
                        sizes="(max-width: 768px) 80px, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
            </div>
        </motion.div>
    )
}
