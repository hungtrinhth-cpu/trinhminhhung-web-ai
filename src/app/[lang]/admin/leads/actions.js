'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_RE = /^0\d{9,10}$/

function revalidateLeads() {
  revalidatePath('/[lang]/admin/leads', 'page')
  revalidatePath('/[lang]/admin', 'page')
}

/**
 * Move a lead to a different pipeline stage (Kanban drag-drop).
 */
export async function updateLeadStage(leadId, stageId) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ stage_id: stageId, updated_at: new Date().toISOString() })
    .eq('id', leadId)

  if (error) return { error: error.message }
  revalidateLeads()
  return { ok: true }
}

/**
 * Create a new lead list. Returns the created row.
 */
export async function createLeadList(name, description) {
  const trimmed = (name ?? '').trim()
  if (!trimmed) return { error: 'Vui lòng nhập tên danh sách' }
  if (trimmed.length > 100) return { error: 'Tên danh sách tối đa 100 ký tự' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('lead_lists')
    .insert({ name: trimmed, description: description?.trim() || null, created_by: user?.id })
    .select('id, name, description, created_at')
    .single()

  if (error) {
    if (error.code === '23505') return { error: 'Tên danh sách đã tồn tại' }
    return { error: error.message }
  }
  revalidateLeads()
  return { ok: true, list: { ...data, count: 0 } }
}

/**
 * Assign one or many leads to a list (single FK, overwrites previous list).
 */
export async function assignLeadsToList(leadIds, listId) {
  if (!leadIds?.length) return { error: 'Chưa chọn lead nào' }
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ list_id: listId, updated_at: new Date().toISOString() })
    .in('id', leadIds)

  if (error) return { error: error.message }
  revalidateLeads()
  return { ok: true, count: leadIds.length }
}

/**
 * Remove leads from their list (sets list_id = null). Lead stays in CRM.
 */
export async function removeLeadsFromList(leadIds) {
  if (!leadIds?.length) return { error: 'Chưa chọn lead nào' }
  const supabase = await createClient()
  const { error } = await supabase
    .from('leads')
    .update({ list_id: null, updated_at: new Date().toISOString() })
    .in('id', leadIds)

  if (error) return { error: error.message }
  revalidateLeads()
  return { ok: true }
}

/**
 * Hard-delete leads (admin / team_leader per RLS).
 */
export async function deleteLeads(leadIds) {
  if (!leadIds?.length) return { error: 'Chưa chọn lead nào' }
  const supabase = await createClient()
  const { error } = await supabase.from('leads').delete().in('id', leadIds)
  if (error) return { error: error.message }
  revalidateLeads()
  return { ok: true }
}

/**
 * Create a single lead manually.
 */
export async function createLead(fields) {
  const firstName = (fields.first_name ?? '').trim()
  if (!firstName) return { error: 'Vui lòng nhập tên khách hàng' }
  if (fields.email && !EMAIL_RE.test(fields.email))
    return { error: 'Email không hợp lệ' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('leads')
    .insert({
      first_name: firstName,
      last_name: fields.last_name?.trim() || null,
      email: fields.email?.trim() || null,
      phone: fields.phone?.trim() || null,
      list_id: fields.list_id || null,
      stage_id: fields.stage_id || null,
    })
    .select('*')
    .single()

  if (error) return { error: error.message }
  revalidateLeads()
  return { ok: true, lead: data }
}

/**
 * Update editable fields of a lead.
 */
export async function updateLead(leadId, fields) {
  const supabase = await createClient()
  const patch = { updated_at: new Date().toISOString() }
  for (const key of ['first_name', 'last_name', 'email', 'phone', 'list_id', 'stage_id']) {
    if (key in fields) patch[key] = fields[key] || null
  }
  const { error } = await supabase.from('leads').update(patch).eq('id', leadId)
  if (error) return { error: error.message }
  revalidateLeads()
  return { ok: true }
}

/**
 * Bulk import leads from parsed+mapped CSV rows.
 * @param {object} payload
 * @param {{first_name?:string, email?:string, phone?:string}[]} payload.rows
 * @param {string} [payload.listId]       - existing list to import into
 * @param {string} [payload.newListName]  - create this list and import into it
 * Returns { inserted, skipped, errors:[{row, reason}] }
 */
export async function importLeads({ rows, listId, newListName }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Resolve target list.
  let targetListId = listId || null
  if (!targetListId && newListName?.trim()) {
    const { data: created, error: listErr } = await supabase
      .from('lead_lists')
      .insert({ name: newListName.trim(), created_by: user?.id })
      .select('id')
      .single()
    if (listErr) return { error: 'Không tạo được danh sách: ' + listErr.message }
    targetListId = created.id
  }

  // 2. Default stage = first in pipeline.
  const { data: firstStage } = await supabase
    .from('pipeline_stages')
    .select('id')
    .order('order', { ascending: true })
    .limit(1)
    .single()
  const defaultStageId = firstStage?.id ?? null

  // 3. Existing emails in this list to avoid duplicates.
  const existingEmails = new Set()
  if (targetListId) {
    const { data: existing } = await supabase
      .from('leads')
      .select('email')
      .eq('list_id', targetListId)
    for (const r of existing ?? []) {
      if (r.email) existingEmails.add(r.email.toLowerCase())
    }
  }

  // 4. Validate + dedupe.
  const toInsert = []
  const errors = []
  const seen = new Set()
  rows.forEach((row, i) => {
    const firstName = (row.first_name ?? '').trim()
    const email = (row.email ?? '').trim()
    const phone = (row.phone ?? '').trim()

    if (!firstName) {
      errors.push({ row: i + 1, reason: 'Thiếu tên khách hàng' })
      return
    }
    if (email && !EMAIL_RE.test(email)) {
      errors.push({ row: i + 1, reason: 'Email không hợp lệ: ' + email })
      return
    }
    if (phone && !PHONE_RE.test(phone)) {
      errors.push({ row: i + 1, reason: 'SĐT không hợp lệ: ' + phone })
      return
    }
    const key = email.toLowerCase()
    if (email && (existingEmails.has(key) || seen.has(key))) {
      errors.push({ row: i + 1, reason: 'Trùng email: ' + email })
      return
    }
    if (email) seen.add(key)

    toInsert.push({
      first_name: firstName,
      email: email || null,
      phone: phone || null,
      list_id: targetListId,
      stage_id: defaultStageId,
    })
  })

  // 5. Insert in batches of 100.
  let inserted = 0
  for (let i = 0; i < toInsert.length; i += 100) {
    const batch = toInsert.slice(i, i + 100)
    const { error } = await supabase.from('leads').insert(batch)
    if (error) {
      errors.push({ row: `batch ${i / 100 + 1}`, reason: error.message })
    } else {
      inserted += batch.length
    }
  }

  revalidateLeads()
  return { inserted, skipped: errors.length, errors, listId: targetListId }
}
