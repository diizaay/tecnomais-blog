import { MongoClient } from 'mongodb'

const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    // @ts-expect-error
    if (!global._mongoClientPromise) {
        const uri = process.env.DATABASE_URL
        if (uri) {
            client = new MongoClient(uri, options)
            // @ts-expect-error
            global._mongoClientPromise = client.connect()
        }
    }
    // @ts-expect-error
    clientPromise = global._mongoClientPromise
} else {
    // In production mode, it's best to not use a global variable.
    const uri = process.env.DATABASE_URL
    if (uri) {
        client = new MongoClient(uri, options)
        clientPromise = client.connect()
    } else {
        // Return a dummy promise that will fail at runtime if the DB is actually hit, 
        // but won't crash the build process at the top level.
        clientPromise = Promise.reject(new Error('DATABASE_URL is missing'))
    }
}

export default clientPromise
