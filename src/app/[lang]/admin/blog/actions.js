'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const STATUS_VALUES = ['draft', 'published']
const LANG_VALUES = ['vi', 'en']
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const SLUG_ERROR = 'Slug chỉ được dùng chữ thường, số và dấu gạch ngang, ví dụ: 5-cong-cu-ai-mien-phi'

const EDITABLE_FIELDS = [
  'title', 'slug', 'lang', 'excerpt', 'content',
  'thumbnail_url', 'category', 'read_time_min', 'status', 'published_at',
]

function revalidateBlogPosts() {
  revalidatePath('/[lang]/admin/blog', 'page')
  revalidatePath('/[lang]/blog/[slug]', 'page')
  revalidatePath('/[lang]/blog', 'page')
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
 * Create a new blog post. Uses the regular RLS-scoped client (not
 * service-role) — insert is only permitted for role=admin per the
 * `blog_posts` RLS policy.
 */
export async function createBlogPost(fields) {
  const title = (fields.title ?? '').trim()
  const slug = (fields.slug ?? '').trim()
  if (!title) return { error: 'Vui lòng nhập tiêu đề bài viết' }
  if (!slug) return { error: 'Vui lòng nhập slug' }
  if (!SLUG_RE.test(slug)) return { error: SLUG_ERROR }
  if (fields.lang && !LANG_VALUES.includes(fields.lang))
    return { error: 'Ngôn ngữ không hợp lệ' }
  if (fields.status && !STATUS_VALUES.includes(fields.status))
    return { error: 'Trạng thái không hợp lệ' }

  const supabase = await createClient()
  const payload = buildPatch(fields)
  payload.title = title
  payload.slug = slug
  payload.lang = fields.lang || 'vi'
  payload.status = fields.status || 'draft'

  const { data, error } = await supabase
    .from('blog_posts')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Slug này đã tồn tại cho ngôn ngữ này, vui lòng chọn slug khác' }
    return { error: error.message }
  }
  revalidateBlogPosts()
  return { ok: true, post: data }
}

/**
 * Update editable fields of a blog post, including status changes
 * (draft/published) — the admin UI calls this for both.
 */
export async function updateBlogPost(id, fields) {
  if (fields.lang && !LANG_VALUES.includes(fields.lang))
    return { error: 'Ngôn ngữ không hợp lệ' }
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

  const { error } = await supabase.from('blog_posts').update(patch).eq('id', id)
  if (error) {
    if (error.code === '23505') return { error: 'Slug này đã tồn tại cho ngôn ngữ này, vui lòng chọn slug khác' }
    return { error: error.message }
  }
  revalidateBlogPosts()
  return { ok: true }
}
