import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'pt']
const defaultLocale = 'en'
const ADMIN_SLUG = process.env.ADMIN_PANEL_SLUG || 'tecnomais-portal'

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  
  return matchLocale(languages, locales, defaultLocale)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Skip if it's an API route or a static asset
  if (
    pathname.startsWith('/api/') ||
    pathname.includes('.') || // matches .png, .ico, .txt etc
    pathname.startsWith('/_next')
  ) {
    // Special check for ADMIN internally rewrites
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

  // 2. Handle Admin Redirect (Global)
  if (pathname === '/admin') {
      return NextResponse.redirect(new URL(`/${ADMIN_SLUG}`, request.url))
  }

  // 3. Handle Admin Portal Rewrite (Keep it global for now to avoid double login complexity)
  if (pathname.startsWith(`/${ADMIN_SLUG}`)) {
      const token = await getToken({
          req: request,
          secret: process.env.NEXTAUTH_SECRET,
      })

      if (!token) {
          const loginUrl = new URL('/login', request.url)
          loginUrl.searchParams.set('callbackUrl', request.url)
          return NextResponse.redirect(loginUrl)
      }

      const newPath = pathname.replace(`/${ADMIN_SLUG}`, '/admin')
      const rewriteUrl = new URL(newPath, request.url)
      rewriteUrl.search = request.nextUrl.search
      return NextResponse.rewrite(rewriteUrl)
  }

  // 4. Check if the pathname is missing a locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request)

    // e.g. /article/x -> /en/article/x
    return NextResponse.redirect(
      new URL(
        `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`,
        request.url
      )
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
