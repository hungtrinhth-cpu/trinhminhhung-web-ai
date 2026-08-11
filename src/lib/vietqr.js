// VietQR quick-link helper. Uses the img.vietqr.io template service which
// renders a scannable QR for a bank account + amount + memo. No SDK needed.
//
// Configure these via env (NEXT_PUBLIC_ so the QR can render client-side):
//   NEXT_PUBLIC_VIETQR_BANK     e.g. "VCB", "TCB", "MB" (Napas bank code)
//   NEXT_PUBLIC_VIETQR_ACCOUNT  the receiving account number
//   NEXT_PUBLIC_VIETQR_NAME     the account holder name (URL-encoded)

const BANK = process.env.NEXT_PUBLIC_VIETQR_BANK || "";
const ACCOUNT = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT || "";
const ACCOUNT_NAME = process.env.NEXT_PUBLIC_VIETQR_NAME || "HUNG TRINH AI";

/**
 * Build a VietQR image URL for a dynamic payment.
 * @param {object} opts
 * @param {number} opts.amount   - amount in VND
 * @param {string} opts.memo     - transfer description (used to reconcile)
 * @param {"compact"|"compact2"|"qr_only"|"print"} [opts.template]
 */
export function buildVietQRUrl({ amount, memo, template = "compact2" }) {
  if (!BANK || !ACCOUNT) return null;
  const params = new URLSearchParams({
    amount: String(Math.round(amount)),
    addInfo: memo,
    accountName: ACCOUNT_NAME,
  });
  return `https://img.vietqr.io/image/${BANK}-${ACCOUNT}-${template}.png?${params.toString()}`;
}

/**
 * Deterministic order code / transfer memo for a subscription.
 * Format: HTA + last 8 of subscription id (uppercased, no dashes).
 */
export function buildOrderCode(subscriptionId) {
  const clean = String(subscriptionId).replace(/-/g, "").toUpperCase();
  return `HTA${clean.slice(-8)}`;
}

export const VIETQR_ACCOUNT = ACCOUNT;
export const VIETQR_BANK = BANK;
export const VIETQR_ACCOUNT_NAME = ACCOUNT_NAME;
