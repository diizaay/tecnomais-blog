'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        })

        if (res?.error) {
            setError('Invalid credentials')
        } else {
            router.push('/admin')
            router.refresh()
        }
    }

    return (
        <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center p-6">
            <div className="apple-card max-w-md w-full p-10 bg-white">
                <div className="text-center mb-8">
                    <Link href="/" className="font-bold text-[24px] tracking-tight inline-block mb-2">
                        Tech<span className="text-[#0066cc]">Blog</span> Admin
                    </Link>
                    <p className="text-[15px] text-[#86868b]">Secured Dashboard Access</p>
                </div>

                {error && (
                    <div className="p-4 mb-6 text-sm text-red-800 rounded-xl bg-red-50">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]"
                        />
                    </div>
                    <div>
                        <label className="block text-[14px] font-medium text-[#1d1d1f] mb-2">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0066cc]"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[#1d1d1f] text-white px-6 py-3 rounded-xl font-medium hover:bg-black transition-colors transform active:scale-95">
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-gray-100 pt-6">
                    <Link href="/" className="text-[14px] text-[#0066cc] hover:underline">
                        &larr; Back to Platform
                    </Link>
                </div>
            </div>
        </div>
    )
}
