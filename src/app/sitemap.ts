/* eslint-disable @typescript-eslint/no-explicit-any */
import { MetadataRoute } from 'next'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

    // Fetch all articles to dynamically add to sitemap
    const articles = await prisma.article.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    })

    // Fetch all categories
    const categories = await prisma.category.findMany({
        select: {
            slug: true,
            id: true,
        },
    })

    const articleUrls = articles.map((article: any) => ({
        url: `${baseUrl}/artigo/${article.slug}`,
        lastModified: article.updatedAt,
        changeFrequency: 'weekly' as any,
        priority: 0.8,
    }))

    const categoryUrls = categories.map((cat: any) => ({
        url: `${baseUrl}/categoria/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as any,
        priority: 0.7,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...categoryUrls,
        ...articleUrls,
    ]
}
