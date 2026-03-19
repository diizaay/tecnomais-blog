'use client'

import { useState } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export default function NewsletterPage() {
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
                setError(data.error || 'Something went wrong. Please try again.')
            }
        } catch (err) {
            setError('Failed to connect to the server. Please check your connection.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white min-h-screen flex flex-col">
            <Navbar theme="light" />
            
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-none mb-6">
                            Stay Ahead.
                        </h1>
                        <p className="text-[20px] md:text-[24px] text-[#86868b] max-w-2xl mx-auto leading-relaxed">
                            Join 50,000+ tech professional getting our weekly briefing on AI, productivity, and the future of technology.
                        </p>
                    </div>

                    <div className="bg-[#f5f5f7] rounded-[3rem] p-8 md:p-16 border border-gray-100 shadow-sm">
                        <div className="max-w-md mx-auto">
                            <h2 className="text-[28px] font-bold text-[#1d1d1f] mb-8 text-center">Subscribe to TecnoMais</h2>
                            
                            {isSubmitted ? (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-2xl p-8 text-center shadow-lg border border-blue-50"
                                >
                                    <h3 className="text-[20px] font-bold text-[#1d1d1f] mb-2">Check your inbox!</h3>
                                    <p className="text-[15px] text-[#86868b]">We've sent a confirmation link to <strong>{email}</strong>.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <input 
                                            type="email" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Enter your email"
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
                                                Subscribing...
                                            </>
                                        ) : 'Subscribe Now'}
                                    </button>
                                    <p className="text-[13px] text-gray-400 text-center mt-6">
                                        By subscribing, you agree to our <Link href="/privacy" className="underline hover:text-[#0066cc] transition-colors">Privacy Policy</Link>. No spam, ever.
                                    </p>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mt-20">
                        {[
                            { title: 'Weekly Insights', desc: 'Curated deep dives into the most important tech stories.' },
                            { title: 'Early Access', desc: 'Be the first to know about new tools and exclusive reports.' },
                            { title: 'Expert Curation', desc: 'No noise. Just high-signal information for your career.' }
                        ].map((feature, i) => (
                            <div key={i} className="flex flex-col items-center text-center space-y-4">
                                <h3 className="text-[18px] font-bold text-[#1d1d1f]">{feature.title}</h3>
                                <p className="text-[15px] text-[#86868b] leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
