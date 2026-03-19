import { MongoClient } from 'mongodb'

if (!process.env.DATABASE_URL) {
    throw new Error('Invalid/Missing environment variable: "DATABASE_URL"')
}

const uri = process.env.DATABASE_URL
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// @ts-ignore
if (process.env.NODE_ENV === 'development') {
    // @ts-ignore
    if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        // @ts-ignore
        global._mongoClientPromise = client.connect()
    }
    // @ts-ignore
    clientPromise = global._mongoClientPromise
} else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
}

export default clientPromise
