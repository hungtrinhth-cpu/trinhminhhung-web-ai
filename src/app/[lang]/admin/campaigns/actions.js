'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/notifications'

const AUDIENCE_VALUES = ['all', 'leads', 'students']
const NOT_CONFIGURED_ERROR = 'Chưa cấu hình Resend API key, không thể gửi chiến dịch.'

function revalidateCampaigns() {
  revalidatePath('/[lang]/admin/campaigns', 'page')
}

// Real Resend API keys always start with "re_" — checking the actual key
// format (not just one exact placeholder string) catches any placeholder/
// truncated/garbage value, not just the literal ".env.example" text.
function resendConfigured() {
  const key = process.env.RESEND_API_KEY
  return !!key && key.startsWith('re_')
}

/**
 * Every email address a campaign's audience resolves to, deduped. Two plain
 * queries rather than a PostgREST embedded join (subscriptions -> profiles)
 * to match this codebase's existing query style.
 */
async function resolveAudienceEmails(supabase, audience) {
  const emails = new Set()

  if (audience === 'leads' || audience === 'all') {
    const { data } = await supabase.from('leads').select('email').not('email', 'is', null)
    for (const l of data ?? []) {
      if (l.email) emails.add(l.email.trim().toLowerCase())
    }
  }

  if (audience === 'students' || audience === 'all') {
    const { data: subs } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('payment_status', 'paid')
    const userIds = [...new Set((subs ?? []).map((s) => s.user_id))]
    if (userIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('email').in('id', userIds)
      for (const p of profiles ?? []) {
        if (p.email) emails.add(p.email.trim().toLowerCase())
      }
    }
  }

  return Array.from(emails)
}

export async function createCampaign(fields) {
  const name = (fields.name ?? '').trim()
  const subject = (fields.subject ?? '').trim()
  const body = (fields.body ?? '').trim()
  const audience = fields.audience

  if (!name) return { error: 'Vui lòng nhập tên chiến dịch' }
  if (!subject) return { error: 'Vui lòng nhập tiêu đề email' }
  if (!body) return { error: 'Vui lòng nhập nội dung email' }
  if (!AUDIENCE_VALUES.includes(audience)) return { error: 'Đối tượng nhận không hợp lệ' }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('campaigns')
    .insert({ name, subject, body, audience, status: 'draft' })
    .select('*')
    .single()

  if (error) return { error: error.message }
  revalidateCampaigns()
  return { ok: true, campaign: data }
}

/**
 * Sends a draft (or previously-failed) campaign. Never re-sends a campaign
 * already marked 'sent'. If even one recipient fails, the whole campaign is
 * marked 'failed' with a reason in last_error — never marked 'sent' on a
 * partial failure.
 */
export async function sendCampaign(campaignId) {
  const supabase = await createClient()

  const { data: campaign, error: fetchErr } = await supabase
    .from('campaigns')
    .select('id, subject, body, audience, status')
    .eq('id', campaignId)
    .single()

  if (fetchErr || !campaign) return { error: 'Không tìm thấy chiến dịch' }
  if (campaign.status === 'sent') return { error: 'Chiến dịch này đã được gửi, không thể gửi lại' }
  if (campaign.status === 'sending') return { error: 'Chiến dịch đang được gửi, vui lòng đợi' }

  if (!resendConfigured()) {
    await supabase
      .from('campaigns')
      .update({ status: 'failed', last_error: NOT_CONFIGURED_ERROR })
      .eq('id', campaignId)
    revalidateCampaigns()
    return { error: NOT_CONFIGURED_ERROR }
  }

  await supabase.from('campaigns').update({ status: 'sending', last_error: null }).eq('id', campaignId)

  const recipients = await resolveAudienceEmails(supabase, campaign.audience)
  if (recipients.length === 0) {
    const msg = 'Không tìm thấy người nhận nào phù hợp với đối tượng đã chọn'
    await supabase.from('campaigns').update({ status: 'failed', last_error: msg }).eq('id', campaignId)
    revalidateCampaigns()
    return { error: msg }
  }

  let failCount = 0
  for (const to of recipients) {
    const res = await sendEmail({ to, subject: campaign.subject, html: campaign.body })
    if (!res.ok) failCount++
  }

  const now = new Date().toISOString()
  if (failCount > 0) {
    const msg = `${failCount}/${recipients.length} email gửi thất bại`
    await supabase
      .from('campaigns')
      .update({ status: 'failed', last_error: msg, recipient_count: recipients.length })
      .eq('id', campaignId)
    revalidateCampaigns()
    return { error: msg }
  }

  await supabase
    .from('campaigns')
    .update({ status: 'sent', sent_at: now, recipient_count: recipients.length, last_error: null })
    .eq('id', campaignId)
  revalidateCampaigns()
  return { ok: true, recipientCount: recipients.length }
}
