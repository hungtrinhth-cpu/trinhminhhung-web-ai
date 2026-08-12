/**
 * Verifies verifyPayosSignature() against PayOS's own published test vector
 * for the payment-requests webhook signing scheme — no live PayOS account
 * needed, just their documented example.
 * https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/
 *
 * Usage: node scripts/test-payos-signature.mjs
 */
import { verifyPayosSignature } from "../src/lib/payos.js";

const CHECKSUM_KEY =
  "1a54716c8f0efb2744fb28b6e38b25da7f67a925d98bc1c18bd8faaecadd7675";

const DATA = {
  orderCode: 123,
  amount: 3000,
  description: "VQRIO123",
  accountNumber: "12345678",
  reference: "TF230204212323",
  transactionDateTime: "2023-02-04 18:25:00",
  currency: "VND",
  paymentLinkId: "124c33293c43417ab7879e14c8d9eb18",
  code: "00",
  desc: "Thành công",
  counterAccountBankId: "",
  counterAccountBankName: "",
  counterAccountName: "",
  counterAccountNumber: "",
  virtualAccountName: "",
  virtualAccountNumber: "",
};

const EXPECTED_SIGNATURE =
  "412e915d2871504ed31be63c8f62a149a4410d34c4c42affc9006ef9917eaa03";

let failed = 0;
function check(name, pass) {
  console.log(`[${pass ? "PASS" : "FAIL"}] ${name}`);
  if (!pass) failed++;
}

check(
  "PayOS official example: valid signature verifies true",
  verifyPayosSignature(DATA, EXPECTED_SIGNATURE, CHECKSUM_KEY) === true
);

check(
  "Tampered amount is rejected",
  verifyPayosSignature({ ...DATA, amount: 9999999 }, EXPECTED_SIGNATURE, CHECKSUM_KEY) === false
);

check(
  "Wrong checksum key is rejected",
  verifyPayosSignature(DATA, EXPECTED_SIGNATURE, "wrong_key") === false
);

check(
  "Missing checksum key fails closed (not throws)",
  verifyPayosSignature(DATA, EXPECTED_SIGNATURE, undefined) === false
);

check(
  "Missing signature fails closed",
  verifyPayosSignature(DATA, undefined, CHECKSUM_KEY) === false
);

check(
  "Missing data fails closed",
  verifyPayosSignature(undefined, EXPECTED_SIGNATURE, CHECKSUM_KEY) === false
);

console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`);
process.exitCode = failed === 0 ? 0 : 1;
