'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { siteConfig } from '@/lib/siteConfig'

export default function Footer({ lang = 'en', dict }: { lang?: string, dict?: any }) {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const t = dict?.footer || {}
    const b = dict?.buttons || {}
    const n = dict?.navigation || {}

    const categories = [
        { name: 'News', slug: 'news', pt: 'Notícias', ptSlug: 'noticias' },
        { name: 'AI Tools', slug: 'ai-tools', pt: 'Ferramentas IA', ptSlug: 'ferramentas-de-ia' },
        { name: 'Software Comparisons', slug: 'software-comparisons', pt: 'Comparações', ptSlug: 'comparacoes' },
        { name: 'Productivity Tools', slug: 'productivity-tools', pt: 'Produtividade', ptSlug: 'produtividade' },
        { name: 'Programming Resources', slug: 'programming-resources', pt: 'Programação', ptSlug: 'programacao' },
        { name: 'Technology Trends', slug: 'technology-trends', pt: 'Tendências', ptSlug: 'tendencias-tecnologicas' }
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        
        setIsLoading(true)
        setError('')
        
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            
            const data = await res.json()
            
            if (res.ok) {
                setIsSubmitted(true)
                setEmail('')
                setTimeout(() => setIsSubmitted(false), 5000)
            } else {
                setError(data.error || 'Failed to subscribe')
            }
        } catch (err) {
            console.error('Newsletter error:', err)
            setError('Connection error')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <footer className="bg-[#1d1d1f] border-t border-white/5 pt-16 pb-8 text-white">
            <div className="container mx-auto px-6 max-w-7xl">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 mt-16">
                    <div className="col-span-1 md:col-span-2">
                        <Link href={`/${lang}`} className="font-bold text-[22px] tracking-tight mb-4 inline-block flex items-center">
                            {siteConfig.logo.url ? (
                                <Image
                                    src={siteConfig.logo.url}
                                    alt={siteConfig.logo.alt}
                                    width={siteConfig.logo.width}
                                    height={siteConfig.logo.height}
                                    className="object-contain brightness-0 invert"
                                />
                            ) : (
                                <span className="text-white">
                                    {siteConfig.name.split(' ')[0]}
                                    <span className="text-[#0066cc]">{siteConfig.name.split(' ')[1] || ''}</span>
                                </span>
                            )}
                        </Link>
                        <p className="text-[17px] text-gray-400 leading-relaxed mb-6 max-w-md">
                            {t.description || (lang === 'pt' ? 'Blog premium de tecnologia e estilo de vida.' : siteConfig.tagline)}
                        </p>
                        
                        <div className="max-w-sm">
                            {isSubmitted ? (
                                <div className="bg-white/5 border border-[#0066cc]/30 rounded-xl px-4 py-3 text-[14px] text-[#0066cc] font-medium animate-pulse">
                                    {lang === 'pt' ? 'Obrigado por subscrever! Verifique o seu email.' : 'Thanks for subscribing! Check your email.'}
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                                    <div className="flex space-x-2">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder={lang === 'pt' ? 'Introduza o seu email' : 'Enter your email'}
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-white placeholder:text-gray-500 focus:outline-none focus:border-[#0066cc] transition-colors"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button 
                                            type="submit" 
                                            className={`bg-[#0066cc] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0055b3] transition-colors whitespace-nowrap flex items-center justify-center min-w-[100px] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? '...' : (b.subscribe || 'Subscribe')}
                                        </button>
                                    </div>
                                    {error && <p className="text-red-500 text-[12px] pl-2">{error}</p>}
                                </form>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold text-[15px] uppercase tracking-wider mb-6 text-white">{t.links || (lang === 'pt' ? 'Categorias' : 'Categories')}</h4>
                        <ul className="space-y-4">
                            {categories.map((cat) => (
                                <li key={cat.name}>
                                    <Link href={`/${lang}/category/${lang === 'pt' ? cat.ptSlug : cat.slug}`} className="text-gray-400 hover:text-white transition-colors text-[15px]">
                                        {lang === 'pt' ? cat.pt : cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-[15px] uppercase tracking-wider mb-6 text-white">{lang === 'pt' ? 'Empresa' : 'Company'}</h4>
                        <ul className="space-y-4">
                            <li>
                                <Link href={`/${lang}/about`} className="text-gray-400 hover:text-white transition-colors text-[15px]">{n.about || 'About Us'}</Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/contact`} className="text-gray-400 hover:text-white transition-colors text-[15px]">{n.contact || 'Contact'}</Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/privacy`} className="text-gray-400 hover:text-white transition-colors text-[15px]">{t.privacy || 'Privacy Policy'}</Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/terms`} className="text-gray-400 hover:text-white transition-colors text-[15px]">{t.terms || 'Terms of Service'}</Link>
                            </li>
                            <li>
                                <Link href={`/${lang}/cookie-policy`} className="text-gray-400 hover:text-white transition-colors text-[15px]">{t.cookies || 'Cookie Policy'}</Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 flex flex-col items-center justify-center text-center">
                    <p className="text-gray-500 text-[14px]">
                        &copy; {new Date().getFullYear()} TecnoMais. {t.copyright || 'All rights reserved.'}
                    </p>
                </div>
            </div>
        </footer>
    )
}


