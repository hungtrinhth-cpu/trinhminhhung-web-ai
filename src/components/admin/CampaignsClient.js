"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCampaign, sendCampaign } from "@/app/[lang]/admin/campaigns/actions";

const AUDIENCE_LABEL = {
  all: "Tất cả (Leads + Học viên)",
  leads: "Chỉ Leads",
  students: "Chỉ học viên đã mua",
};
const STATUS_LABEL = { draft: "Nháp", sending: "Đang gửi...", sent: "Đã gửi", failed: "Thất bại" };
const STATUS_STYLE = {
  draft: "text-slate-500 bg-slate-100",
  sending: "text-blue-600 bg-blue-50",
  sent: "text-green-700 bg-green-50",
  failed: "text-error bg-error/5",
};

// Content templates picked by keyword match — real, fixed templates, not
// AI-generated. Labelled honestly as such in the UI (no "AI" claim).
const CONTENT_TEMPLATES = {
  webinar: {
    subject: "[Hung Trinh AI] Mời tham dự Webinar: Tự Động Hóa Doanh Nghiệp Nhờ AI Agent",
    body: `Chào Anh/Chị,

Kỷ nguyên AI đang phát triển với tốc độ chóng mặt. Những doanh nghiệp đi đầu đang cắt giảm 40% chi phí vận hành và tăng hiệu suất gấp đôi bằng cách ứng dụng AI Agent tự hành.

Nội dung chính:
- Sự khác biệt giữa Chatbot thông thường và AI Agent tự hành.
- Demo quy trình tự động hóa Sales, Marketing & Báo cáo thực tế.
- Lộ trình chuyển giao AI cho doanh nghiệp SME.

Hẹn gặp Anh/Chị tại buổi học!
Trân trọng,
Hung Trinh`,
  },
  ebook: {
    subject: "Quà tặng: Bản đồ Chuyển giao AI cho doanh nghiệp SME Việt Nam",
    body: `Chào bạn,

Cảm ơn bạn đã đăng ký nhận tài liệu từ cộng đồng Hung Trinh AI.

Tài liệu này sẽ giúp bạn hiểu rõ:
- Cách áp dụng các công cụ AI miễn phí vào quy trình kinh doanh.
- Tiêu chí lựa chọn nhân sự vận hành AI.
- Quản lý CRM và tự động hóa email.

Đừng quên tham gia nhóm Zalo hỗ trợ học viên: https://zalo.me/g/hungtrinh-ai

Chúc bạn học tập hiệu quả!
Trân trọng,
Hung Trinh`,
  },
  default: {
    subject: "[Hung Trinh AI] Bản tin tuần: Xu hướng ứng dụng AI trong tuần qua",
    body: `Chào Anh/Chị,

Chúc Anh/Chị một tuần làm việc hiệu quả và nhiều đột phá. Dưới đây là những cập nhật đáng chú ý về ứng dụng AI tuần này.

Đọc bài viết chi tiết tại Blog của tôi.

Trân trọng,
Hung Trinh`,
  },
};

function pickTemplate(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes("webinar") || p.includes("hội thảo") || p.includes("lớp")) return CONTENT_TEMPLATES.webinar;
  if (p.includes("quà") || p.includes("ebook") || p.includes("tài liệu")) return CONTENT_TEMPLATES.ebook;
  return CONTENT_TEMPLATES.default;
}

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Ho_Chi_Minh" });
}

export default function CampaignsClient({ initialCampaigns }) {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isPending, startTransition] = useTransition();

  // router.refresh() re-renders the parent Server Component and passes a new
  // initialCampaigns prop, but useState's initializer only runs on first
  // mount — without this sync-during-render, a newly created/sent campaign
  // never shows up until a full page reload. Same fix as CoursesClient.js/
  // BlogClient.js (adjusting state during render, not in an effect, per
  // React's recommended pattern — avoids the set-state-in-effect lint rule).
  const [prevInitialCampaigns, setPrevInitialCampaigns] = useState(initialCampaigns);
  if (initialCampaigns !== prevInitialCampaigns) {
    setPrevInitialCampaigns(initialCampaigns);
    setCampaigns(initialCampaigns);
  }
  const [showModal, setShowModal] = useState(false);
  const [templatePrompt, setTemplatePrompt] = useState("");
  const [form, setForm] = useState({ name: "", subject: "", audience: "all", body: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sendingId, setSendingId] = useState(null);
  const [rowError, setRowError] = useState({});

  function refresh() {
    startTransition(() => router.refresh());
  }

  function applyTemplate() {
    if (!templatePrompt.trim()) return;
    const t = pickTemplate(templatePrompt);
    setForm((f) => ({ ...f, subject: t.subject, body: t.body }));
  }

  async function handleCreate(e) {
    e.preventDefault();
    setFormError("");
    if (!form.name.trim()) return setFormError("Vui lòng nhập tên chiến dịch");
    if (!form.subject.trim()) return setFormError("Vui lòng nhập tiêu đề email");
    if (!form.body.trim()) return setFormError("Vui lòng nhập nội dung email");

    setSaving(true);
    try {
      const res = await createCampaign(form);
      if (res?.error) {
        setFormError(res.error);
        return;
      }
      setShowModal(false);
      setForm({ name: "", subject: "", audience: "all", body: "" });
      setTemplatePrompt("");
      refresh();
    } catch (err) {
      setFormError(err?.message || "Có lỗi không xác định, vui lòng thử lại");
    } finally {
      setSaving(false);
    }
  }

  async function handleSend(campaign) {
    if (!confirm(`Gửi chiến dịch "${campaign.name}"? Không thể hoàn tác sau khi gửi.`)) return;
    setSendingId(campaign.id);
    setRowError((prev) => ({ ...prev, [campaign.id]: "" }));
    setCampaigns((prev) => prev.map((c) => (c.id === campaign.id ? { ...c, status: "sending" } : c)));
    try {
      const res = await sendCampaign(campaign.id);
      if (res?.error) {
        setRowError((prev) => ({ ...prev, [campaign.id]: res.error }));
      }
      refresh();
    } catch (err) {
      setRowError((prev) => ({ ...prev, [campaign.id]: err?.message || "Có lỗi không xác định, vui lòng thử lại" }));
    } finally {
      setSendingId(null);
    }
  }

  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter((c) => c.status === "sent");
  const totalRecipients = sentCampaigns.reduce((sum, c) => sum + (c.recipient_count || 0), 0);
  const failedCount = campaigns.filter((c) => c.status === "failed").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
            Chiến dịch &amp; Email Marketing
          </h1>
          <p className="font-body-md text-slate-subtext mt-1">Gửi email tới leads và/hoặc học viên đã mua</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          disabled={isPending}
          className="bg-primary-container text-white px-5 py-3 rounded-full font-button-text text-button-text uppercase tracking-wider shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-base">mail</span>
          Tạo chiến dịch mới
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        {[
          { label: "Tổng chiến dịch", value: String(totalCampaigns), icon: "campaign" },
          { label: "Đã gửi thành công", value: String(sentCampaigns.length), icon: "mark_email_read" },
          { label: "Tổng người nhận (đã gửi)", value: totalRecipients.toLocaleString("vi-VN"), icon: "groups" },
          { label: "Thất bại", value: String(failedCount), icon: "error" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-xl p-4 sm:p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-subtext/60">
              <span className="font-label-eyebrow text-label-eyebrow uppercase">{kpi.label}</span>
              <span className="material-symbols-outlined text-xl text-primary-container/60">{kpi.icon}</span>
            </div>
            <p className="text-2xl font-black text-ink-text">{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-hidden border border-border-subtle">
        <div className="p-6 border-b border-border-subtle bg-white/20">
          <h2 className="font-headline-sub text-headline-sub text-ink-text">Danh sách chiến dịch</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border-subtle bg-mist-bg/50">
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Chiến dịch</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Đối tượng</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Trạng thái</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase text-center">Người nhận</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Thời gian</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-mist-bg/45 transition-colors font-body-md text-sm text-ink-text">
                  <td className="p-4 font-bold">{camp.name}</td>
                  <td className="p-4 text-slate-subtext text-xs">{AUDIENCE_LABEL[camp.audience] ?? camp.audience}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${STATUS_STYLE[camp.status] ?? ""}`}>
                      {STATUS_LABEL[camp.status] ?? camp.status}
                    </span>
                    {camp.status === "failed" && camp.last_error && (
                      <p className="text-error text-xs mt-1 max-w-[220px]">{camp.last_error}</p>
                    )}
                    {rowError[camp.id] && <p className="text-error text-xs mt-1 max-w-[220px]">{rowError[camp.id]}</p>}
                  </td>
                  <td className="p-4 text-center">{camp.recipient_count || "—"}</td>
                  <td className="p-4 text-slate-subtext text-xs whitespace-nowrap">
                    {camp.status === "sent" ? formatDateTime(camp.sent_at) : formatDateTime(camp.created_at)}
                  </td>
                  <td className="p-4 text-right">
                    {(camp.status === "draft" || camp.status === "failed") && (
                      <button
                        onClick={() => handleSend(camp)}
                        disabled={sendingId === camp.id || isPending}
                        className="px-3 py-1.5 rounded-full text-xs font-bold bg-primary-container/10 text-primary-container hover:bg-primary-container hover:text-white transition-colors disabled:opacity-60 whitespace-nowrap"
                      >
                        {sendingId === camp.id ? "Đang gửi..." : "Gửi chiến dịch"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {campaigns.length === 0 && (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-subtext/30 mb-3">campaign</span>
            <p className="font-body-lg text-slate-subtext">Chưa có chiến dịch nào</p>
          </div>
        )}
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-card max-w-2xl w-full rounded-2xl p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center border-b border-border-subtle pb-4">
              <h3 className="font-headline-section text-headline-section-mobile text-ink-text">Tạo chiến dịch email mới</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-mist-bg text-slate-subtext"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            <div className="bg-primary-container/5 rounded-xl border border-primary-container/10 p-4 space-y-3">
              <label className="font-label-eyebrow text-label-eyebrow text-primary-container flex items-center gap-1.5 uppercase">
                <span className="material-symbols-outlined text-base">description</span>
                Chọn mẫu nội dung
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={templatePrompt}
                  onChange={(e) => setTemplatePrompt(e.target.value)}
                  className="flex-1 bg-white border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-container"
                  placeholder="Gõ 'webinar', 'ebook', hoặc để trống dùng mẫu bản tin..."
                />
                <button
                  type="button"
                  onClick={applyTemplate}
                  className="bg-primary-container text-white px-4 py-2 rounded-xl font-button-text text-xs hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 shrink-0"
                >
                  Dùng mẫu
                </button>
              </div>
              <p className="text-xs text-slate-subtext/60">Mẫu có sẵn, không phải nội dung do AI tạo — chọn xong vẫn chỉnh sửa tự do bên dưới.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tên chiến dịch (Nội bộ)</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                  placeholder="Ví dụ: Gửi thư mời tham dự Webinar 15/07"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tiêu đề Email</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                    placeholder="Mời tham dự Webinar..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Đối tượng nhận</label>
                  <select
                    value={form.audience}
                    onChange={(e) => setForm({ ...form, audience: e.target.value })}
                    className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container"
                  >
                    <option value="all">Tất cả (Leads + Học viên)</option>
                    <option value="leads">Chỉ Leads</option>
                    <option value="students">Chỉ học viên đã mua</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Nội dung Email (HTML)</label>
                <textarea
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container h-44 resize-none font-mono text-xs"
                  placeholder="Chào bạn, tôi muốn chia sẻ..."
                />
              </div>

              {formError && (
                <div className="text-error text-sm text-center bg-error/5 border border-error/20 rounded-lg py-2 px-3">
                  {formError}
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-border-subtle rounded-full font-button-text text-button-text text-slate-subtext hover:bg-mist-bg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:hover:scale-100"
                >
                  {saving ? "Đang lưu..." : "Lưu nháp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
