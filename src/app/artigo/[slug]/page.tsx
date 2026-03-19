
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdPlaceholder from '@/components/AdPlaceholder'
import ArticleCard from '@/components/ArticleCard'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Share2, Clock, Calendar, User, ChevronRight } from 'lucide-react'
import ShareButtons from '@/components/ShareButtons'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        const article = await prisma.article.findUnique({ where: { slug: params.slug } })
        if (!article) return {}

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tecnomais.online'
        const articleUrl = `${siteUrl}/artigo/${article.slug}`

        return {
            title: article.seoTitle || article.title,
            description: article.seoDesc || article.excerpt,
            alternates: {
                canonical: articleUrl,
            },
            openGraph: {
                title: article.title,
                description: article.excerpt,
                images: [{ url: article.featuredImage || '', alt: article.title }],
                type: 'article',
                url: articleUrl,
                publishedTime: article.publishedDate.toISOString(),
                authors: [article.author],
                siteName: 'TecnoMais',
            },
            twitter: {
                card: 'summary_large_image',
                title: article.title,
                description: article.excerpt,
                images: [article.featuredImage || ''],
            },
        }
    } catch (e) {
        return { title: 'Article | TecnoMais' }
    }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    let article;
    try {
        article = await prisma.article.findUnique({
            where: { slug: params.slug },
            include: { 
                categories: true,
                tags: true
            }
        })
    } catch (error) {
        console.error('Error fetching article:', error);
    }

    // Handle empty state gracefully
    if (!article) {
        return (
            <>
                <Navbar theme="dark" />
                <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-white">
                    <h1 className="text-[40px] font-bold text-[#1d1d1f] mb-4">Article Not Found</h1>
                    <p className="text-[19px] text-[#86868b] mb-8 text-center max-w-md">The article you are looking for doesn't exist or has been moved.</p>
                    <Link href="/" className="btn-apple-primary">Back to Homepage</Link>
                </div>
                <Footer />
            </>
        )
    }

    // Calculate reading time roughly
    const wordCount = article.content.split(/\s+/).length
    const readingTime = Math.ceil(wordCount / 200)

    // Fetch related articles (same categories, exclude current)
    let relatedArticles: any[] = []
    try {
        relatedArticles = await prisma.article.findMany({
            where: {
                categoryIds: { hasSome: article.categoryIds || [] },
                id: { not: article.id }
            },
            orderBy: { publishedDate: 'desc' },
            take: 3,
            include: { categories: true }
        })
    } catch (e) {
        console.error('Error fetching related articles:', e);
    }

    // Fetch trending for sidebar
    let trendingArticles: any[] = []
    try {
        trendingArticles = await prisma.article.findMany({
            where: { id: { not: article.id } },
            orderBy: { publishedDate: 'desc' },
            take: 5
        })
    } catch (e) {
        console.error('Error fetching trending for article sidebar:', e);
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tecnomais.online'
    const shareUrl = `${siteUrl}/artigo/${article.slug}`
    const shareTitle = article.title

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        description: article.excerpt,
        image: article.featuredImage ? [article.featuredImage] : [],
        datePublished: article.publishedDate.toISOString(),
        dateModified: (article as any).updatedAt?.toISOString() || article.publishedDate.toISOString(),
        author: {
            '@type': 'Person',
            name: article.author,
            url: `${siteUrl}/autor/${encodeURIComponent(article.author)}`,
        },
        publisher: {
            '@type': 'Organization',
            name: 'TecnoMais',
            url: siteUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${siteUrl}/favicon-32x32.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': shareUrl,
        },
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar theme="dark" />
            <main className="min-h-screen bg-white">

                {/* --- FULL SCREEN SPLIT HERO --- */}
                <section className="relative w-full lg:h-screen flex flex-col lg:flex-row overflow-hidden border-b border-gray-100">
                    
                    {/* Left Side: Image */}
                    <div className="relative w-full lg:w-1/2 h-[45vh] lg:h-full bg-gray-900">
                        <Image
                            src={article.featuredImage || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200'}
                            alt={article.title}
                            fill
                            priority
                            className="object-cover opacity-90 transition-transform duration-1000 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent lg:hidden" />
                    </div>

                    {/* Right Side: Content Box */}
                    <div className="w-full lg:w-1/2 min-h-[55vh] lg:h-full bg-[#1d1d1f] text-white flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 lg:py-0">
                        <div className="max-w-xl">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="flex flex-wrap items-center gap-2 mb-8">
                                    {(article as any).categories?.length > 0 ? (article as any).categories.map((cat: any) => (
                                        <Link 
                                            key={cat.id}
                                            href={`/categoria/${cat.slug}`}
                                            className="bg-[#0066cc] text-white px-3 py-1 rounded text-[11px] font-bold uppercase tracking-[0.2em]"
                                        >
                                            {cat.name}
                                        </Link>
                                    )) : (
                                        <span className="bg-[#0066cc] text-white px-4 py-1 rounded text-[12px] font-bold uppercase tracking-[0.2em]">
                                            News
                                        </span>
                                    )}
                                </div>
                                <div className="h-[1px] flex-1 bg-white/20"></div>
                            </div>

                            <h1 className="text-[36px] md:text-[52px] lg:text-[60px] font-extrabold leading-[1.1] tracking-tight mb-10 translate-x-[-2px]">
                                {article.title}
                            </h1>

                            <div className="flex flex-col space-y-8">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-[#0066cc] rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {article.author.charAt(0)}
                                    </div>
                                    <div>
                                        <Link href={`/autor/${encodeURIComponent(article.author)}`} className="text-[17px] font-bold text-white hover:text-[#0066cc] transition-colors hover:underline decoration-white/30 underline-offset-4">
                                            {article.author}
                                        </Link>
                                        <p className="text-[14px] text-gray-400 font-medium">
                                            {new Date(article.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} &bull; {readingTime} min read
                                        </p>
                                    </div>
                                </div>

                                <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} />
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center animate-bounce opacity-50">
                        <div className="w-[1px] h-12 bg-white"></div>
                    </div>
                </section>

                <div className="py-20 bg-white">
                    <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-16">
                        
                        {/* Left Sticky Share Bar */}
                        <aside className="hidden xl:block w-12 pt-10">
                            <ShareButtons shareUrl={shareUrl} shareTitle={shareTitle} variant="sticky" />
                        </aside>


                    {/* Main Content */}
                    <article className="lg:flex-1 max-w-3xl mx-auto lg:mx-0">
                        <div
                            className="mt-8 mb-16 prose-content"
                            dangerouslySetInnerHTML={{ 
                                __html: article.content
                                    .replace(/&lt;/g, '<')
                                    .replace(/&gt;/g, '>')
                                    .replace(/&quot;/g, '"')
                                    .replace(/&#39;/g, "'")
                                    .replace(/&amp;/g, '&')
                            }}
                        />
                        
                        {article.tags && article.tags.length > 0 && (
                            <div className="mb-16 pt-12 border-t border-gray-100">
                                <h4 className="text-[13px] uppercase tracking-[0.2em] font-black text-gray-400 mb-6">Article Topics</h4>
                                <div className="flex flex-wrap gap-2">
                                    {article.tags.map((tag: any) => (
                                        <Link 
                                            key={tag.id} 
                                            href={`/categoria/${tag.slug || 'news'}`}
                                            className="px-5 py-2 bg-gray-50 text-[#1d1d1f] rounded-full text-[14px] font-bold border border-gray-200 hover:bg-[#0066cc] hover:text-white hover:border-[#0066cc] transition-all transform hover:-translate-y-0.5"
                                        >
                                            #{tag.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                   </article>

                    {/* Sidebar */}
                    <aside className="lg:w-[320px]">
                        <div className="sticky top-32 space-y-12">
                            <div>
                                <h3 className="text-[14px] uppercase tracking-widest font-bold text-[#1d1d1f] mb-6 flex items-center">
                                    <div className="w-1 h-4 bg-[#0066cc] mr-3"></div>
                                    The Latest
                                </h3>
                                <div className="space-y-8">
                                    {trendingArticles.map((trending: any) => (
                                        <div key={trending.id} className="group block cursor-pointer">
                                            <Link href={`/artigo/${trending.slug}`} className="block">
                                                <h4 className="text-[18px] font-bold leading-[1.3] text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors line-clamp-3">
                                                    {trending.title}
                                                </h4>
                                            </Link>
                                            <div className="flex items-center mt-3 text-[13px] font-medium text-[#86868b] uppercase tracking-wider">
                                                <Link href={`/autor/${encodeURIComponent(trending.author)}`} className="hover:text-[#0066cc] transition-colors hover:underline">
                                                    {trending.author}
                                                </Link>
                                                <span className="mx-2">&bull;</span>
                                                <span>{new Date(trending.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="bg-[#f5f5f7] p-8 rounded-[32px] border border-gray-100 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0066cc]/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                                <h4 className="relative z-10 text-[20px] font-bold mb-4">Newsletter</h4>
                                <p className="relative z-10 text-[15px] text-[#424245] mb-6">Get the most important tech news in your inbox.</p>
                                <Link 
                                    href="/newsletter" 
                                    className="relative z-10 block w-full btn-apple-primary !py-2.5 !text-[15px] text-center"
                                >
                                    Subscribe
                                </Link>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

                {/* Suggested Articles */}
                {relatedArticles.length > 0 && (
                    <div className="bg-[#f5f5f7] py-24 mt-24 border-t border-gray-200/50 w-full">
                        <section className="container mx-auto px-6 max-w-7xl">
                            <div className="text-center mb-12">
                                <h2 className="text-[32px] font-bold tracking-tight text-[#1d1d1f]">Related Reading</h2>
                                <p className="text-[19px] text-[#86868b] mt-4">Continue exploring related topics</p>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {relatedArticles.map((relArticle: any) => (
                                    <ArticleCard key={relArticle.id} article={relArticle} />
                                ))}
                            </div>
                        </section>
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}
