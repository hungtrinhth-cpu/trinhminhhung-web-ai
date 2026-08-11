'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const STATUS_VALUES = ['draft', 'published', 'closed']
const CURRICULUM_TYPES = ['video', 'demo', 'qa']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SLUG_ERROR = 'Slug chỉ được dùng chữ thường, số và dấu gạch ngang, ví dụ: ai-agent-2025'

const EDITABLE_FIELDS = [
  'title', 'slug', 'subtitle', 'instructor', 'instructor_title',
  'scheduled_at', 'duration_min', 'format', 'level',
  'price', 'original_price', 'seats_total', 'seats_left',
  'thumbnail_url', 'tags', 'highlights', 'curriculum', 'status',
]

function revalidateWebinars() {
  revalidatePath('/[lang]/admin/webinars', 'page')
  revalidatePath('/[lang]/webinar/[slug]', 'page')
}

/**
 * Server-side re-check of curriculum shape, independent of any client
 * validation — an action can be called directly, so this must not rely on
 * the form having validated it first.
 */
function validateCurriculum(curriculum) {
  if (curriculum === undefined) return null
  if (!Array.isArray(curriculum)) return 'Chương trình học (curriculum) phải là một mảng'
  for (let i = 0; i < curriculum.length; i++) {
    const item = curriculum[i]
    if (!item || typeof item !== 'object') return `Mục #${i + 1} trong curriculum không hợp lệ`
    if (item.id === undefined || item.id === null || item.id === '')
      return `Mục #${i + 1} trong curriculum thiếu "id"`
    if (!item.title) return `Mục #${i + 1} trong curriculum thiếu "title"`
    if (!item.duration) return `Mục #${i + 1} trong curriculum thiếu "duration"`
    if (!CURRICULUM_TYPES.includes(item.type))
      return `Mục #${i + 1} trong curriculum có "type" không hợp lệ (chỉ nhận video/demo/qa)`
  }
  return null
}

function buildPatch(fields) {
  const patch = {}
  for (const key of EDITABLE_FIELDS) {
    if (key in fields) {
      const value = fields[key]
      patch[key] = value === '' ? null : value
    }
  }
  return patch
}

/**
 * Create a new webinar. Uses the regular RLS-scoped client (not
 * service-role) — insert is only permitted for role=admin per the
 * `webinars` RLS policy.
 */
export async function createWebinar(fields) {
  const title = (fields.title ?? '').trim()
  const slug = (fields.slug ?? '').trim()
  if (!title) return { error: 'Vui lòng nhập tiêu đề webinar' }
  if (!slug) return { error: 'Vui lòng nhập slug' }
  if (!SLUG_RE.test(slug)) return { error: SLUG_ERROR }
  if (fields.status && !STATUS_VALUES.includes(fields.status))
    return { error: 'Trạng thái không hợp lệ' }

  const curriculumError = validateCurriculum(fields.curriculum)
  if (curriculumError) return { error: curriculumError }

  const supabase = await createClient()
  const payload = buildPatch(fields)
  payload.title = title
  payload.slug = slug
  payload.status = fields.status || 'draft'

  const { data, error } = await supabase
    .from('webinars')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug này đã tồn tại, vui lòng chọn slug khác' }
    return { error: error.message }
  }
  revalidateWebinars()
  return { ok: true, webinar: data }
}

/**
 * Update editable fields of a webinar, including status changes
 * (draft/published/closed) — the admin UI calls this for both.
 */
export async function updateWebinar(id, fields) {
  const curriculumError = validateCurriculum(fields.curriculum)
  if (curriculumError) return { error: curriculumError }
  if (fields.status && !STATUS_VALUES.includes(fields.status))
    return { error: 'Trạng thái không hợp lệ' }
  if ('title' in fields && !String(fields.title ?? '').trim())
    return { error: 'Tiêu đề không được để trống' }
  if ('slug' in fields) {
    const slug = String(fields.slug ?? '').trim()
    if (!slug) return { error: 'Slug không được để trống' }
    if (!SLUG_RE.test(slug)) return { error: SLUG_ERROR }
    fields = { ...fields, slug }
  }

  const supabase = await createClient()
  const patch = buildPatch(fields)
  patch.updated_at = new Date().toISOString()

  const { error } = await supabase.from('webinars').update(patch).eq('id', id)
  if (error) {
    if (error.code === '23505') return { error: 'Slug này đã tồn tại, vui lòng chọn slug khác' }
    return { error: error.message }
  }
  revalidateWebinars()
  return { ok: true }
}
