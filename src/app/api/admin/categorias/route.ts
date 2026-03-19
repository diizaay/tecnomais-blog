import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import clientPromise from '@/lib/mongodb'

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const data = await req.json()
        const client = await clientPromise
        const db = client.db()

        const category = {
            name: data.name,
            slug: data.slug,
        }

        const result = await db.collection('Category').insertOne(category)
        return NextResponse.json({ id: result.insertedId.toString(), ...category })
    } catch (error: any) {
        console.error(error)
        return new NextResponse(error.message || 'Internal Error', { status: 500 })
    }
}
