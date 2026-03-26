'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Locale } from '@/lib/get-dictionary'

interface NewsletterClientProps {
    lang: Locale
    dict: {
        title: string
        subtitle: string
        subscribeTitle: string
        checkInbox: string
        confirmationSent: string
        placeholder: string
        button: string
        subscribing: string
        agreement: string
        privacyPolicy: string
        noSpam: string
        feature1Title: string
        feature1Desc: string
        feature2Title: string
        feature2Desc: string
        feature3Title: string
        feature3Desc: string
    }
}

export default function NewsletterClient({ lang, dict }: NewsletterClientProps) {
    const [email, setEmail] = useState('')
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

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
            } else {
                setError(data.error || (lang === 'pt' ? 'Algo deu errado. Por favor, tente novamente.' : 'Something went wrong. Please try again.'))
            }
        } catch (err) {
            setError(lang === 'pt' ? 'Falha ao conectar ao servidor. Por favor, verifique a sua conexão.' : 'Failed to connect to the server. Please check your connection.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
                <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-none mb-6">
                    {dict.title}.
                </h1>
                <p className="text-[20px] md:text-[24px] text-[#86868b] max-w-2xl mx-auto leading-relaxed">
                    {dict.subtitle}
                </p>
            </div>

            <div className="bg-[#f5f5f7] rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-sm">
                <div className="max-w-md mx-auto">
                    <h2 className="text-[28px] font-bold text-[#1d1d1f] mb-8 text-center">{dict.subscribeTitle}</h2>
                    
                    {isSubmitted ? (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl p-8 text-center shadow-lg border border-blue-50"
                        >
                            <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2">{dict.checkInbox}</h3>
                            <p className="text-[15px] text-[#86868b]">{dict.confirmationSent} <strong>{email}</strong>.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={dict.placeholder}
                                    className="w-full bg-white border border-gray-200 rounded-2xl px-6 py-4 text-[17px] focus:outline-none focus:border-[#0066cc] transition-colors"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            {error && <p className="text-red-500 text-[14px] text-center">{error}</p>}
                            <button 
                                type="submit" 
                                className={`w-full btn-apple-primary !py-4 !text-[17px] !rounded-2xl flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="animate-spin mr-2">◌</span>
                                        {dict.subscribing}
                                    </>
                                ) : dict.button}
                            </button>
                            <p className="text-[13px] text-gray-400 text-center mt-6">
                                {dict.agreement} <Link href={`/${lang}/privacy`} className="underline hover:text-[#0066cc] transition-colors">{dict.privacyPolicy}</Link>. {dict.noSpam}
                            </p>
                        </form>
                    )}
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-20">
                {[
                    { title: dict.feature1Title, desc: dict.feature1Desc },
                    { title: dict.feature2Title, desc: dict.feature2Desc },
                    { title: dict.feature3Title, desc: dict.feature3Desc }
                ].map((feature, i) => (
                    <div key={i} className="flex flex-col items-center text-center space-y-4">
                        <h3 className="text-[18px] font-bold text-[#1d1d1f]">{feature.title}</h3>
                        <p className="text-[15px] text-[#86868b] leading-relaxed">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
