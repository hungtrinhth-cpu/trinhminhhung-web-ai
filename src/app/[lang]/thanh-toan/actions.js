'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { buildVietQRUrl, buildOrderCode, VIETQR_ACCOUNT, VIETQR_BANK } from '@/lib/vietqr'
import { safeNextPath } from '@/lib/auth-helpers'

/**
 * Start a checkout: create a pending subscription + payment order for the
 * current user, returning the order id (used to render the QR page).
 *
 * @param {object} opts
 * @param {"webinar"|"course"} opts.itemType
 * @param {string} opts.itemId
 * @param {number} opts.amount
 * @param {object} [opts.metadata] - tracking data (ref/utm_*) to store on the order
 */
export async function createCheckout({ itemType, itemId, amount, metadata }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Vui lòng đăng nhập trước khi thanh toán' }

  // Reuse an existing pending subscription for the same item if present.
  let subscriptionId
  const { data: existing } = await supabase
    .from('subscriptions')
    .select('id, payment_status')
    .eq('user_id', user.id)
    .eq('item_type', itemType)
    .eq('item_id', itemId)
    .maybeSingle()

  if (existing?.payment_status === 'paid') {
    return { error: 'Bạn đã sở hữu nội dung này', alreadyPaid: true }
  }

  if (existing) {
    subscriptionId = existing.id
  } else {
    const { data: sub, error: subErr } = await supabase
      .from('subscriptions')
      .insert({
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        amount,
        payment_status: 'pending',
      })
      .select('id')
      .single()
    if (subErr) return { error: subErr.message }
    subscriptionId = sub.id
  }

  const orderCode = buildOrderCode(subscriptionId)
  const qrUrl = buildVietQRUrl({ amount, memo: orderCode })

  const { data: order, error: orderErr } = await supabase
    .from('payment_orders')
    .insert({
      subscription_id: subscriptionId,
      user_id: user.id,
      item_type: itemType,
      item_id: itemId,
      order_code: orderCode,
      amount,
      description: orderCode,
      qr_url: qrUrl,
      bank_account: VIETQR_ACCOUNT,
      bank_code: VIETQR_BANK,
      payment_gateway: 'vietqr',
      status: 'pending',
      metadata: metadata ?? {},
    })
    .select('id')
    .single()

  if (orderErr) return { error: orderErr.message }
  return { ok: true, orderId: order.id }
}

/**
 * Lightweight polling endpoint for the QR page to learn when payment lands.
 */
export async function getCheckoutStatus(orderId) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('payment_orders')
    .select('status')
    .eq('id', orderId)
    .single()
  return { status: data?.status ?? 'unknown' }
}

/**
 * Webinar registration CTA. Bound from the webinar page with the webinar's
 * own id/price/current-URL, so it needs no form fields of its own.
 *
 * - Not signed in → bounce to login, `next` brings the visitor straight back
 *   to this same webinar URL (tracking params included) to try again.
 * - Signed in → create the order and land on the real checkout page.
 *
 * @param {object} opts
 * @param {string} opts.webinarId
 * @param {number} opts.amount
 * @param {string} opts.lang
 * @param {string} opts.currentPath - the webinar page path+query to return to
 * @param {object} opts.tracking - ref/utm_* pulled from the webinar page URL
 */
export async function registerForWebinar({ webinarId, amount, lang, currentPath, tracking }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const next = safeNextPath(currentPath) ?? `/${lang}/webinar`
    redirect(`/${lang}/auth/login?next=${encodeURIComponent(next)}`)
  }

  const result = await createCheckout({
    itemType: 'webinar',
    itemId: webinarId,
    amount,
    metadata: tracking,
  })

  if (result?.error) {
    const separator = currentPath.includes('?') ? '&' : '?'
    redirect(`${currentPath}${separator}checkout_error=1`)
  }

  redirect(`/${lang}/thanh-toan/${result.orderId}`)
}
