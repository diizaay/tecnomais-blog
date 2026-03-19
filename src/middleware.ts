import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// The public-facing admin slug — set in env var, defaults to a non-obvious name
const ADMIN_SLUG = process.env.ADMIN_PANEL_SLUG || 'tn-cms-portal'

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // 1. Block direct access to /admin — anyone knowing the real folder gets a 404
    if (pathname.startsWith('/admin')) {
        return NextResponse.rewrite(new URL('/not-found', request.url))
    }

    // 2. Rewrite /tn-cms-portal/* → /admin/* internally
    if (pathname.startsWith(`/${ADMIN_SLUG}`)) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })

        // Not authenticated → redirect to login
        if (!token) {
            const loginUrl = new URL('/login', request.url)
            loginUrl.searchParams.set('callbackUrl', request.url)
            return NextResponse.redirect(loginUrl)
        }

        // Rewrite to /admin/* internally
        const newPath = pathname.replace(`/${ADMIN_SLUG}`, '/admin')
        const rewriteUrl = new URL(newPath, request.url)
        rewriteUrl.search = request.nextUrl.search
        return NextResponse.rewrite(rewriteUrl)
    }

    // 3. Block unauthenticated access to /api/admin/*
    if (pathname.startsWith('/api/admin')) {
        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET,
        })
        if (!token) {
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/tn-cms-portal/:path*',
        '/((?!tn-cms-portal)[^/]+)-cms-portal/:path*',
        '/api/admin/:path*',
    ],
}
