import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(request: Request) {
    let query = ''
    try {
        const { searchParams } = new URL(request.url)
        query = searchParams.get('q') || ''
    } catch (e) {
        return NextResponse.json({ articles: [] })
    }

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
