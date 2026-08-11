import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { roleHomePath } from '@/lib/auth-helpers'

export async function GET(request, { params }) {
  const { lang } = await params
  const safeLang = lang === 'en' ? 'en' : 'vi'

  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Explicit ?next= wins (e.g. deep link a user was sent to).
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Otherwise route by role.
      const {
        data: { user },
      } = await supabase.auth.getUser()

      let role = 'student'
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
        role = profile?.role ?? 'student'
      }

      return NextResponse.redirect(`${origin}${roleHomePath(safeLang, role)}`)
    }
  }

  return NextResponse.redirect(
    `${origin}/${safeLang}/auth/login?error=auth_callback_error`
  )
}
