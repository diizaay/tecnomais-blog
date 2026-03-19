import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query || query.length < 2) {
        return NextResponse.json({ articles: [] })
    }

    try {
        const articles = await prisma.article.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { excerpt: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                    { author: { contains: query, mode: 'insensitive' } }
                ]
            },
            take: 8,
            orderBy: {
                publishedDate: 'desc'
            },
            include: {
                categories: true
            }
        })

        return NextResponse.json({ articles })
    } catch (error) {
        console.error('Search error:', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
