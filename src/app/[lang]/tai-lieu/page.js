"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { useState, use } from "react";

export default function LeadMagnetPage({ params }) {
  const { lang } = use(params);
  const [dict, setDict] = useState(null);
  const [showZaloPopup, setShowZaloPopup] = useState(false);

  // Load dict
  if (!dict) {
    import(`../../../dictionaries/${lang}.json`).then((m) => setDict(m.default));
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowZaloPopup(true);
  };

  return (
    <>
      <Navbar dict={dict} lang={lang} />
      <main className="pt-32 pb-section-gap px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-16 space-y-6">
          <Badge>TÀI LIỆU EXCLUSIVE</Badge>
          <h1 className="text-headline-hero-mobile md:text-headline-hero font-black text-ink-text leading-tight max-w-4xl mx-auto uppercase">
            TẢI MIỄN PHÍ: BẢN ĐỒ CHUYỂN GIAO AI CHO DOANH NGHIỆP SME
          </h1>
          <p className="font-body-lg text-slate-subtext max-w-2xl mx-auto opacity-80">
            Khám phá lộ trình 5 bước để tích hợp trí tuệ nhân tạo vào quy trình vận hành, giúp tiết kiệm 40% chi phí và nhân đôi hiệu suất làm việc.
          </p>
        </header>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: E-book Mockup */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-primary-container/5 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
            <div className="glass-card rounded-xl p-8 md:p-12 shadow-2xl shadow-primary-container/5 relative overflow-hidden flex items-center justify-center min-h-[500px]">
              <Image
                className="w-full h-auto max-w-sm rounded-lg shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuACgu6jI_V9Il3ewGKJ5S3Saj7J0ZkdB_qalkxA6FvDIG8bZli28sS75XzmZBVTyrHh3-fLtQkL1aaemyWldhSUhAy27YORkHuDyTJIevcAjPSR16QHpg3-6-o1K9ERJQtPmwo0AjY99XWRhHo75LviHOzRv6YiV2UDbYY4oKy1JXNjEmuFhrU9RAbd2T3Lsk0gCH2ex_o7OWx3Cbgbs6v6Gh9ndRBk_dnbik5hFAHt6gtsF1zIxgKrUUZ3xovt-svazdNMFDlRNyI"
                alt="Bản đồ chuyển giao AI"
                width={400}
                height={500}
              />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center bg-white/40 backdrop-blur-md p-4 rounded-xl border border-white/50">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">description</span>
                  <span className="font-headline-sub text-sm">PDF • 45 Trang</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary-container">verified</span>
                  <span className="font-headline-sub text-sm">Update 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Registration Form */}
          <div className="lg:pl-8">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="font-headline-section text-headline-section text-ink-text">
                  Đăng ký nhận tài liệu ngay
                </h2>
                <p className="font-body-md text-slate-subtext">
                  Vui lòng nhập thông tin chính xác để hệ thống gửi link tải tài liệu qua Email &amp; Zalo của bạn trong 30 giây.
                </p>
              </div>
              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Họ và tên</label>
                  <input className="w-full border-0 border-b border-border-subtle bg-transparent py-3 font-body-lg placeholder:text-ink-text/20 focus:outline-none focus:border-primary-container transition-all" placeholder="Nguyễn Văn A" required type="text" name="fullName" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Số điện thoại (Zalo)</label>
                  <input className="w-full border-0 border-b border-border-subtle bg-transparent py-3 font-body-lg placeholder:text-ink-text/20 focus:outline-none focus:border-primary-container transition-all" placeholder="090 123 4567" required type="tel" name="phone" />
                </div>
                <div className="space-y-1">
                  <label className="font-label-eyebrow text-label-eyebrow text-ink-text/50 uppercase">Email công việc</label>
                  <input className="w-full border-0 border-b border-border-subtle bg-transparent py-3 font-body-lg placeholder:text-ink-text/20 focus:outline-none focus:border-primary-container transition-all" placeholder="example@company.com" required type="email" name="email" />
                </div>
                <div className="pt-4">
                  <button className="w-full bg-primary-container text-white py-5 rounded-full font-button-text text-button-text uppercase tracking-[0.2em] shadow-lg shadow-primary-container/20 hover:scale-[1.02] hover:shadow-xl active:scale-95 transition-all duration-300" type="submit">
                    NHẬN TÀI LIỆU QUA EMAIL
                  </button>
                </div>
                <div className="flex items-center justify-center gap-2 text-ink-text/40 font-body-md text-xs italic">
                  <span className="material-symbols-outlined text-sm">lock</span>
                  Cam kết bảo mật thông tin 100%
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Trusted By */}
      <section className="bg-white/40 py-20 border-y border-border-subtle">
        <div className="px-container-padding-mobile md:px-container-padding-desktop max-w-7xl mx-auto">
          <p className="text-center font-label-eyebrow text-label-eyebrow text-ink-text/40 mb-10 tracking-[0.3em] uppercase">ĐƯỢC TIN DÙNG BỞI HƠN 500+ CHỦ DOANH NGHIỆP</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="material-symbols-outlined text-5xl">corporate_fare</span>
            <span className="material-symbols-outlined text-5xl">apartment</span>
            <span className="material-symbols-outlined text-5xl">domain</span>
            <span className="material-symbols-outlined text-5xl">business_center</span>
            <span className="material-symbols-outlined text-5xl">factory</span>
          </div>
        </div>
      </section>

      <Footer dict={dict} lang={lang} />

      {/* Zalo Popup */}
      <Modal isOpen={showZaloPopup} onClose={() => setShowZaloPopup(false)} title="🎉 Tải tài liệu thành công!">
        <div className="space-y-6 text-center">
          <p className="font-body-lg text-slate-subtext">
            Tài liệu đang được gửi tới email của bạn. Trong thời gian chờ đợi, hãy tham gia cộng đồng Zalo của chúng tôi để nhận thêm nhiều tài liệu giá trị!
          </p>
          <div className="bg-mist-bg p-6 rounded-xl">
            <p className="font-headline-sub text-headline-sub text-ink-text mb-4">Cộng Đồng AI Hung Trinh</p>
            <div className="w-40 h-40 bg-white rounded-lg mx-auto flex items-center justify-center border border-border-subtle">
              <span className="material-symbols-outlined text-6xl text-primary-container">qr_code_2</span>
            </div>
          </div>
          <a
            href="https://zalo.me/g/hungtrinh-ai"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-8 py-4 rounded-full font-button-text text-button-text hover:bg-blue-600 transition-colors"
          >
            <span className="material-symbols-outlined">chat</span>
            THAM GIA NHÓM ZALO
          </a>
        </div>
      </Modal>
    </>
  );
}
