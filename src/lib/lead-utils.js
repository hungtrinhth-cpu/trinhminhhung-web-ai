// Pure, client-safe helpers for lead data. No server imports here.

/** Display name from a lead row (last_name is optional). */
export function leadDisplayName(lead) {
  return [lead.first_name, lead.last_name].filter(Boolean).join(" ").trim();
}

/** System fields the CSV importer can map columns onto. */
export const IMPORT_FIELDS = [
  { value: "first_name", label: "Họ và tên", required: true },
  { value: "email", label: "Email", required: false },
  { value: "phone", label: "Số điện thoại", required: false },
  { value: "", label: "— Bỏ qua cột này —", required: false },
];
