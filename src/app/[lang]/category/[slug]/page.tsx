import prisma from '@/lib/prisma'
import ArticleCard from '@/components/ArticleCard'
import AdPlaceholder from '@/components/AdPlaceholder'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getDictionary, Locale } from '@/lib/get-dictionary'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({ params: { lang, slug } }: { params: { lang: Locale, slug: string } }) {
    const dict = await getDictionary(lang)
    try {
        const categorySlug = slug

        let categoryName = lang === 'pt' ? 'Todas as Categorias' : "All Categories"
        let articles: any[] = []

        if (categorySlug === 'todas' || categorySlug === 'all') {
            articles = await (prisma as any).article.findMany({
                where: { language: lang },
                orderBy: { publishedDate: 'desc' },
                include: { categories: true, author: true }
            }).catch((e: any) => {
                console.error('Error fetching all articles for category:', e);
                return [];
            })

            // Fallback for EN if empty
            if (articles.length === 0 && lang === 'en') {
                articles = await (prisma as any).article.findMany({
                    where: { language: 'pt' },
                    orderBy: { publishedDate: 'desc' },
                    include: { categories: true, author: true }
                });
            }
        } else {
            const category = await (prisma as any).category.findFirst({
                where: { slug: categorySlug, language: lang }
            }).catch((e: any) => {
                console.error('Error fetching category meta:', e);
                return null;
            })
            
            if (!category) {
                // Try fallback to PT category if EN is requested
                if (lang === 'en') {
                    const fallbackCat = await (prisma as any).category.findFirst({
                        where: { slug: categorySlug, language: 'pt' }
                    });
                    if (fallbackCat) {
                        categoryName = fallbackCat.name
                        articles = await (prisma as any).article.findMany({
                            where: { categoryIds: { has: fallbackCat.id }, language: 'pt' },
                            orderBy: { publishedDate: 'desc' },
                            include: { categories: true, author: true }
                        });
                        return renderCategory(categoryName, articles, lang, dict)
                    }
                }

                return (
                    <div className="min-h-screen flex flex-col items-center justify-center pt-24 bg-white">
                        <h1 className="text-[40px] font-bold text-[#1d1d1f] mb-4">{lang === 'pt' ? 'Categoria Não Encontrada' : 'Category Not Found'}</h1>
                        <p className="text-[19px] text-[#86868b] mb-8 text-center max-w-md">{lang === 'pt' ? 'O tópico que você procura ainda não existe.' : "The topic you are looking for doesn't exist yet."}</p>
                        <Link href={`/${lang}`} className="btn-apple-primary">{dict.article.backHome}</Link>
                    </div>
                )
            } else {
                categoryName = category.name
                articles = await (prisma as any).article.findMany({
                    where: { categoryIds: { has: category.id }, language: lang },
                    orderBy: { publishedDate: 'desc' },
                    include: { categories: true, author: true }
                }).catch((e: any) => {
                    console.error('Error fetching articles for category:', e);
                    return [];
                })

                if (articles.length === 0 && lang === 'en') {
                    // Fallback to PT articles in same category slug if exists in PT
                    const ptCat = await (prisma as any).category.findFirst({ where: { slug: categorySlug, language: 'pt' } });
                    if (ptCat) {
                        articles = await (prisma as any).article.findMany({
                            where: { categoryIds: { has: ptCat.id }, language: 'pt' },
                            orderBy: { publishedDate: 'desc' },
                            include: { categories: true, author: true }
                        });
                    }
                }
            }
        }

        return renderCategory(categoryName, articles, lang, dict)
    } catch (error) {
        console.error('CRITICAL CATEGORY PAGE ERROR:', error);
        return (
            <div className="p-20 text-center">
                <h1 className="text-4xl font-bold text-red-600">Error</h1>
                <p className="mt-4">Generic error message.</p>
            </div>
        )
    }
}

function renderCategory(categoryName: string, articles: any[], lang: string, dict: any) {
    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="container mx-auto px-6 max-w-7xl">
                <header className="mb-16 text-center">
                    <h1 className="h-section mb-4 capitalize">{categoryName}</h1>
                    <p className="text-[21px] text-[#86868b]">{lang === 'pt' ? `Explore os artigos mais recentes sobre ${categoryName.toLowerCase()}.` : `Explore the latest articles about ${categoryName.toLowerCase()}.`}</p>
                </header>

                <AdPlaceholder position="header" />

                {articles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 mb-16">
                        {articles.map((article: any) => (
                            <ArticleCard key={article.id} article={article} lang={lang} />
                        ))}
                    </div>
                ) : (
                    <div className="py-24 text-center">
                        <p className="text-[21px] text-[#86868b]">{lang === 'pt' ? 'Ainda não existem artigos nesta categoria.' : 'There are no articles in this category yet.'}</p>
                    </div>
                )}

                <AdPlaceholder position="footer" />
            </div>
        </main>
    )
}

