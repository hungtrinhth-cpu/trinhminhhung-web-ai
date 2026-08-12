import { createHmac, timingSafeEqual } from "crypto";

const MAX_TIMESTAMP_DRIFT_SECONDS = 5 * 60;

/**
 * SePay webhook HMAC-SHA256 verification, per their published docs:
 * signature = HMAC-SHA256(secret, `${timestamp}.${rawBody}`), sent as
 * header `X-SePay-Signature: sha256={hex}` alongside `X-SePay-Timestamp`
 * (unix seconds). https://developer.sepay.vn/en/sepay-webhooks/xac-thuc
 *
 * MUST be called with the raw request body string — re-serializing parsed
 * JSON can change whitespace/key order/escaping and silently break the
 * signature check.
 */
export function verifySepaySignature(rawBody, signatureHeader, timestampHeader, secret) {
  if (!secret || !signatureHeader || !timestampHeader || typeof rawBody !== "string") {
    return { valid: false, reason: "missing_fields" };
  }

  const timestamp = Number(timestampHeader);
  if (!Number.isFinite(timestamp)) {
    return { valid: false, reason: "invalid_timestamp" };
  }
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowSeconds - timestamp) > MAX_TIMESTAMP_DRIFT_SECONDS) {
    return { valid: false, reason: "timestamp_drift" };
  }

  const match = /^sha256=([0-9a-f]+)$/i.exec(signatureHeader.trim());
  if (!match) {
    return { valid: false, reason: "malformed_signature" };
  }
  const providedHex = match[1].toLowerCase();

  const expectedHex = createHmac("sha256", secret)
    .update(`${timestampHeader}.${rawBody}`)
    .digest("hex");

  const providedBuf = Buffer.from(providedHex, "hex");
  const expectedBuf = Buffer.from(expectedHex, "hex");
  if (providedBuf.length !== expectedBuf.length || !timingSafeEqual(providedBuf, expectedBuf)) {
    return { valid: false, reason: "signature_mismatch" };
  }

  return { valid: true };
}
