'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Trash2, Search, Download, Users } from 'lucide-react'

interface Subscriber {
    id: string
    email: string
    name: string | null
    createdAt: string
}

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchSubscribers()
    }, [])

    const fetchSubscribers = async () => {
        try {
            const res = await fetch('/api/admin/subscribers')
            const data = await res.json()
            if (Array.isArray(data)) {
                setSubscribers(data)
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error)
        } finally {
            setLoading(false)
        }
    }

    const deleteSubscriber = async (id: string) => {
        if (!confirm('Are you sure you want to remove this subscriber?')) return

        try {
            const res = await fetch('/api/admin/subscribers', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            })
            if (res.ok) {
                setSubscribers(subscribers.filter(s => s.id !== id))
            }
        } catch (error) {
            console.error('Error deleting subscriber:', error)
        }
    }

    const filteredSubscribers = subscribers.filter(s => 
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.name && s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const exportToCSV = () => {
        const headers = ['Email', 'Name', 'Subscription Date']
        const csvContent = [
            headers.join(','),
            ...subscribers.map(s => `"${s.email}","${s.name || ''}","${new Date(s.createdAt).toLocaleDateString()}"`)
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-[32px] font-bold text-[#1d1d1f] flex items-center gap-3">
                        <Users className="text-[#0066cc]" />
                        Subscribers
                    </h1>
                    <p className="text-[#86868b]">Manage your newsletter mailing list ({subscribers.length})</p>
                </div>
                <button 
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-[#0066cc] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-[#0055b3] transition-colors"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text"
                            placeholder="Search by email or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-[15px] focus:outline-none focus:border-[#0066cc]/30 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/50 text-left text-[13px] font-semibold text-[#86868b] uppercase tracking-wider">
                                <th className="px-6 py-4">Subscriber</th>
                                <th className="px-6 py-4">Joined Date</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                                        <td className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-6"><div className="h-8 bg-gray-100 rounded-lg w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : filteredSubscribers.length > 0 ? (
                                filteredSubscribers.map((subscriber) => (
                                    <motion.tr 
                                        key={subscriber.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-gray-50/50 transition-colors"
                                    >
                                        <td className="px-6 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] font-semibold text-[#1d1d1f]">{subscriber.email}</span>
                                                {subscriber.name && <span className="text-[13px] text-[#86868b]">{subscriber.name}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6">
                                            <span className="text-[14px] text-[#86868b]">
                                                {new Date(subscriber.createdAt).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-6 text-right">
                                            <button 
                                                onClick={() => deleteSubscriber(subscriber.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                                                <Mail className="text-gray-300" size={32} />
                                            </div>
                                            <p className="text-[#86868b]">No subscribers found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
