import { createHmac } from "crypto";

/**
 * PayOS payment-requests webhook signing scheme, per their published docs:
 * sort the `data` object's keys alphabetically, join as a query string
 * ("key1=value1&key2=value2..."), then HMAC-SHA256 with the checksum key.
 * https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/
 *
 * Note: this differs from the `payouts` API's signing scheme (which
 * encodeURIComponent()s values) — do not reuse this for payouts.
 */
export function sortObjDataByKey(object) {
  return Object.keys(object)
    .sort()
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
}

export function convertObjToQueryStr(object) {
  return Object.keys(object)
    .filter((key) => object[key] !== undefined)
    .map((key) => {
      let value = object[key];
      if (value && Array.isArray(value)) {
        value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
      }
      if ([null, undefined, "undefined", "null"].includes(value)) {
        value = "";
      }
      return `${key}=${value}`;
    })
    .join("&");
}

export function verifyPayosSignature(data, signature, checksumKey) {
  if (!checksumKey || !signature || !data || typeof data !== "object") return false;
  const dataQueryStr = convertObjToQueryStr(sortObjDataByKey(data));
  const expected = createHmac("sha256", checksumKey).update(dataQueryStr).digest("hex");
  return expected === signature;
}
