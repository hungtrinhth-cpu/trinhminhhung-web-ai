import { NextResponse } from "next/server";
import { updateSession } from './lib/supabase/middleware'

let locales = ['vi', 'en']
let defaultLocale = 'vi'

function getLocale(request) {
  // Try to get locale from cookie, then headers, fallback to default
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage && acceptLanguage.includes('en')) {
    return 'en'
  }
  return defaultLocale
}

export async function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  let response = NextResponse.next();

  if (!pathnameHasLocale) {
    // Redirect if there is no locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    response = NextResponse.redirect(request.nextUrl)
  }

  // Update Supabase session (skip if env vars not configured)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return await updateSession(request, response)
  }
  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
