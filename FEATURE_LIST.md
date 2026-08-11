# Feature List — Webapp Hung Trinh AI

Danh sách tính năng trích từ [PRD.md](./PRD.md) (Mục 5), tổ chức dạng bảng và chia theo từng Phase triển khai.

**Chú thích trạng thái:** ✅ Đã xong · 🟡 Một phần · ⏳ Chưa làm · 🔒 Chờ Phase 0 (SQL/cấu hình)

**Chú thích ưu tiên:** P0 = Bắt buộc · P1 = Quan trọng · P2 = Mở rộng

---

## Phase 0 — Nền tảng Database & Cấu hình (Foundation)

| # | Tính năng | Mô tả | Tech Stack | Ưu tiên | Trạng thái |
|---|-----------|-------|-----------|:------:|:----------:|
| 0.1 | Schema CSDL cốt lõi | 10 bảng CRM/Auth (`profiles`, `teams`, `leads`, `lead_lists`, `pipeline_stages`...) | Supabase / PostgreSQL | P0 | ✅ |
| 0.2 | Schema nội dung | 6 bảng (`webinars`, `courses`, `lessons`, `lesson_progress`, `blog_posts`, `payment_orders`) | Supabase | P0 | 🔒 Chờ chạy Script 2 |
| 0.3 | RLS & phân quyền | Row Level Security 4 vai trò: admin / team_leader / sales / student | Supabase RLS | P0 | ✅ |
| 0.4 | Trigger đồng bộ profile | Tự tạo `profiles` từ `auth.users`, không ghi đè role | Postgres trigger | P0 | ✅ |
| 0.5 | Cấu hình Auth Provider | Bật Google OAuth + Email, tắt xác thực email, Identity linking | Supabase Dashboard | P0 | 🟡 Email/pass OK, cần bật Google + tắt confirm |

---

## Phase 1 — Xác thực & Phân quyền (Auth & Roles)

| # | Tính năng | Mô tả | Tech Stack | Ưu tiên | Trạng thái |
|---|-----------|-------|-----------|:------:|:----------:|
| 1.1 | Đăng nhập Email/Mật khẩu | Form đăng nhập + đăng ký truyền thống | Supabase Auth | P0 | ✅ |
| 1.2 | Đăng nhập Google OAuth | Nút "Tiếp tục với Google" | Supabase OAuth | P0 | ✅ (cần bật provider) |
| 1.3 | Đăng nhập Apple / Magic Link | OAuth Apple + đăng nhập không mật khẩu | Supabase Auth | P1 | ⏳ |
| 1.4 | Redirect theo vai trò | Staff → /admin, Học viên → /portal | Next.js + helper | P0 | ✅ |
| 1.5 | Bảo vệ route (guard) | Chặn /admin (staff), /portal (đăng nhập) qua middleware | Next.js Proxy | P0 | ✅ |
| 1.6 | Tạo tài khoản admin | Script seed + SQL helper nâng quyền | Service Role API | P0 | ✅ |
| 1.7 | Đăng xuất | Nút logout trong admin/portal | Server Action | P0 | ✅ |

---

## Phase 2 — Quản trị CRM & Dashboard (Admin)

| # | Tính năng | Mô tả | Tech Stack | Ưu tiên | Trạng thái |
|---|-----------|-------|-----------|:------:|:----------:|
| 2.1 | Kanban quản lý Lead | Kéo thả lead giữa 5 giai đoạn pipeline | React DnD | P0 | ✅ |
| 2.2 | List view + Tìm kiếm/Lọc | Bảng lead, search tên/email/SĐT, lọc giai đoạn | Supabase query | P0 | ✅ |
| 2.3 | Danh sách khách hàng | Tạo/gán/xóa lead khỏi danh sách (lead_lists) | Server Action | P0 | ✅ |
| 2.4 | Import CSV | Wizard 4 bước: upload → preview → map cột → đích | PapaParse | P0 | ✅ |
| 2.5 | Export CSV | Xuất lead (BOM UTF-8, mở Excel không lỗi font) | PapaParse | P0 | ✅ |
| 2.6 | Chi tiết & sửa Lead | Modal xem/sửa thông tin, đổi giai đoạn/danh sách | Server Action | P0 | ✅ |
| 2.7 | Dashboard Admin | Doanh thu, lead mới, đơn hàng, tỉ lệ chuyển đổi, biểu đồ 6 tháng | Supabase aggregate | P1 | ✅ |
| 2.8 | Bulk actions | Chọn nhiều lead → gán danh sách / xóa hàng loạt | React | P1 | ✅ |

---

## Phase 3 — Nội dung công khai (Public Content & SEO)

| # | Tính năng | Mô tả | Tech Stack | Ưu tiên | Trạng thái |
|---|-----------|-------|-----------|:------:|:----------:|
| 3.1 | Trang chủ Cá nhân | Split Hero (Sility style), CTA kép, song ngữ | Next.js + Tailwind | P0 | ✅ |
| 3.2 | Cấu hình Đa ngôn ngữ | Middleware `/[lang]/`, từ điển vi.json/en.json, cookie | Next.js i18n | P0 | ✅ |
| 3.3 | Blog SEO (danh sách) | Danh sách bài viết, fallback khi DB rỗng | Supabase query | P1 | ✅ |
| 3.4 | Blog SEO (chi tiết) | Trang bài viết, render nội dung, metadata SEO | Next.js | P1 | ✅ 🔒 |
| 3.5 | Landing Page Webinar | Trang giới thiệu webinar, sticky card mua vé | Dynamic Routes | P0 | 🟡 UI có, query sẵn |
| 3.6 | Trang Khóa học | Catalog khóa học, trang chi tiết | Supabase query | P1 | 🟡 query sẵn, chờ data |
| 3.7 | Quản lý nội dung (Admin) | CRUD blog/khóa học/webinar trong admin | Supabase | P1 | ⏳ |

---

## Phase 4 — Cổng Học Viên (Student Portal / LMS)

| # | Tính năng | Mô tả | Tech Stack | Ưu tiên | Trạng thái |
|---|-----------|-------|-----------|:------:|:----------:|
| 4.1 | Portal Học Viên | Danh sách khóa đã mua + % tiến độ | Supabase query | P0 | ✅ 🔒 |
| 4.2 | Khóa học ngắn (Mini Course) | Cấu trúc khóa → bài học (video + tài liệu) | Supabase | P1 | ✅ 🔒 |
| 4.3 | Theo dõi tiến độ | Đánh dấu hoàn thành bài học, lưu lesson_progress | Server Action | P1 | ✅ 🔒 |
| 4.4 | Video bảo mật (chống tải chùa) | Nhúng Vimeo/Cloudflare Stream thay YouTube | Vimeo/CF API | P0 | ⏳ (đang dùng embed thường) |
| 4.5 | AI Study Assistant | Chatbot hỗ trợ học + upsell dịch vụ | Claude API | P2 | ⏳ |

---

## Phase 5 — Thanh toán Webinar (Payment)

| # | Tính năng | Mô tả | Tech Stack | Ưu tiên | Trạng thái |
|---|-----------|-------|-----------|:------:|:----------:|
| 5.1 | Checkout VietQR động | Sinh QR + mã chuyển khoản duy nhất, đếm ngược 15 phút | VietQR API | P0 | ✅ 🔒 |
| 5.2 | Tạo đơn (subscription + order) | Server action tạo đăng ký + payment_order | Supabase | P0 | ✅ 🔒 |
| 5.3 | Webhook thanh toán | Nhận callback PayOS/Casso → tự đổi trạng thái "Đã thanh toán" | PayOS/Casso | P0 | ✅ 🔒 |
| 5.4 | Polling trạng thái | Trang QR tự kiểm tra mỗi 5s, hiện màn hình thành công | React | P0 | ✅ |
| 5.5 | Nhóm Zalo lớp học | Popup mời vào Zalo kín sau khi thanh toán | Zalo link | P0 | ✅ |
| 5.6 | Gửi vé Zoom (email) | Mail tự động chứa vé + link Zoom sau thanh toán | Resend API | P0 | 🟡 hạ tầng email sẵn |
| 5.7 | Đồng bộ Google Sheets | Đẩy dữ liệu học viên sang Google Sheets | Sheets API | P1 | ⏳ |

---

## Phase 6 — Thu Lead & Thông báo (Lead Magnet & Notifications)

| # | Tính năng | Mô tả | Tech Stack | Ưu tiên | Trạng thái |
|---|-----------|-------|-----------|:------:|:----------:|
| 6.1 | API thu Lead | Endpoint nhận form, validate, lưu vào `leads` | Next.js Route | P0 | ✅ |
| 6.2 | Form Lead Magnet | Form "Đăng ký tư vấn" gắn vào API thật | React | P0 | ✅ |
| 6.3 | Gửi quà tự động (email) | Resend gửi mail chứa link tài liệu | Resend API | P0 | ✅ (cần API key) |
| 6.4 | Popup nhóm Zalo | Mời vào nhóm Zalo cộng đồng sau khi thu lead | Zalo link | P0 | ✅ |
| 6.5 | Alert Admin (Telegram) | Bot báo "có lead/thanh toán mới" realtime | Telegram Bot | P1 | ✅ (cần token) |
| 6.6 | Landing page quà tặng riêng | Trang landing chuyên dụng cho từng tài liệu | Next.js | P1 | ⏳ |

---

## Tổng kết theo Phase

| Phase | Tổng tính năng | ✅ Xong | 🟡 Một phần | ⏳ Chưa | Ghi chú |
|-------|:---:|:---:|:---:|:---:|---------|
| 0 — Foundation | 5 | 3 | 1 | 0 | Chạy Script 2 + bật Google OAuth |
| 1 — Auth | 7 | 6 | 0 | 1 | Còn Apple/Magic Link (P1) |
| 2 — Admin CRM | 8 | 8 | 0 | 0 | Hoàn chỉnh |
| 3 — Public Content | 7 | 3 | 2 | 2 | Cần admin CMS + seed data |
| 4 — Portal | 5 | 3 | 0 | 2 | Video bảo mật + AI Assistant (P2) |
| 5 — Payment | 7 | 5 | 1 | 1 | Còn Google Sheets sync |
| 6 — Lead & Notify | 6 | 5 | 0 | 1 | Còn landing page riêng |

> 🔒 = code đã xong, chỉ chờ **Phase 0** (chạy Script 2 SQL + cấu hình env) để chạy thật.
> Chi tiết kỹ thuật từng phase: xem Implementation Plan trong lịch sử chat hoặc memory dự án.
