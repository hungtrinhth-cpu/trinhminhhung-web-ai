import { createServerClient } from '@supabase/ssr'

/**
 * Creates a Supabase client bound to the proxy/middleware request + response
 * cookie jars. The caller is responsible for returning `response` so refreshed
 * auth cookies propagate to the browser.
 */
export function createMiddlewareSupabase(request, response) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}
