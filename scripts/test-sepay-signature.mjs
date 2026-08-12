/**
 * Verifies verifySepaySignature() against SePay's documented HMAC-SHA256
 * scheme: signature = HMAC-SHA256(secret, `${timestamp}.${rawBody}`), sent
 * as `X-SePay-Signature: sha256={hex}` + `X-SePay-Timestamp`.
 * https://developer.sepay.vn/en/sepay-webhooks/xac-thuc
 *
 * SePay doesn't publish a fixed test vector (unlike PayOS), so this script
 * builds its own fixture with Node's crypto and checks verifySepaySignature()
 * accepts/rejects the same cases the PayOS test covers.
 *
 * Usage: node scripts/test-sepay-signature.mjs
 */
import { createHmac } from "crypto";
import { verifySepaySignature } from "../src/lib/sepay.js";

const SECRET = "test_sepay_webhook_secret_do_not_use_in_prod";
const RAW_BODY = JSON.stringify({
  id: 123456,
  gateway: "vietcombank",
  transactionDate: "2026-08-12 10:00:00",
  accountNumber: "1015971765",
  code: "QATEST123",
  content: "QATEST123 thanh toan don hang",
  transferType: "in",
  transferAmount: 100000,
});
const NOW = Math.floor(Date.now() / 1000);

function sign(secret, timestamp, body) {
  const hex = createHmac("sha256", secret).update(`${timestamp}.${body}`).digest("hex");
  return `sha256=${hex}`;
}

let failed = 0;
function check(name, pass) {
  console.log(`[${pass ? "PASS" : "FAIL"}] ${name}`);
  if (!pass) failed++;
}

const validSig = sign(SECRET, NOW, RAW_BODY);

check(
  "Valid signature + fresh timestamp verifies true",
  verifySepaySignature(RAW_BODY, validSig, String(NOW), SECRET).valid === true
);

check(
  "Tampered body is rejected",
  verifySepaySignature(RAW_BODY + "x", validSig, String(NOW), SECRET).valid === false
);

check(
  "Wrong secret is rejected",
  verifySepaySignature(RAW_BODY, validSig, String(NOW), "wrong_secret").valid === false
);

check(
  "Re-serialized (whitespace-changed) body breaks signature",
  verifySepaySignature(JSON.stringify(JSON.parse(RAW_BODY), null, 2), validSig, String(NOW), SECRET).valid === false
);

const staleTimestamp = NOW - 6 * 60; // 6 minutes old, past 5-minute window
const staleSig = sign(SECRET, staleTimestamp, RAW_BODY);
check(
  "Timestamp older than 5 minutes is rejected",
  verifySepaySignature(RAW_BODY, staleSig, String(staleTimestamp), SECRET).valid === false
);

const withinWindowTimestamp = NOW - 4 * 60; // 4 minutes old, within window
const withinWindowSig = sign(SECRET, withinWindowTimestamp, RAW_BODY);
check(
  "Timestamp within 5-minute window is accepted",
  verifySepaySignature(RAW_BODY, withinWindowSig, String(withinWindowTimestamp), SECRET).valid === true
);

check(
  "Malformed signature header (no sha256= prefix) is rejected",
  verifySepaySignature(RAW_BODY, "not-a-valid-signature", String(NOW), SECRET).valid === false
);

check(
  "Missing secret fails closed (not throws)",
  verifySepaySignature(RAW_BODY, validSig, String(NOW), undefined).valid === false
);

check(
  "Missing signature header fails closed",
  verifySepaySignature(RAW_BODY, undefined, String(NOW), SECRET).valid === false
);

check(
  "Missing timestamp header fails closed",
  verifySepaySignature(RAW_BODY, validSig, undefined, SECRET).valid === false
);

console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`);
process.exitCode = failed === 0 ? 0 : 1;
