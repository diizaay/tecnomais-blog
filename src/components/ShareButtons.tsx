'use client'

import React from 'react'
import { Facebook, Linkedin, Mail, MessageSquare } from 'lucide-react'

const XIcon = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="currentColor" 
        className={className}
    >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z" />
    </svg>
)

interface ShareButtonsProps {
    shareUrl: string
    shareTitle: string
    variant?: 'hero' | 'sticky'
    dict: {
        share: string
        copied: string
    }
}

export default function ShareButtons({ shareUrl, shareTitle, variant = 'hero', dict }: ShareButtonsProps) {
    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        alert(dict.copied)
    }

    if (variant === 'sticky') {
        return (
            <div className="sticky top-40 flex flex-col items-center space-y-6">
                <div className="w-[1px] h-10 bg-gray-200 mb-2"></div>
                <span className="rotate-90 text-[11px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-8 whitespace-nowrap">{dict.share}</span>
                <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-[#0066cc] transition-all"
                >
                    <Facebook size={18} />
                </a>
                <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-[#0066cc] transition-all"
                >
                    <Linkedin size={18} />
                </a>
                <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-black transition-all"
                >
                    <XIcon size={16} />
                </a>
                <a 
                    href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`} 
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-[#0066cc] transition-all"
                >
                    <Mail size={18} />
                </a>
                <button 
                    onClick={handleCopy}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-[#0066cc] transition-all"
                >
                    <MessageSquare size={18} />
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
            <span className="text-[13px] uppercase tracking-widest text-gray-500 font-bold">{dict.share}</span>
            <div className="flex space-x-4">
                <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <Facebook size={18} />
                </a>
                <a 
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <Linkedin size={18} />
                </a>
                <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <XIcon size={16} />
                </a>
                <a 
                    href={`mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`} 
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <Mail size={18} />
                </a>
                <button 
                    onClick={handleCopy}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <MessageSquare size={18} />
                </button>
            </div>
        </div>
    )
}

