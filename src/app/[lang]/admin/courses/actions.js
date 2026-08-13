'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const STATUS_VALUES = ['draft', 'published', 'closed']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SLUG_ERROR = 'Slug chỉ được dùng chữ thường, số và dấu gạch ngang, ví dụ: ai-mastery-pro'
const ORDER_CONFLICT_ERROR = 'Thứ tự này đã được dùng bởi bài học khác trong khóa — vui lòng chọn số khác'

const COURSE_EDITABLE_FIELDS = [
  'title', 'slug', 'subtitle', 'description', 'level',
  'price', 'original_price', 'thumbnail_url', 'tags', 'status',
]

const LESSON_EDITABLE_FIELDS = [
  'title', 'description', 'video_url', 'attachment_url', 'duration_sec', 'order', 'is_preview',
]

const QA_TEST_PREFIX = 'QA_TEST_'

function revalidateCourses() {
  revalidatePath('/[lang]/admin/courses', 'page')
  revalidatePath('/[lang]/khoa-hoc/[slug]', 'page')
  revalidatePath('/[lang]/khoa-hoc', 'page')
}

function buildPatch(fields, editableFields) {
  const patch = {}
  for (const key of editableFields) {
    if (key in fields) {
      const value = fields[key]
      patch[key] = value === '' ? null : value
    }
  }
  return patch
}

/**
 * Create a new course. Uses the regular RLS-scoped client (not
 * service-role) — insert is only permitted for role=admin per the
 * `courses` RLS policy.
 */
export async function createCourse(fields) {
  const title = (fields.title ?? '').trim()
  const slug = (fields.slug ?? '').trim()
  if (!title) return { error: 'Vui lòng nhập tiêu đề khóa học' }
  if (!slug) return { error: 'Vui lòng nhập slug' }
  if (!SLUG_RE.test(slug)) return { error: SLUG_ERROR }
  if (fields.status && !STATUS_VALUES.includes(fields.status))
    return { error: 'Trạng thái không hợp lệ' }

  const supabase = await createClient()
  const payload = buildPatch(fields, COURSE_EDITABLE_FIELDS)
  payload.title = title
  payload.slug = slug
  payload.status = fields.status || 'draft'

  const { data, error } = await supabase
    .from('courses')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug này đã tồn tại, vui lòng chọn slug khác' }
    return { error: error.message }
  }
  revalidateCourses()
  return { ok: true, course: data }
}

/**
 * Update editable fields of a course, including status changes
 * (draft/published/closed) — the admin UI calls this for both.
 */
export async function updateCourse(id, fields) {
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
  const patch = buildPatch(fields, COURSE_EDITABLE_FIELDS)
  patch.updated_at = new Date().toISOString()

  const { error } = await supabase.from('courses').update(patch).eq('id', id)
  if (error) {
    if (error.code === '23505') return { error: 'Slug này đã tồn tại, vui lòng chọn slug khác' }
    return { error: error.message }
  }
  revalidateCourses()
  return { ok: true }
}

/**
 * Create a new lesson under a course. `order` must be unique within the
 * course (unique(course_id, "order") from the schema) — a conflict here
 * means another lesson already occupies that slot; we don't auto-shift
 * sibling lessons, just surface a clear error.
 */
export async function createLesson(fields) {
  const title = (fields.title ?? '').trim()
  const courseId = fields.course_id
  if (!courseId) return { error: 'Thiếu course_id' }
  if (!title) return { error: 'Vui lòng nhập tiêu đề bài học' }

  const supabase = await createClient()
  const payload = buildPatch(fields, LESSON_EDITABLE_FIELDS)
  payload.title = title
  payload.course_id = courseId

  const { data, error } = await supabase
    .from('lessons')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') return { error: ORDER_CONFLICT_ERROR }
    return { error: error.message }
  }
  revalidateCourses()
  return { ok: true, lesson: data }
}

/**
 * Update editable fields of a lesson, including reordering and toggling
 * is_preview — the admin UI calls this for all three.
 */
export async function updateLesson(id, fields) {
  if ('title' in fields && !String(fields.title ?? '').trim())
    return { error: 'Tiêu đề không được để trống' }

  const supabase = await createClient()
  const patch = buildPatch(fields, LESSON_EDITABLE_FIELDS)
  patch.updated_at = new Date().toISOString()

  const { error } = await supabase.from('lessons').update(patch).eq('id', id)
  if (error) {
    if (error.code === '23505') return { error: ORDER_CONFLICT_ERROR }
    return { error: error.message }
  }
  revalidateCourses()
  return { ok: true }
}

/**
 * Finds QA_TEST_-prefixed, never-published courses, then checks each for
 * real payment_orders/subscriptions attached (item_type/item_id has no FK
 * constraint, so deleting a course wouldn't cascade-clean those — they'd
 * become orphaned references). Courses with anything attached are excluded
 * from "safe" and reported as "blocked" for manual review instead of being
 * force-deleted.
 */
async function findQaTestCleanupCandidates(supabase) {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('id, title, status')
    .like('title', `${QA_TEST_PREFIX}%`)
    .neq('status', 'published')

  if (error) return { error: error.message }
  if (!courses || courses.length === 0) return { safe: [], blocked: [] }

  const courseIds = courses.map((c) => c.id)
  const [{ data: orders }, { data: subs }] = await Promise.all([
    supabase.from('payment_orders').select('item_id').eq('item_type', 'course').in('item_id', courseIds),
    supabase.from('subscriptions').select('item_id').eq('item_type', 'course').in('item_id', courseIds),
  ])
  const blockedIds = new Set([...(orders ?? []).map((o) => o.item_id), ...(subs ?? []).map((s) => s.item_id)])

  return {
    safe: courses.filter((c) => !blockedIds.has(c.id)),
    blocked: courses.filter((c) => blockedIds.has(c.id)),
  }
}

/**
 * Preview only — never deletes anything. Lets the admin UI show counts
 * before the admin confirms.
 */
export async function previewQaTestCourseCleanup() {
  const supabase = await createClient()
  const result = await findQaTestCleanupCandidates(supabase)
  if (result.error) return { error: result.error }
  return { ok: true, safe: result.safe, blocked: result.blocked }
}

/**
 * Deletes only the courses confirmed safe by findQaTestCleanupCandidates,
 * re-running that same check immediately before deleting (rather than
 * trusting a possibly-stale client-side preview) so a course that gained a
 * real order/subscription in between stays protected. Lessons/lesson_progress
 * cascade-delete automatically via their FK constraints.
 */
export async function runQaTestCourseCleanup() {
  const supabase = await createClient()
  const result = await findQaTestCleanupCandidates(supabase)
  if (result.error) return { error: result.error }

  const idsToDelete = result.safe.map((c) => c.id)
  if (idsToDelete.length === 0) {
    return { ok: true, deletedCount: 0, blocked: result.blocked }
  }

  const { error, count } = await supabase
    .from('courses')
    .delete({ count: 'exact' })
    .in('id', idsToDelete)

  if (error) return { error: error.message }

  revalidateCourses()
  return { ok: true, deletedCount: count ?? idsToDelete.length, blocked: result.blocked }
}
