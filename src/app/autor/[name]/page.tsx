import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import Image from 'next/image'
import Link from 'next/link'
import { Mail, MessageSquare } from 'lucide-react'

// Custom X logo since lucide doesn't have it yet
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

export default async function AuthorPage({ params }: { params: { name: string } }) {
    const authorName = decodeURIComponent(params.name)
    
    // Fetch articles by this author
    const articles = await (prisma as any).article.findMany({
        where: {
            author: authorName
        },
        orderBy: {
            publishedDate: 'desc'
        },
        include: {
            categories: true
        }
    })

    // Synthetic author meta (since we don't have an Author model yet)
    const authorMeta = {
        name: authorName,
        bio: `${authorName} covers technology trends, AI breakthroughs, and software engineering for TecnoMais.`,
        email: `${authorName.toLowerCase().replace(/\s+/g, '.')}@tecnomais.online`,
        avatar: 'https://res.cloudinary.com/djap3064v/image/upload/v1773819142/Sem_T%C3%ADtulo_off5ej.png', // Placeholder
        socials: [
            { name: 'X', url: '#' }
        ]
    }

    return (
        <div className="bg-[#f5f5f7] min-h-screen flex flex-col">
            <Navbar theme="light" />
            
            <main className="flex-grow pt-32 pb-20">
                {/* Author Header Section (TechCrunch inspired) */}
                <div className="container mx-auto px-6 max-w-5xl mb-16">
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex-1 space-y-6">
                            <h1 className="text-[48px] md:text-[64px] font-extrabold tracking-tight text-[#1d1d1f] leading-none">
                                {authorMeta.name}
                            </h1>
                            <p className="text-[20px] md:text-[22px] text-[#424245] leading-relaxed max-w-2xl">
                                {authorMeta.bio}
                            </p>
                            
                            <div className="space-y-4">
                                <p className="text-[17px] text-[#424245]">
                                    You can contact or verify outreach from {authorMeta.name.split(' ')[0]} by emailing 
                                    <a href={`mailto:${authorMeta.email}`} className="text-[#0066cc] font-medium ml-1 hover:underline">
                                        {authorMeta.email}
                                    </a>
                                </p>
                                
                                <div className="flex items-center space-x-4 pt-2">
                                    <Link href="#" className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-[#1d1d1f]">
                                        <XIcon size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full md:w-auto flex justify-center">
                            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                <Image
                                    src={authorMeta.avatar}
                                    alt={authorMeta.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Articles Feed */}
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200">
                        <h2 className="text-[24px] font-bold text-[#1d1d1f]">Latest from {authorMeta.name}</h2>
                        <span className="text-gray-400 text-[15px] font-medium">{articles.length} Articles</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {articles.length > 0 ? (
                            articles.map((article: any) => (
                                <ArticleCard key={article.id} article={article} />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                                <p className="text-gray-400 text-lg">No articles discovered yet from this author.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
