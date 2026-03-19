import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const data = await req.json()
        const client = await clientPromise
        const db = client.db()
        
        // Handle tags: convert comma-separated string to tag IDs using raw Mongo
        const tagNames = data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
        const tagIds: ObjectId[] = []

        for (const name of tagNames) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            let tag = await db.collection('Tag').findOne({ slug })
            
            if (!tag) {
                const result = await db.collection('Tag').insertOne({
                    name,
                    slug,
                    articleIds: []
                })
                tagIds.push(result.insertedId)
            } else {
                tagIds.push(tag._id)
            }
        }

        // Convert category strings to ObjectIds
        const categoryIds = (data.categoryIds || []).map((id: string) => new ObjectId(id))

        const newArticle = {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            author: data.author || 'Admin',
            featuredImage: data.featuredImage || null,
            categoryIds: categoryIds,
            tagIds: tagIds,
            publishedDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        const result = await db.collection('Article').insertOne(newArticle)
        
        // Update tags and categories to include this article ID (non-transactional)
        const articleId = result.insertedId
        if (tagIds.length > 0) {
            await db.collection('Tag').updateMany(
                { _id: { $in: tagIds } },
                { $addToSet: { articleIds: articleId } } as any
            )
        }
        if (categoryIds.length > 0) {
            await db.collection('Category').updateMany(
                { _id: { $in: categoryIds } },
                { $addToSet: { articleIds: articleId } } as any
            )
        }
        
        return NextResponse.json({ id: articleId.toString(), ...newArticle })
    } catch (error: any) {
        console.error(error)
        return new NextResponse(error.message || 'Internal Error', { status: 500 })
    }
}
