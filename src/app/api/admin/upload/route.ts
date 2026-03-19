import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
    const session = await getServerSession(authOptions)
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    try {
        const formData = await req.formData()
        const file = formData.get('file') as File
        
        if (!file) {
            return new NextResponse('No file provided', { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary using a promise to handle the stream-based API
        const uploadResponse = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'blog-uploads',
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(buffer)
        }) as any

        console.log('Cloudinary Upload Success:', uploadResponse.secure_url)

        return NextResponse.json({ url: uploadResponse.secure_url })

    } catch (error: any) {
        console.error('CLOUDINARY UPLOAD ERROR:', error)
        return new NextResponse(error.message || 'Error uploading to cloud', { status: 500 })
    }
}
