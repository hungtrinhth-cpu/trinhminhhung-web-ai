'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

/**
 * Mark a lesson complete/incomplete for the current user.
 * Upserts into lesson_progress (RLS enforces user_id = self).
 */
export async function setLessonProgress(lessonId, completed) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  const { error } = await supabase.from('lesson_progress').upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    },
    { onConflict: 'user_id,lesson_id' }
  )

  if (error) return { error: error.message }
  revalidatePath('/[lang]/portal', 'page')
  return { ok: true }
}

/**
 * Update the current user's own display name. RLS already restricts
 * profiles UPDATE to auth.uid() = id and blocks changing `role`.
 */
export async function updateMyProfile(fields) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Chưa đăng nhập' }

  const fullName = (fields.full_name ?? '').trim()
  if (!fullName) return { error: 'Vui lòng nhập họ tên' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName, updated_at: new Date().toISOString() })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/[lang]/portal', 'layout')
  return { ok: true }
}
