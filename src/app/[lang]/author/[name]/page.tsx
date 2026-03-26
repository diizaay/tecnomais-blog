import prisma from '@/lib/prisma'
import ArticleCard from '@/components/ArticleCard'
import OptimizedCloudinaryImage from '@/components/OptimizedCloudinaryImage'
import Link from 'next/link'
import { Mail, MessageSquare } from 'lucide-react'
import { getDictionary, Locale } from '@/lib/get-dictionary'

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

export default async function AuthorPage({ params: { lang, name } }: { params: { lang: Locale, name: string } }) {
    const dict = await getDictionary(lang)
    const aut = dict.author
    const decodedParam = decodeURIComponent(name)
    
    // 1. Find the author record
    let author = await (prisma as any).author.findFirst({
        where: {
            OR: [
                { slug: name },
                { name: decodedParam },
                { slug: decodedParam.toLowerCase().replace(/\s+/g, '-') }
            ],
            language: lang
        }
    })

    // Fallback to PT author if EN is requested but not found
    if (!author && lang === 'en') {
        author = await (prisma as any).author.findFirst({
            where: {
                OR: [
                    { slug: name },
                    { name: decodedParam },
                    { slug: decodedParam.toLowerCase().replace(/\s+/g, '-') }
                ],
                language: 'pt'
            }
        })
    }

    if (!author) {
        return (
            <div className="bg-[#f5f5f7] min-h-screen flex flex-col">
                <main className="flex-grow pt-32 pb-20 container mx-auto px-6 text-center">
                    <h1 className="text-4xl font-bold mb-4 font-apple-heavy">{aut.notFound}</h1>
                    <p className="text-gray-500 mb-8 font-apple-medium text-lg">{aut.notFoundDesc} "{decodedParam}".</p>
                    <Link href={`/${lang}`} className="btn-apple-primary">{dict.article.backHome}</Link>
                </main>
            </div>
        )
    }
    
    // 2. Fetch articles by this author's ID
    let articles = await (prisma as any).article.findMany({
        where: {
            authorId: author.id,
            language: lang
        },
        orderBy: {
            publishedDate: 'desc'
        },
        include: {
            categories: true,
            author: true
        }
    })

    if (articles.length === 0 && lang === 'en') {
        // Find PT version of this author to get their articles
        const ptAuthor = author.language === 'pt' ? author : await (prisma as any).author.findFirst({
            where: { slug: author.slug, language: 'pt' }
        });
        
        if (ptAuthor) {
            articles = await (prisma as any).article.findMany({
                where: { authorId: ptAuthor.id, language: 'pt' },
                orderBy: { publishedDate: 'desc' },
                include: { categories: true, author: true }
            });
        }
    }

    const authorMeta = {
        name: author.name,
        bio: author.bio || (lang === 'pt' ? `${author.name} cobre tendências tecnológicas e inovação para o TecnoMais.` : `${author.name} covers technology trends and innovation for TecnoMais.`),
        email: `${author.name.toLowerCase().replace(/\s+/g, '.')}@tecnomais.online`,
        avatar: author.avatar || 'https://res.cloudinary.com/djap3064v/image/upload/v1773819142/Sem_T%C3%ADtulo_off5ej.png',
        socials: [
            { name: 'X', url: '#' }
        ]
    }

    return (
        <div className="bg-[#f5f5f7] min-h-screen flex flex-col">
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-5xl mb-16">
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex-1 space-y-6">
                            <h1 className="text-[40px] md:text-[56px] font-extrabold tracking-tight text-[#1d1d1f] leading-none">
                                {authorMeta.name}
                            </h1>
                            <p className="text-[19px] md:text-[21px] text-[#424245] leading-relaxed max-w-2xl">
                                {authorMeta.bio}
                            </p>
                            
                            <div className="space-y-4">
                                <p className="text-[15px] text-[#86868b]">
                                    {aut.contactText} {authorMeta.name.split(' ')[0]} {aut.emailText}
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
                            <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-3xl overflow-hidden shadow-2xl border-8 border-white group">
                                <OptimizedCloudinaryImage
                                    src={authorMeta.avatar}
                                    alt={authorMeta.name}
                                    width={300}
                                    height={300}
                                    type="thumbnail"
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="flex items-center justify-between mb-10 pb-4 border-b border-gray-200/60">
                        <h2 className="text-[22px] font-bold text-[#1d1d1f] flex items-center gap-3">
                            {aut.latestFrom} {authorMeta.name}
                            <span className="text-[14px] font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">{articles.length} {aut.articles}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {articles.length > 0 ? (
                            articles.map((article: any) => (
                                <ArticleCard key={article.id} article={article} lang={lang} />
                            ))
                        ) : (
                            <div className="col-span-full py-24 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                                <p className="text-gray-400 text-[18px]">{aut.noArticles}</p>
                                <Link href={`/${lang}`} className="text-[#0066cc] font-bold mt-4 inline-block hover:underline">{aut.discoverOther} &rarr;</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

