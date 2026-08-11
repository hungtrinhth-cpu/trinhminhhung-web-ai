"use client";

import { useState, useRef } from "react";
import { parseCSVFile, suggestFieldForHeader } from "@/lib/csv";
import { IMPORT_FIELDS } from "@/lib/lead-utils";
import { importLeads } from "@/app/[lang]/admin/leads/actions";

const STEPS = ["Tải lên", "Xem trước", "Ghép cột", "Đích đến"];

const UPLOAD_ERRORS = {
  empty: "File không có dữ liệu",
  format: "Chỉ hỗ trợ file .CSV",
  too_large: "File quá lớn (tối đa 5MB)",
  no_data: "File không có dữ liệu hợp lệ",
  too_many_rows: "File chứa quá nhiều dòng (tối đa 1.000 khách hàng mỗi lần)",
  parse: "Không đọc được file, kiểm tra định dạng",
};

export default function ImportCSVModal({ isOpen, onClose, lists, onImported }) {
  const [step, setStep] = useState(0);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({}); // header -> field
  const [uploadError, setUploadError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");

  const [targetMode, setTargetMode] = useState("existing"); // 'existing' | 'new'
  const [targetListId, setTargetListId] = useState(lists[0]?.id ?? "");
  const [newListName, setNewListName] = useState("");

  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);
  const inputRef = useRef(null);

  if (!isOpen) return null;

  function reset() {
    setStep(0);
    setHeaders([]);
    setRows([]);
    setMapping({});
    setUploadError(null);
    setFileName("");
    setResult(null);
    setNewListName("");
    setTargetMode(lists.length ? "existing" : "new");
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleFile(file) {
    setUploadError(null);
    const res = await parseCSVFile(file);
    if (res.error) {
      setUploadError(UPLOAD_ERRORS[res.error] ?? "Lỗi không xác định");
      return;
    }
    setHeaders(res.headers);
    setRows(res.rows);
    setFileName(file.name);
    // Auto-suggest mapping.
    const initial = {};
    for (const h of res.headers) initial[h] = suggestFieldForHeader(h);
    setMapping(initial);
    setStep(1);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  // Validation: at least first_name must be mapped, no duplicate field mapping.
  const mappedFields = Object.values(mapping).filter(Boolean);
  const hasName = mappedFields.includes("first_name");
  const hasDuplicate = mappedFields.length !== new Set(mappedFields).size;
  const canProceedMapping = hasName && !hasDuplicate;

  const targetReady =
    targetMode === "existing" ? !!targetListId : newListName.trim().length > 0;

  function buildMappedRows() {
    return rows.map((row) => {
      const out = {};
      for (const [header, field] of Object.entries(mapping)) {
        if (field) out[field] = row[header];
      }
      return out;
    });
  }

  async function runImport() {
    setImporting(true);
    const payload = {
      rows: buildMappedRows(),
      listId: targetMode === "existing" ? targetListId : undefined,
      newListName: targetMode === "new" ? newListName.trim() : undefined,
    };
    const res = await importLeads(payload);
    setImporting(false);
    setResult(res);
    if (res?.listId && onImported) onImported(res.listId);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-text/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header + stepper */}
        <div className="px-6 py-5 border-b border-border-subtle">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-headline-sub text-headline-sub font-bold text-ink-text">
              Import khách hàng từ CSV
            </h2>
            <button onClick={handleClose} className="text-slate-subtext hover:text-ink-text">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {!result && (
            <div className="flex items-center gap-2">
              {STEPS.map((label, i) => (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div
                    className={`flex items-center gap-1.5 text-xs font-bold ${
                      i === step
                        ? "text-primary-container"
                        : i < step
                        ? "text-secondary"
                        : "text-slate-subtext/40"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        i === step
                          ? "bg-primary-container text-white"
                          : i < step
                          ? "bg-secondary text-white"
                          : "bg-mist-bg text-slate-subtext/40"
                      }`}
                    >
                      {i < step ? "✓" : i + 1}
                    </span>
                    <span className="hidden sm:inline">{label}</span>
                  </div>
                  {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border-subtle" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto flex-1">
          {/* RESULT screen */}
          {result && (
            <div className="text-center py-6 space-y-4">
              {result.error ? (
                <>
                  <span className="material-symbols-outlined text-5xl text-error">error</span>
                  <p className="font-headline-sub text-headline-sub text-error">Import thất bại</p>
                  <p className="font-body-md text-slate-subtext">{result.error}</p>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-5xl text-secondary">
                    check_circle
                  </span>
                  <p className="font-headline-sub text-headline-sub text-ink-text">
                    Đã import {result.inserted} khách hàng
                  </p>
                  {result.skipped > 0 && (
                    <p className="font-body-md text-slate-subtext">
                      {result.skipped} dòng bị bỏ qua
                    </p>
                  )}
                  {result.errors?.length > 0 && (
                    <div className="text-left max-h-40 overflow-y-auto bg-mist-bg rounded-lg p-3 text-xs space-y-1">
                      {result.errors.slice(0, 50).map((e, i) => (
                        <p key={i} className="text-slate-subtext">
                          Dòng {e.row}: {e.reason}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
              <button
                onClick={handleClose}
                className="bg-primary-container text-white px-6 py-2.5 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform"
              >
                Hoàn tất
              </button>
            </div>
          )}

          {/* STEP 0 — Upload */}
          {!result && step === 0 && (
            <div>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={onDrop}
                onClick={() => inputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl py-14 flex flex-col items-center gap-3 transition-all ${
                  dragActive
                    ? "border-primary-container bg-primary-container/5"
                    : "border-border-subtle hover:border-primary-container/40"
                }`}
              >
                <span className="material-symbols-outlined text-4xl text-primary-container">
                  upload_file
                </span>
                <p className="font-body-md text-ink-text">
                  Kéo thả file CSV hoặc <span className="text-primary-container font-bold">chọn từ máy</span>
                </p>
                <p className="font-body-md text-slate-subtext/60 text-xs">
                  Định dạng .CSV, tối đa 5MB / 1.000 dòng
                </p>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </div>
              {uploadError && (
                <p className="text-error text-sm text-center mt-3">{uploadError}</p>
              )}
            </div>
          )}

          {/* STEP 1 — Preview */}
          {!result && step === 1 && (
            <div className="space-y-3">
              <p className="font-body-md text-slate-subtext text-sm">
                <span className="font-bold text-ink-text">{fileName}</span> — đang xem{" "}
                {Math.min(10, rows.length)}/{rows.length} dòng
              </p>
              <div className="overflow-x-auto border border-border-subtle rounded-xl">
                <table className="w-full text-xs">
                  <thead className="bg-mist-bg">
                    <tr>
                      {headers.map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-bold text-ink-text whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((row, i) => (
                      <tr key={i} className="border-t border-border-subtle">
                        {headers.map((h) => (
                          <td key={h} className="px-3 py-2 text-slate-subtext whitespace-nowrap">
                            {row[h]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* STEP 2 — Mapping */}
          {!result && step === 2 && (
            <div className="space-y-3">
              <p className="font-body-md text-slate-subtext text-sm">
                Ghép mỗi cột trong file với trường trong hệ thống.
              </p>
              <div className="space-y-2">
                {headers.map((h) => (
                  <div
                    key={h}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 p-3 bg-mist-bg rounded-xl"
                  >
                    <div className="min-w-0">
                      <p className="font-bold text-ink-text text-sm truncate">{h}</p>
                      <p className="text-slate-subtext/60 text-xs truncate">
                        VD: {rows[0]?.[h] || "—"}
                      </p>
                    </div>
                    <span className="material-symbols-outlined text-slate-subtext/40 text-base">
                      arrow_forward
                    </span>
                    <select
                      value={mapping[h] ?? ""}
                      onChange={(e) => setMapping({ ...mapping, [h]: e.target.value })}
                      className="border border-border-subtle rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-primary-container"
                    >
                      {IMPORT_FIELDS.map((f) => (
                        <option key={f.value} value={f.value}>
                          {f.label}
                          {f.required ? " *" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              {!hasName && (
                <p className="text-error text-xs">
                  * Vui lòng ghép cột tên khách hàng trước khi tiếp tục
                </p>
              )}
              {hasDuplicate && (
                <p className="text-error text-xs">Mỗi trường chỉ được ghép một lần</p>
              )}
            </div>
          )}

          {/* STEP 3 — Target */}
          {!result && step === 3 && (
            <div className="space-y-4">
              <p className="font-body-md text-slate-subtext text-sm">
                Chọn danh sách để import {rows.length} khách hàng vào.
              </p>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={targetMode === "existing"}
                  onChange={() => setTargetMode("existing")}
                  disabled={lists.length === 0}
                />
                <span className="font-body-md text-ink-text text-sm">Thêm vào danh sách có sẵn</span>
              </label>
              {targetMode === "existing" && (
                <select
                  value={targetListId}
                  onChange={(e) => setTargetListId(e.target.value)}
                  className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary-container ml-7"
                >
                  {lists.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.count})
                    </option>
                  ))}
                </select>
              )}

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  checked={targetMode === "new"}
                  onChange={() => setTargetMode("new")}
                />
                <span className="font-body-md text-ink-text text-sm">Tạo danh sách mới</span>
              </label>
              {targetMode === "new" && (
                <input
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Tên danh sách mới"
                  maxLength={100}
                  className="w-full border border-border-subtle rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:border-primary-container ml-7"
                />
              )}

              <div className="bg-mist-bg rounded-xl p-4 text-sm">
                <p className="text-slate-subtext">
                  Sẽ import <span className="font-bold text-ink-text">{rows.length}</span> khách hàng
                  vào danh sách{" "}
                  <span className="font-bold text-primary-container">
                    {targetMode === "existing"
                      ? lists.find((l) => l.id === targetListId)?.name ?? "—"
                      : newListName.trim() || "(chưa đặt tên)"}
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        {!result && (
          <div className="px-6 py-4 border-t border-border-subtle flex items-center justify-between">
            <button
              onClick={() => (step === 0 ? handleClose() : setStep(step - 1))}
              className="font-button-text text-button-text text-sm text-slate-subtext hover:text-ink-text px-4 py-2"
            >
              {step === 0 ? "Hủy" : "Quay lại"}
            </button>

            {step < 3 && step > 0 && (
              <button
                onClick={() => setStep(step + 1)}
                disabled={step === 2 && !canProceedMapping}
                className="bg-primary-container text-white px-6 py-2.5 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
              >
                Tiếp tục
              </button>
            )}

            {step === 3 && (
              <button
                onClick={runImport}
                disabled={!targetReady || importing}
                className="bg-primary-container text-white px-6 py-2.5 rounded-full font-button-text text-button-text text-sm hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
              >
                {importing && (
                  <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                )}
                {importing ? "Đang import..." : "Bắt đầu Import"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
