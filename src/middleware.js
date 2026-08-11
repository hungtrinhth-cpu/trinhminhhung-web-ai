import { NextResponse } from "next/server";
import { createMiddlewareSupabase } from "./lib/supabase/middleware";
import { isStaffRole, roleHomePath } from "./lib/auth-helpers";

const locales = ["vi", "en"];
const defaultLocale = "vi";

const supabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getPreferredLocale(request) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage && acceptLanguage.includes("en")) {
    return "en";
  }
  return defaultLocale;
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // ── 1. Locale: ensure every path is prefixed with a supported locale ──
  const currentLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!currentLocale) {
    const locale = getPreferredLocale(request);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // Base response that carries forward any refreshed Supabase cookies.
  let response = NextResponse.next();

  // Persist the locale the user is actually viewing.
  response.cookies.set("NEXT_LOCALE", currentLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  // ── 2. Auth + route protection ──
  const segments = pathname.split("/").filter(Boolean); // ['vi','admin',...]
  const section = segments[1]; // 'admin' | 'portal' | 'auth' | undefined
  const subsection = segments[2];

  const needsAuthContext =
    supabaseConfigured &&
    (section === "admin" || section === "portal" || section === "auth");

  if (!needsAuthContext) {
    return response;
  }

  const supabase = createMiddlewareSupabase(request, response);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const loginUrl = new URL(`/${currentLocale}/auth/login`, request.url);

  // Protect /admin — staff roles only.
  if (section === "admin") {
    if (!user) {
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!isStaffRole(profile?.role)) {
      // Authenticated but not staff → send to their own home.
      return NextResponse.redirect(
        new URL(roleHomePath(currentLocale, profile?.role ?? "student"), request.url)
      );
    }
    return response;
  }

  // Protect /portal — any authenticated user.
  if (section === "portal") {
    if (!user) {
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // Auth pages — bounce already-authenticated users to their home.
  // Never touch /auth/callback (OAuth exchange must run).
  if (section === "auth" && (subsection === "login" || subsection === "register")) {
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      return NextResponse.redirect(
        new URL(roleHomePath(currentLocale, profile?.role ?? "student"), request.url)
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
