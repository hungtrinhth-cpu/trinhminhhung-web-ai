import { NextResponse } from "next/server";
import { updateSession } from './lib/supabase/middleware'

let locales = ['vi', 'en']
let defaultLocale = 'vi'

function getLocale(request) {
  // Respect user's explicit choice stored in cookie
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }
  // Fall back to browser language preference
  const acceptLanguage = request.headers.get('accept-language')
  if (acceptLanguage && acceptLanguage.includes('en')) {
    return 'en'
  }
  return defaultLocale
}

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const currentLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  let response = NextResponse.next()

  if (!currentLocale) {
    // No locale in URL — redirect to the user's preferred locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    response = NextResponse.redirect(request.nextUrl)
  } else {
    // Locale is already in URL — persist it to cookie so future redirects honour it
    response.cookies.set('NEXT_LOCALE', currentLocale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax',
    })
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
