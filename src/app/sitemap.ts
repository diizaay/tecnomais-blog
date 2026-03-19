import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tecnomais.online'

    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1.0,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/newsletter`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.4,
        },
    ]

    // Defensive check for build time or missing config
    if (!process.env.DATABASE_URL) {
        return staticPages
    }

    try {
        // Dynamic import to avoid top-level issues during build
        const { default: prisma } = await import('@/lib/prisma')

        // Fetch articles and categories
        const [articles, categories] = await Promise.all([
            prisma.article.findMany({
                select: { slug: true, updatedAt: true, publishedDate: true }
            }),
            prisma.category.findMany({
                select: { slug: true }
            })
        ]).catch(() => [[], []])

        const articleUrls = articles.map((article: any) => ({
            url: `${baseUrl}/artigo/${article.slug}`,
            lastModified: article.updatedAt || article.publishedDate,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        const categoryUrls = categories.map((cat: any) => ({
            url: `${baseUrl}/categoria/${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
        }))

        return [...staticPages, ...categoryUrls, ...articleUrls]
    } catch (error) {
        console.error('Sitemap generation error:', error)
        return staticPages
    }
}
