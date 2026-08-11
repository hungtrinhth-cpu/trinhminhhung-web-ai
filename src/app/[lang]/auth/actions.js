'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { roleHomePath } from '@/lib/auth-helpers'

function safeLang(lang) {
  return lang === 'en' ? 'en' : 'vi'
}

/**
 * Email/password sign-in. On success redirects to the role-appropriate home.
 */
export async function login(formData) {
  const lang = safeLang(formData.get('lang'))
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (error) {
    return { error: error.message }
  }

  // Look up role to decide where to land.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

  revalidatePath('/', 'layout')
  redirect(roleHomePath(lang, profile?.role ?? 'student'))
}

/**
 * Email/password sign-up. The DB trigger creates the profile row (role=student).
 */
export async function signup(formData) {
  const lang = safeLang(formData.get('lang'))
  const supabase = await createClient()

  const fullName = formData.get('full_name')

  const { error } = await supabase.auth.signUp({
    email: formData.get('email'),
    password: formData.get('password'),
    options: {
      data: fullName ? { full_name: fullName } : undefined,
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  // New users are students by default → portal.
  redirect(`/${lang}/portal`)
}

/**
 * Google OAuth. Returns a URL the client must navigate to; the OAuth provider
 * then bounces back to /[lang]/auth/callback.
 */
export async function signInWithGoogle(lang) {
  const safe = safeLang(lang)
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/${safe}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data?.url) {
    redirect(data.url)
  }
}

export async function signOut(lang) {
  const safe = safeLang(lang)
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect(`/${safe}/auth/login`)
}
