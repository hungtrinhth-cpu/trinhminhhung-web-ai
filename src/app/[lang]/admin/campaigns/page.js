"use client";

import { useState, use } from "react";

const initialCampaigns = [
  { id: 'C001', name: 'Newsletter Tuần 25: Làm chủ GPT-4o', type: 'Email Broadcast', status: 'Đã gửi', sent: 248, opens: 168, clicks: 92, date: '2026-06-18' },
  { id: 'C002', name: 'Mời tham dự Webinar AI Agent 2026', type: 'Email Broadcast', status: 'Đã gửi', sent: 350, opens: 245, clicks: 120, date: '2026-06-12' },
  { id: 'C003', name: 'Automation: Xác nhận tải Ebook Bản đồ AI', type: 'Triggered Auto', status: 'Đang chạy', sent: 512, opens: 470, clicks: 310, date: 'Liên tục' },
  { id: 'C004', name: 'Automation: Vé tham dự Webinar + Link Zoom', type: 'Triggered Auto', status: 'Đang chạy', sent: 94, opens: 92, clicks: 88, date: 'Liên tục' },
];

const AI_TEMPLATES = {
  webinar: `Tiêu đề: [Hung Trinh AI] Mời tham dự Webinar: Tự Động Hóa Doanh Nghiệp Nhờ AI Agent

Chào Anh/Chị,

Kỷ nguyên AI đang phát triển với tốc độ chóng mặt. Những doanh nghiệp đi đầu đang cắt giảm 40% chi phí vận hành và tăng hiệu suất gấp đôi bằng cách ứng dụng AI Agent tự hành.

Vào lúc 19:00 ngày 15/07/2026 tới đây, tôi sẽ tổ chức một buổi chia sẻ chuyên sâu (Webinar) độc quyền dành cho SME Owners:
"Tự Động Hóa Doanh Nghiệp Nhờ AI Agent"

Nội dung chính:
- Sự khác biệt giữa Chatbot thông thường và AI Agent tự hành.
- Demo 5 quy trình tự động hóa Sales, Marketing & Báo cáo thực tế.
- Lộ trình 5 bước chuyển giao AI cho doanh nghiệp SME.

Đăng ký giữ chỗ ngay tại link: http://localhost:3000/vi/khoa-hoc/webinar-ai-agent

Hẹn gặp Anh/Chị tại buổi học!
Trân trọng,
Hung Trinh`,
  ebook: `Tiêu đề: Quà tặng: Bản đồ Chuyển giao AI cho doanh nghiệp SME Việt Nam

Chào bạn,

Cảm ơn bạn đã đăng ký nhận tài liệu từ cộng đồng Hung Trinh AI.

Dưới đây là link tải tài liệu PDF độc quyền (45 trang) "Bản đồ Chuyển giao AI cho doanh nghiệp SME":
👉 Link tải trực tiếp: https://supabase-storage.com/files/ai-roadmap-sme-2026.pdf

Tài liệu này sẽ giúp bạn hiểu rõ:
- Cách áp dụng các công cụ AI miễn phí vào quy trình kinh doanh.
- Tiêu chí lựa chọn nhân sự vận hành AI.
- Quản lý CRM và tự động hóa email.

Đừng quên tham gia nhóm Zalo hỗ trợ học viên của chúng tôi để cập nhật tài liệu mới mỗi ngày: https://zalo.me/g/hungtrinh-ai

Chúc bạn học tập hiệu quả!
Trân trọng,
Hung Trinh`,
  default: `Tiêu đề: [Hung Trinh AI] Bản tin tuần: Xu hướng ứng dụng AI trong tuần qua

Chào Anh/Chị,

Chúc Anh/Chị một tuần làm việc hiệu quả và nhiều đột phá. Dưới đây là 3 tin tức nổi bật nhất về ứng dụng AI tuần này:

1. GPT-5 chính thức ra mắt phiên bản Preview với khả năng suy luận vượt trội.
2. Case study: Một doanh nghiệp bán lẻ Việt Nam tăng 300% leads nhờ trợ lý ảo.
3. Hướng dẫn viết Prompt nâng cao cho việc viết bài SEO.

Đọc bài viết chi tiết tại Blog của tôi: http://localhost:3000/vi/blog

Trân trọng,
Hung Trinh`
};

export default function EmailMarketingPage({ params }) {
  use(params);
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [showModal, setShowModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    audience: "all",
    body: "",
  });

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    const newCamp = {
      id: "C00" + (campaigns.length + 1),
      name: form.name,
      type: "Email Broadcast",
      status: "Đã gửi",
      sent: Math.floor(Math.random() * 200) + 100,
      opens: 0,
      clicks: 0,
      date: new Date().toISOString().split("T")[0],
    };
    setCampaigns([newCamp, ...campaigns]);
    setShowModal(false);
    setForm({ name: "", subject: "", audience: "all", body: "" });
    setAiPrompt("");
  };

  const handleGenerateAI = () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setTimeout(() => {
      let selectedText = AI_TEMPLATES.default;
      const promptLower = aiPrompt.toLowerCase();
      if (promptLower.includes("webinar") || promptLower.includes("hội thảo") || promptLower.includes("lớp")) {
        selectedText = AI_TEMPLATES.webinar;
      } else if (promptLower.includes("quà") || promptLower.includes("ebook") || promptLower.includes("tài liệu")) {
        selectedText = AI_TEMPLATES.ebook;
      }
      
      const lines = selectedText.split("\n");
      const subject = lines[0].replace("Tiêu đề: ", "");
      const body = lines.slice(2).join("\n");
      
      setForm((prev) => ({
        ...prev,
        subject: subject,
        body: body,
      }));
      setAiLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-section text-headline-section-mobile md:text-headline-section text-ink-text">
            Chiến dịch &amp; Email Marketing
          </h1>
          <p className="font-body-md text-slate-subtext mt-1">
            Gửi email bản tin (Broadcast) và thiết lập kịch bản email tự động (Automation)
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-container text-white px-5 py-3 rounded-full font-button-text text-button-text uppercase tracking-wider shadow-lg shadow-primary-container/20 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined text-base">mail</span>
          Tạo chiến dịch mới
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-gutter">
        {[
          { label: "Tổng email đã gửi", value: "1,204", icon: "outgoing_mail", trend: "+15% tháng này" },
          { label: "Tỉ lệ mở trung bình", value: "68.2%", icon: "mail_lock", trend: "Cao hơn 8% trung bình" },
          { label: "Tỉ lệ click chuột", value: "32.4%", icon: "ads_click", trend: "Hoạt động ổn định" },
          { label: "Chiến dịch tự động", value: "2 kịch bản", icon: "settings_suggest", trend: "Đang chạy 24/7" },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-card rounded-xl p-4 sm:p-6 space-y-2">
            <div className="flex items-center justify-between text-slate-subtext/60">
              <span className="font-label-eyebrow text-label-eyebrow uppercase">{kpi.label}</span>
              <span className="material-symbols-outlined text-xl text-primary-container/60">{kpi.icon}</span>
            </div>
            <p className="text-2xl font-black text-ink-text">{kpi.value}</p>
            <p className="font-body-md text-slate-subtext text-xs">{kpi.trend}</p>
          </div>
        ))}
      </div>

      {/* Main Campaign List */}
      <div className="glass-card rounded-xl overflow-hidden border border-border-subtle">
        <div className="p-6 border-b border-border-subtle bg-white/20">
          <h2 className="font-headline-sub text-headline-sub text-ink-text">Lịch sử chiến dịch &amp; Kịch bản tự động</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border-subtle bg-mist-bg/50">
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Chiến dịch</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Loại</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Trạng thái</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase text-center">Đã gửi</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase text-center">Tỉ lệ mở</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase text-center">Tỉ lệ click</th>
                <th className="p-4 font-button-text text-[11px] text-slate-subtext uppercase">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {campaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-mist-bg/45 transition-colors font-body-md text-sm text-ink-text">
                  <td className="p-4 font-bold">{camp.name}</td>
                  <td className="p-4 text-slate-subtext text-xs">
                    <span className={`px-2 py-0.5 rounded-full border ${
                      camp.type.includes('Auto') 
                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                        : 'bg-orange-50 text-orange-600 border-orange-100'
                    }`}>
                      {camp.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 text-xs font-bold ${
                      camp.status === 'Đang chạy' ? 'text-green-600' : 'text-slate-subtext/60'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {camp.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">{camp.sent} email</td>
                  <td className="p-4 text-center font-bold">
                    {camp.opens > 0 ? `${Math.round((camp.opens / camp.sent) * 100)}%` : '0%'}
                  </td>
                  <td className="p-4 text-center font-bold">
                    {camp.clicks > 0 ? `${Math.round((camp.clicks / camp.sent) * 100)}%` : '0%'}
                  </td>
                  <td className="p-4 text-slate-subtext text-xs">{camp.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Create Campaign Modal with AI Editor --- */}
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
              <h3 className="font-headline-section text-headline-section-mobile text-ink-text">
                Tạo chiến dịch email mới
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-mist-bg text-slate-subtext"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </button>
            </div>

            {/* AI Copywriting prompt assistant */}
            <div className="bg-primary-container/5 rounded-xl border border-primary-container/10 p-4 space-y-3">
              <label className="font-label-eyebrow text-label-eyebrow text-primary-container flex items-center gap-1.5 uppercase">
                <span className="material-symbols-outlined text-base">smart_toy</span>
                AI Copywriting Assistant
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="flex-1 bg-white border border-border-subtle rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary-container"
                  placeholder="Gợi ý: 'Viết email mời tham dự webinar' hoặc 'Viết email quà tặng ebook'..."
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={aiLoading}
                  className="bg-primary-container text-white px-4 py-2 rounded-xl font-button-text text-xs hover:scale-105 active:scale-95 transition-transform flex items-center gap-1.5 shrink-0"
                >
                  {aiLoading ? "Đang tạo..." : "Tạo bằng AI"}
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
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
                  <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Tiêu đề Email (Khách hàng nhận)</label>
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
                    <option value="all">Tất cả danh sách (Leads + Học viên)</option>
                    <option value="leads">Chỉ Khách hàng tiềm năng (Leads chưa mua)</option>
                    <option value="students">Chỉ Học viên đã thanh toán</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-eyebrow text-label-eyebrow text-slate-subtext/60 uppercase">Nội dung Email</label>
                <textarea
                  required
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  className="w-full bg-mist-bg border border-border-subtle rounded-xl px-4 py-3 font-body-md text-ink-text focus:outline-none focus:border-primary-container h-44 resize-none"
                  placeholder="Chào bạn, tôi muốn chia sẻ..."
                />
              </div>

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
                  className="flex-1 py-3 bg-primary-container text-white rounded-full font-button-text text-button-text hover:scale-105 active:scale-95 transition-transform"
                >
                  GỬI CHIẾN DỊCH (SEND)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
