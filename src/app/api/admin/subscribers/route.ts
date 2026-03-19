import { NextResponse } from 'next/server'
import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.DATABASE_URL || ""
const client = new MongoClient(uri)

export async function GET() {
  try {
    await client.connect()
    const db = client.db()
    const subscribers = await db.collection('Subscriber')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Map _id to id for frontend compatibility
    const formattedSubscribers = subscribers.map(s => ({
      ...s,
      id: s._id.toString(),
      _id: undefined
    }))

    return NextResponse.json(formattedSubscribers)
  } catch (error: any) {
    console.error('Admin Subscribers GET Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await client.connect()
    const db = client.db()
    await db.collection('Subscriber').deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin Subscribers DELETE Error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  } finally {
    await client.close()
  }
}
