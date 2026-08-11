'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const STATUS_LABEL = { pending: 'chờ xử lý', paid: 'đã thanh toán', failed: 'thất bại', expired: 'hết hạn' }
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function revalidateTransactions() {
  revalidatePath('/[lang]/admin/transactions', 'page')
}

/**
 * Manually mark a pending order as paid — for testing the flow before a
 * real payment gateway webhook is wired up. Uses the regular RLS-scoped
 * client (not service-role); the `payment_orders`/`subscriptions` UPDATE
 * policies already permit role=admin.
 *
 * Only ever transitions pending -> paid. Any other current status is
 * rejected outright so `paid_at` can never be silently overwritten.
 */
export async function markOrderPaid(orderId) {
  if (!UUID_RE.test(orderId ?? '')) {
    console.error('markOrderPaid: invalid orderId', orderId)
    return { error: 'ID đơn hàng không hợp lệ' }
  }

  const supabase = await createClient()

  const { data: order, error: fetchErr } = await supabase
    .from('payment_orders')
    .select('id, subscription_id, status')
    .eq('id', orderId)
    .single()

  if (fetchErr) {
    console.error('markOrderPaid: fetch error', fetchErr.message)
    return { error: `Không tìm thấy đơn hàng: ${fetchErr.message}` }
  }
  if (!order) return { error: 'Không tìm thấy đơn hàng' }
  if (order.status !== 'pending') {
    const label = STATUS_LABEL[order.status] ?? order.status
    return { error: `Đơn hàng đang ở trạng thái "${label}", không thể đánh dấu đã thanh toán` }
  }

  const now = new Date().toISOString()
  // IMPORTANT: .select() after .update() is required to know whether RLS
  // actually let the write through. Supabase/PostgREST does NOT return an
  // error when a row-level-security policy silently filters out the target
  // row — it just reports 0 rows affected, same as a normal "no match".
  // Without checking the returned rows, a blocked update looks identical
  // to a successful one.
  const { data: updated, error: updateErr } = await supabase
    .from('payment_orders')
    .update({ status: 'paid', paid_at: now, updated_at: now })
    .eq('id', orderId)
    .eq('status', 'pending')
    .select('id, status, paid_at')

  if (updateErr) {
    console.error('markOrderPaid: update error', updateErr.message)
    return { error: `Cập nhật thất bại: ${updateErr.message}` }
  }

  if (!updated || updated.length === 0) {
    // 0 rows affected with no error — almost certainly RLS blocked the
    // write. Look up what role Supabase actually resolves for this session
    // so the error is actionable, per instruction: diagnose get_user_role()
    // before ever reaching for the service-role client.
    const {
      data: { user },
    } = await supabase.auth.getUser()
    const { data: myProfile } = await supabase
      .from('profiles')
      .select('id, role')
      .eq('id', user?.id ?? '')
      .maybeSingle()

    console.error('markOrderPaid: update affected 0 rows', {
      orderId,
      authUserId: user?.id ?? null,
      resolvedRole: myProfile?.role ?? null,
    })

    if (myProfile?.role === 'admin') {
      return {
        error:
          'Cập nhật thất bại (0 dòng bị ảnh hưởng) dù tài khoản có role admin — đơn có thể đã bị đổi trạng thái ở nơi khác. Vui lòng tải lại trang và thử lại.',
      }
    }
    return {
      error: `Không có quyền cập nhật đơn hàng — tài khoản hiện tại có role "${myProfile?.role ?? 'không xác định'}" trong bảng profiles, cần role "admin". Kiểm tra lại profiles.role trong Supabase.`,
    }
  }

  if (order.subscription_id) {
    const { error: subErr } = await supabase
      .from('subscriptions')
      .update({ payment_status: 'paid' })
      .eq('id', order.subscription_id)
    if (subErr) {
      console.error('markOrderPaid: subscription update error', subErr.message)
    }
  }

  revalidateTransactions()
  return { ok: true }
}
