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
