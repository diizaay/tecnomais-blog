'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { siteConfig } from '@/lib/siteConfig'
import SearchOverlay from './SearchOverlay'

interface NavbarProps {
    theme?: 'light' | 'dark'
}

export default function Navbar({ theme = 'light' }: NavbarProps) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isDark = theme === 'dark' && !scrolled

    return (
        <motion.header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav py-2.5' : 'bg-transparent py-4'
                } ${isDark ? 'text-white' : 'text-[#1d1d1f]'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
                <Link href="/" className="font-bold text-[22px] tracking-tight flex items-center">
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
                <nav className="hidden md:flex items-center space-x-8">
                    {['News', 'AI Tools', 'Software Comparisons', 'Productivity Tools', 'Programming Resources', 'Technology Trends'].map((item) => (
                        <Link
                            key={item}
                            href={`/categoria/${item.toLowerCase().replace(' ', '-')}`}
                            className={`text-[15px] font-medium transition-colors ${isDark ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-[#1d1d1f]'}`}
                        >
                            {item}
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
                    <Link href="/newsletter" className="btn-apple-primary !px-5 !py-2 !text-[14px]">
                        Subscribe
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
                    <nav className="flex flex-col space-y-4 mb-6">
                        {['News', 'AI Tools', 'Software Comparisons', 'Productivity Tools', 'Programming Resources', 'Technology Trends'].map((item) => (
                            <Link
                                key={item}
                                href={`/categoria/${item.toLowerCase().replace(' ', '-')}`}
                                className="text-[17px] font-medium text-gray-800"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item}
                            </Link>
                        ))}
                    </nav>
                    <div className="w-full flex items-center justify-between">
                        <div className="relative flex-1 mr-4">
                            <button 
                                onClick={() => {
                                    setMobileMenuOpen(false)
                                    setIsSearchOpen(true)
                                }}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                            >
                                <Search size={18} />
                            </button>
                            <input
                                type="text"
                                placeholder="Search articles..."
                                onFocus={() => {
                                    setMobileMenuOpen(false)
                                    setIsSearchOpen(true)
                                }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 pl-10 pr-4 text-[15px] focus:outline-none focus:border-blue-400"
                            />
                        </div>
                        <Link href="/newsletter" className="btn-apple-primary !px-5 !py-2 !text-[14px] whitespace-nowrap">
                            Subscribe
                        </Link>
                    </div>
                </motion.div>
            )}

            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </motion.header>
    )
}
