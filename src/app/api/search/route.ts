import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export async function GET(request: NextRequest) {
    try {
        const query = request.nextUrl.searchParams.get('q')

        if (!query || query.length < 2) {
            return NextResponse.json({ articles: [] })
        }

        // Defensive check for build time
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({ articles: [] })
        }

        // Dynamic import to avoid top-level Prisma instantiation during build
        const { default: prisma } = await import('@/lib/prisma')

        const articles = await (prisma as any).article.findMany({
            where: {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { excerpt: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                    { author: { name: { contains: query, mode: 'insensitive' } } }
                ]
            } as any,
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
        return NextResponse.json({ articles: [] }, { status: 500 })
    }
}
