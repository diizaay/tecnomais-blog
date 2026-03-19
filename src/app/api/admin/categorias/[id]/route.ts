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

        const updateData = {
            name: data.name,
            slug: data.slug,
        }

        await db.collection('Category').updateOne(
            { _id: new ObjectId(params.id) },
            { $set: updateData }
        )
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

        await db.collection('Category').deleteOne({ _id: new ObjectId(params.id) })
        return new NextResponse(null, { status: 204 })
    } catch (error: any) {
        console.error(error)
        return new NextResponse(error.message || 'Internal Error', { status: 500 })
    }
}
