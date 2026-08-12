'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { roleHomePath, safeNextPath } from '@/lib/auth-helpers'

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

  revalidatePath('/', 'layout')

  // Deep link (e.g. back to a webinar checkout) wins over the role default.
  const next = safeNextPath(formData.get('next'))
  if (next) {
    redirect(next)
  }

  // Look up role to decide where to land.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()

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
  // Deep link (e.g. back to a webinar checkout) wins; otherwise new users
  // are students by default → portal.
  const next = safeNextPath(formData.get('next'))
  redirect(next || `/${lang}/portal`)
}

/**
 * Google OAuth. Returns a URL the client must navigate to; the OAuth provider
 * then bounces back to /[lang]/auth/callback, which honors `next` itself.
 */
export async function signInWithGoogle(lang, next) {
  const safe = safeLang(lang)
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const safeNext = safeNextPath(next)

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/${safe}/auth/callback${safeNext ? `?next=${encodeURIComponent(safeNext)}` : ''}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data?.url) {
    redirect(data.url)
  }
}

/**
 * Passwordless sign-in: emails a magic link. Same callback route as Google
 * OAuth handles it — Supabase's magic link uses the same PKCE `?code=`
 * redirect exchangeCodeForSession() already expects.
 */
export async function signInWithMagicLink(formData) {
  const lang = safeLang(formData.get('lang'))
  const supabase = await createClient()
  const origin = (await headers()).get('origin')
  const next = safeNextPath(formData.get('next'))
  const email = formData.get('email')

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/${lang}/auth/callback${next ? `?next=${encodeURIComponent(next)}` : ''}`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { ok: true }
}

export async function signOut(lang) {
  const safe = safeLang(lang)
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect(`/${safe}/auth/login`)
}
