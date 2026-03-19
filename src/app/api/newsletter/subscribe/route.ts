import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { sendSubscriptionEmail } from '@/lib/mail'

// Use DATABASE_URL from .env
const uri = process.env.DATABASE_URL || ""
const client = new MongoClient(uri)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 })
    }

    await client.connect()
    const db = client.db()
    // Prisma usually names the collection lowercase if not specified, 
    // but with auto-generation it might be 'Subscriber'. 
    // Let's use 'Subscriber' to match the model name.
    const subscribers = db.collection('Subscriber')

    // Upsert subscriber
    const result = await subscribers.findOneAndUpdate(
      { email },
      { 
        $set: { 
          email,
          active: true,
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true, returnDocument: 'after' }
    )

    // Send confirmation email
    try {
        await sendSubscriptionEmail(email)
    } catch (mailError) {
        console.error('Mail Error:', mailError)
        // We don't fail the whole request if only mail fails, 
        // but we should log it.
    }

    return NextResponse.json({ success: true, subscriber: result })
  } catch (error: any) {
    console.error('Newsletter Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  } finally {
    // Keep connection if possible or close? In serverless close is better for small tasks
    await client.close()
  }
}
