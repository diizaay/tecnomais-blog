
import prisma from '@/lib/prisma'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ArticleCard from '@/components/ArticleCard'
import AdPlaceholder from '@/components/AdPlaceholder'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    try {
        const categorySlug = params.slug

        let categoryName = "All Categories"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let articles: any[] = []

        if (categorySlug === 'todas') {
            articles = await prisma.article.findMany({
                orderBy: { publishedDate: 'desc' },
                include: { categories: true }
            }).catch(e => {
                console.error('Error fetching all articles for category:', e);
                return [];
            })
        } else {
            const category = await prisma.category.findUnique({
                where: { slug: categorySlug }
            }).catch(e => {
                console.error('Error fetching category meta:', e);
                return null;
            })
            
            if (!category) {
                // Fallback if DB is empty but we want to show UI for scaffolding
                if (process.env.NODE_ENV === 'development') {
                    categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace('-', ' ')
                } else {
                    return (
                        <>
                            <Navbar />
                            <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-white">
                                <h1 className="text-[40px] font-bold text-[#1d1d1f] mb-4">Category Not Found</h1>
                                <p className="text-[19px] text-[#86868b] mb-8 text-center max-w-md">The topic you are looking for doesn't exist yet.</p>
                                <Link href="/" className="btn-apple-primary">Back to Homepage</Link>
                            </div>
                            <Footer />
                        </>
                    )
                }
            } else {
                categoryName = category.name
                articles = await prisma.article.findMany({
                    where: { categoryIds: { has: category.id } },
                    orderBy: { publishedDate: 'desc' },
                    include: { categories: true }
                }).catch(e => {
                    console.error('Error fetching articles for category:', e);
                    return [];
                })
            }
        }

        return (
            <>
                <Navbar />
                <main className="pt-32 pb-20 min-h-screen">
                    <div className="container mx-auto px-6 max-w-7xl">
                        <header className="mb-16 text-center">
                            <h1 className="h-section mb-4 capitalize">{categoryName}</h1>
                            <p className="text-[21px] text-[#86868b]">Explore the latest articles about {categoryName.toLowerCase()}.</p>
                        </header>

                        <AdPlaceholder position="header" />

                        {articles.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 mb-16">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {articles.map((article: any) => (
                                    <ArticleCard key={article.id} article={article} />
                                ))}
                            </div>
                        ) : (
                            <div className="py-24 text-center">
                                <p className="text-[21px] text-[#86868b]">There are no articles in this category yet.</p>
                            </div>
                        )}

                        <AdPlaceholder position="footer" />
                    </div>
                </main>
                <Footer />
            </>
        )
    } catch (error) {
        console.error('CRITICAL CATEGORY PAGE ERROR:', error);
        return (
            <div className="p-20 text-center">
                <h1 className="text-4xl font-bold text-red-600">Error Loading Category</h1>
                <p className="mt-4">Generic error message to prevent site-wide crash.</p>
            </div>
        )
    }
}
