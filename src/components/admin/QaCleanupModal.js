"use client";

import { useEffect, useState } from "react";
import { previewQaTestCourseCleanup, runQaTestCourseCleanup } from "@/app/[lang]/admin/courses/actions";

export default function QaCleanupModal({ onClose, onDone }) {
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await previewQaTestCourseCleanup();
      if (cancelled) return;
      if (res?.error) setError(res.error);
      else setPreview(res);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleConfirmDelete() {
    setDeleting(true);
    setError("");
    try {
      const res = await runQaTestCourseCleanup();
      if (res?.error) {
        setError(res.error);
        return;
      }
      setResult(res);
      onDone?.();
    } catch (err) {
      setError(err?.message || "Có lỗi không xác định, vui lòng thử lại");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-card max-w-lg w-full rounded-2xl p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b border-border-subtle pb-4">
          <h3 className="font-headline-section text-headline-section-mobile text-ink-text">
            Dọn dữ liệu QA_TEST_
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-mist-bg text-slate-subtext"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {loading && <p className="font-body-md text-slate-subtext">Đang kiểm tra...</p>}

        {error && (
          <div className="text-error text-sm text-center bg-error/5 border border-error/20 rounded-lg py-2 px-3">
            {error}
          </div>
        )}

        {!loading && !result && preview && (
          <div className="space-y-4">
            <p className="font-body-md text-ink-text">
              Sẽ xoá thật <strong>{preview.safe.length}</strong> khóa học có tên bắt đầu bằng{" "}
              <code className="text-sm bg-mist-bg px-1.5 py-0.5 rounded">QA_TEST_</code>, đang ở trạng thái nháp/đã
              đóng (không đụng khóa học đã đăng), cùng toàn bộ bài học bên trong.
            </p>

            {preview.safe.length > 0 && (
              <ul
                data-testid="qa-cleanup-safe-list"
                className="text-xs text-slate-subtext max-h-32 overflow-y-auto space-y-0.5 bg-mist-bg rounded-lg p-3"
              >
                {preview.safe.map((c) => (
                  <li key={c.id} data-testid="qa-cleanup-safe-item">
                    {c.title}
                  </li>
                ))}
              </ul>
            )}

            {preview.blocked.length > 0 && (
              <div className="text-sm bg-yellow-50 border border-yellow-200 rounded-lg p-3 space-y-1">
                <p className="font-bold text-yellow-800">
                  {preview.blocked.length} khóa học bị bỏ qua (có đơn hàng/đăng ký gắn vào, cần kiểm tra thủ công):
                </p>
                <ul className="text-xs text-yellow-700 space-y-0.5">
                  {preview.blocked.map((c) => (
                    <li key={c.id}>{c.title}</li>
                  ))}
                </ul>
              </div>
            )}

            {preview.safe.length === 0 ? (
              <p className="font-body-md text-slate-subtext text-sm">Không có gì để dọn.</p>
            ) : null}

            <div className="pt-2 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 border border-border-subtle rounded-full font-button-text text-button-text text-slate-subtext hover:bg-mist-bg transition-colors"
              >
                {preview.safe.length === 0 ? "Đóng" : "Hủy bỏ"}
              </button>
              {preview.safe.length > 0 && (
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 py-3 bg-error text-white rounded-full font-button-text text-button-text hover:scale-105 transition-transform disabled:opacity-60 disabled:hover:scale-100"
                >
                  {deleting ? "Đang xoá..." : `Xác nhận xoá ${preview.safe.length} khóa học`}
                </button>
              )}
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <p className="font-body-md text-ink-text">
              Đã xoá <strong>{result.deletedCount}</strong> khóa học QA_TEST_.
              {result.blocked?.length > 0 && ` ${result.blocked.length} khóa học được giữ lại vì có đơn hàng/đăng ký gắn vào.`}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-105 transition-transform"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
