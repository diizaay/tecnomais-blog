import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const data = await req.json()
        const client = await clientPromise
        const db = client.db()
        const articleObjectId = new ObjectId(params.id)
        
        // Handle tags: convert comma-separated string to tag IDs
        const tagNames = data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []
        const tagIds: ObjectId[] = []

        for (const name of tagNames) {
            const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            let tag = await db.collection('Tag').findOne({ slug })
            
            if (!tag) {
                const result = await db.collection('Tag').insertOne({
                    name,
                    slug,
                    articleIds: [articleObjectId]
                })
                tagIds.push(result.insertedId)
            } else {
                tagIds.push(tag._id)
                // Ensure articleId is in tag's articleIds
                await db.collection('Tag').updateOne(
                    { _id: tag._id },
                    { $addToSet: { articleIds: articleObjectId } } as any
                )
            }
        }

        // Convert category strings to ObjectIds
        const categoryIds = (data.categoryIds || []).map((id: string) => new ObjectId(id))

        const updateData = {
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            featuredImage: data.featuredImage || null,
            categoryIds: categoryIds,
            tagIds: tagIds,
            author: data.author,
            updatedAt: new Date()
        }

        await db.collection('Article').updateOne(
            { _id: articleObjectId },
            { $set: updateData }
        )

        // Update categories to include this article ID
        if (categoryIds.length > 0) {
            await db.collection('Category').updateMany(
                { _id: { $in: categoryIds } },
                { $addToSet: { articleIds: articleObjectId } } as any
            )
        }

        return NextResponse.json({ id: params.id, ...updateData })
    } catch (error: any) {
        console.error(error)
        return new NextResponse(error.message || 'Internal Error', { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const client = await clientPromise
        const db = client.db()
        const articleObjectId = new ObjectId(params.id)

        await db.collection('Article').deleteOne({ _id: articleObjectId })
        
        // Optionally remove articleId from tags/categories
        await db.collection('Tag').updateMany(
            {},
            { $pull: { articleIds: articleObjectId } } as any
        )
        await db.collection('Category').updateMany(
            {},
            { $pull: { articleIds: articleObjectId } } as any
        )

        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        console.error(error)
        return new NextResponse(error.message || 'Internal Error', { status: 500 })
    }
}
