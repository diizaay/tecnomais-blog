'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Menu, X, Globe } from 'lucide-react'
import Image from 'next/image'
import { siteConfig } from '@/lib/siteConfig'
import SearchOverlay from './SearchOverlay'
import { usePathname } from 'next/navigation'

interface NavbarProps {
    theme?: 'light' | 'dark'
    lang?: string
    dict?: any
}

export default function Navbar({ theme = 'light', lang = 'en', dict }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isDark = theme === 'dark' && !scrolled
    
    // Fallback translations if dict is missing
    const t = dict?.navigation || {
        home: 'Home',
        categories: 'Categories',
        newsletter: 'Newsletter'
    }
    const b = dict?.buttons || {
        subscribe: 'Subscribe'
    }

    const categories = [
        { name: 'News', slug: 'news', pt: 'Notícias', ptSlug: 'noticias' },
        { name: 'AI Tools', slug: 'ai-tools', pt: 'Ferramentas IA', ptSlug: 'ferramentas-de-ia' },
        { name: 'Software Comparisons', slug: 'software-comparisons', pt: 'Comparações', ptSlug: 'comparacoes' },
        { name: 'Productivity Tools', slug: 'productivity-tools', pt: 'Produtividade', ptSlug: 'produtividade' },
        { name: 'Programming Resources', slug: 'programming-resources', pt: 'Programação', ptSlug: 'programacao' },
        { name: 'Technology Trends', slug: 'technology-trends', pt: 'Tendências', ptSlug: 'tendencias-tecnologicas' }
    ]

    const getLocalizedPath = (targetLang: string) => {
        if (!pathname) return `/${targetLang}`
        const segments = pathname.split('/')
        if (segments[1] === 'en' || segments[1] === 'pt') {
            segments[1] = targetLang
            return segments.join('/')
        }
        return `/${targetLang}${pathname}`
    }

    return (
        <motion.header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-2.5' : 'bg-transparent py-4'
                } ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href={`/${lang}`} className="font-bold text-[22px] tracking-tight flex items-center">
                    {siteConfig.logo.url ? (
                        <Image
                            src={siteConfig.logo.url}
                            alt={siteConfig.logo.alt}
                            width={siteConfig.logo.width}
                            height={siteConfig.logo.height}
                            className="object-contain"
                        />
                    ) : (
                        <>
                            {siteConfig.name.split(' ')[0]}
                            <span className="text-[#0066cc]">{siteConfig.name.split(' ')[1] || ''}</span>
                        </>
                    )}
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center space-x-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.name}
                            href={`/${lang}/category/${lang === 'pt' ? cat.ptSlug : cat.slug}`}
                            className={`text-[14px] font-medium transition-colors ${isDark ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#1d1d1f]'}`}
                        >
                            {lang === 'pt' ? cat.pt : cat.name}
                        </Link>
                    ))}
                </nav>

                {/* Actions */}
                <div className="hidden md:flex items-center space-x-6">
                    <button 
                        onClick={() => setIsSearchOpen(true)}
                        className={`transition-colors ${isDark ? 'text-white/80 hover:text-white' : 'text-gray-500 hover:text-[#1d1d1f]'}`}
                    >
                        <Search size={20} />
                    </button>
                    <Link href={`/${lang}/newsletter`} className="btn-apple-primary !px-5 !py-2 !text-[14px]">
                        {b.subscribe}
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={`md:hidden ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 w-full p-6 shadow-xl"
                >
                    <nav className="flex flex-col space-y-4 mb-6 text-center">
                        {categories.map((cat) => (
                            <Link
                                key={cat.name}
                                href={`/${lang}/category/${lang === 'pt' ? cat.ptSlug : cat.slug}`}
                                className="text-[18px] font-semibold text-gray-800 hover:text-[#0066cc] transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {lang === 'pt' ? cat.pt : cat.name}
                            </Link>
                        ))}
                    </nav>
                    <div className="flex flex-col space-y-6 pt-6 border-t border-gray-50">
                        <div className="flex items-center justify-between gap-4">
                            <button 
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    setIsSearchOpen(true)
                                }}
                                className="bg-gray-50 border border-gray-200 rounded-full py-2.5 px-4 text-[15px] flex items-center text-gray-500 flex-1 justify-center"
                            >
                                <Search size={18} className="mr-2" />
                                {dict?.buttons?.search || 'Search'}
                            </button>
                            <Link 
                                href={`/${lang}/newsletter`} 
                                className="btn-apple-primary !px-6 !py-2.5 !text-[15px] whitespace-nowrap flex-1 text-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {b.subscribe}
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </motion.header>
    )
}


