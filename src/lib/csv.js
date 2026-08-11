import Papa from "papaparse";

export const CSV_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const CSV_MAX_ROWS = 1000;

/**
 * Parse a CSV File into { headers, rows } where rows are objects keyed by header.
 * Resolves with { error } on validation failure.
 */
export function parseCSVFile(file) {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ error: "empty" });
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      resolve({ error: "format" });
      return;
    }
    if (file.size > CSV_MAX_BYTES) {
      resolve({ error: "too_large" });
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      encoding: "UTF-8",
      complete: (results) => {
        const headers = results.meta.fields ?? [];
        const rows = results.data ?? [];
        if (rows.length === 0) {
          resolve({ error: "no_data" });
          return;
        }
        if (rows.length > CSV_MAX_ROWS) {
          resolve({ error: "too_many_rows", count: rows.length });
          return;
        }
        resolve({ headers, rows });
      },
      error: () => resolve({ error: "parse" }),
    });
  });
}

/**
 * Suggest a field mapping for a CSV header using fuzzy Vietnamese/English match.
 * Returns one of: first_name | email | phone | stage | "" (ignore)
 */
export function suggestFieldForHeader(header) {
  const h = header.toLowerCase().trim();
  if (/(họ|ho|tên|ten|name|fullname|full name)/.test(h)) return "first_name";
  if (/(email|e-mail|mail)/.test(h)) return "email";
  if (/(phone|sđt|sdt|số điện|so dien|điện thoại|dien thoai|mobile|tel)/.test(h))
    return "phone";
  if (/(stage|giai đoạn|giai doan|trạng thái|trang thai|status)/.test(h))
    return "stage";
  return "";
}

/**
 * Generate CSV text (with UTF-8 BOM) and trigger a browser download.
 * @param {object[]} rows - array of plain objects
 * @param {string} filename
 */
export function downloadCSV(rows, filename) {
  const csv = Papa.unparse(rows, { quotes: true });
  const bom = "﻿"; // ensures Excel detects UTF-8 → Vietnamese stays intact
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Slugify a list name for use in an export filename.
 */
export function slugifyFilename(name) {
  return (name || "danh-sach")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
