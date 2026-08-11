# Tài Liệu Yêu Cầu Sản Phẩm (PRD - Product Requirements Document)
## Dự án: Webapp AI Trainer - Cá nhân Hung Trinh AI

Tài liệu này xác định các yêu cầu chức năng, phi chức năng, kiến trúc kỹ thuật và lộ trình phát triển cho dự án xây dựng Webapp phục vụ công việc Đào tạo AI (AI Trainer) của anh Trịnh Minh Hùng dưới thương hiệu cá nhân **Hung Trinh AI**.

---

## 1. Tổng Quan Dự Án (Project Overview)

### 1.1. Bối cảnh & Mục tiêu
*   **Chủ quản**: Anh Trịnh Minh Hùng (Thương hiệu cá nhân Hung Trinh AI).
*   **Mục tiêu**: Xây dựng một nền tảng Webapp độc quyền phục vụ công việc đào tạo và chuyển giao giải pháp AI cho doanh nghiệp Việt (B2B SME). Hệ thống giúp tự động hóa quy trình thu lead, bán vé webinar, quản lý học viên, cung cấp cổng ôn tập video (record) và các khóa học ngắn (Mini Course) mà không phụ thuộc vào các nền tảng LMS đắt đỏ của bên thứ ba.
*   **Triết lý vận hành**: Tự động hóa - Đơn giản hóa trải nghiệm người dùng - Tận dụng tối đa dòng tiền trực tiếp (chuyển khoản VietQR thẳng vào tài khoản cá nhân).

### 1.2. Đối tượng người dùng chính (Target Persona)
1.  **Lead (Khách hàng tiềm năng)**: Chủ doanh nghiệp SME, nhà quản lý, marketer muốn tìm kiếm giải pháp ứng dụng AI thực tế. Tiếp cận qua các tài liệu quà tặng hoặc bài viết chia sẻ.
2.  **Học viên**: Những người đăng ký học webinar hoặc mini course của anh Hùng, cần một cổng thông tin đăng nhập nhanh để xem lại record lớp học và tài liệu hỗ trợ.
3.  **Admin (Anh Hùng & Đội ngũ)**: Quản lý danh sách lead, theo dõi doanh thu thanh toán thực tế, xuất báo cáo và quản lý nội dung học tập, bài viết SEO.

---

## 2. Thiết Kế Giao Diện & Bộ Nhận Diện (UI/UX Specifications)

![Mockup Giao diện Landing Page và Header Hung Trinh AI phối màu Cam và Xanh dương theo Logo (Giao diện Sáng - Light Mode) phong cách Sility](./mockups/homepage_mockup.png)

Hệ thống được thiết kế theo phong cách tối giản, hiện đại, kế thừa từ phong cách thiết kế của **Kombai.com**, kết hợp cấu trúc chuyển đổi của **Awwwards Academy** và bố cục Personal Brand của **Sility**:

### 2.1. Cảm hứng thiết kế và Bố cục (UI/UX Inspirations)
1.  **Phong cách Sility (Bố cục Trang Chủ & Personal Brand)**: 
    *   **Bố cục chia đôi Hero (Split Hero)**: Bên phải là ảnh chân dung chuyên nghiệp của anh Hùng (khoanh tay cười thân thiện, nền sạch). Bên trái là tiêu đề viết hoa đậm nét kết hợp dấu `+` trực diện: `"ĐÀO TẠO+ CHUYỂN GIAO+ VẬN HÀNH+ AI+"`.
    *   **CTA kép**: Hộp mô tả ngắn kèm 2 nút bấm song song: `"TẢI TÀI LIỆU FREE"` (nền trắng, đổ bóng mềm) và `"KHÓA ĐÀO TẠO AI"` (nền Cam).
2.  **Phong cách Awwwards Academy (Trình bày Khoá học & Webinar)**:
    *   **Hero Banner khóa học**: Tiêu đề chữ to kèm các thẻ Badge tóm tắt nhanh (Thời lượng, Cấp độ).
    *   **Sticky Card/Bar**: Thẻ đăng ký mua vé webinar bám dọc màn hình khi cuộn trang, hiển thị giá tiền và nút Đăng ký mua vé.
    *   **Curriculum Accordion**: Mục lục các bài học hoặc video record thiết kế dạng Accordion tối giản với đường chia mảnh mờ.
3.  **Hệ thống màu sắc (Color Palette) - Đồng bộ theo Logo Visun**:
    *   **Giao diện**: Mặc định sử dụng **Giao diện Sáng (Light Mode)** với màu nền là Mist (`#F6F8FB`) hoặc Pure White (`#FFFFFF`).
    *   **Màu nhấn (Accent Color)**: Màu Cam Visun (`#F37021`) cho các nút bấm hành động chính (CTA), nút đăng ký, và tiêu đề nhấn mạnh.
    *   **Màu bổ trợ (Brand Color)**: Màu Xanh Visun (`#1A56A8`) cho các đường viền thẻ, các menu đang active và biểu tượng công nghệ.
    *   **Màu chữ**: Màu Ink (`#0E1422`) cho headings/body text và màu Slate (`#3B4256`) cho mô tả phụ/chú thích.
4.  **Cấu trúc Phần tử (UI Elements)**:
    *   **Glassmorphism**: Các card danh mục, form đăng ký sử dụng nền trắng kính mờ (`backdrop-filter: blur(12px)`) và viền be xám siêu mảnh.
    *   **Typography**: Sử dụng font chữ không chân hiện đại **Inter** cho mọi điểm chạm kỹ thuật số (kế thừa từ hệ thống chữ kỹ thuật số của Visun).

### 2.2. Cấu trúc Thanh Điều Hướng (Header Navigation)
*   **Header Công khai (Chưa đăng nhập)**:
    *   **Bên trái**: Logo thương hiệu cá nhân **Hung Trinh AI**.
    *   **Ở giữa**: `TRANG CHỦ` | `VỀ TÔI` | `KHÓA ĐÀO TẠO AI` | `BLOGS` | `TÀI LIỆU` | `LIÊN HỆ`.
    *   **Bên phải**: Nút chuyển ngôn ngữ **EN | VI** và nút CTA **"Vào Cổng Học Viên"** (nền Cam, chữ trắng).
*   **Header Portal Học viên (Đã đăng nhập)**:
    *   **Bên trái**: Logo **Hung Trinh AI** + chữ **"Học Viên Portal"**.
    *   **Ở giữa**: `Lớp học của tôi` | `Khóa học ngắn (Mini Course)` | `Thư viện Tài liệu` | `Hỗ trợ kỹ thuật` (link Zalo cá nhân).
    *   **Bên phải**: Dropdown Profile chứa nút **"Đăng xuất"**.
*   **Header Admin Panel (Quản trị viên)**:
    *   **Bên trái**: Logo **Hung Trinh AI** + chữ **"CRM Admin"**.
    *   **Ở giữa**: `Tổng quan` | `Quản lý CRM` | `Chiến dịch & Webinar` | `Quản lý nội dung`.
    *   **Bên phải**: Nút **"Xem Website chính"** và nút **"Đăng xuất"**.

### 2.3. Cấu trúc Chân Trang (Footer)

![Mockup Thiết kế Footer Hung Trinh AI phong cách Sility](./mockups/footer_mockup.png)

Footer được chia làm 2 phần chính:
*   **Phần trên (Newsletter Bar)**:
    *   **Bên trái**: Dòng chữ bold viết hoa `"ĐĂNG KÝ NHẬN BẢN TIN / SUBSCRIBE TO NEWSLETTER"`.
    *   **Bên phải**: Hộp nhập email màu trắng bo tròn, chứa sẵn nút `"SUBMIT"` màu tối nằm ở góc phải bên trong ô nhập.
*   **Phần dưới (4 Cột thông tin rõ ràng)**:
    *   **VỀ TÔI / ABOUT ME**: Giới thiệu ngắn về anh Hùng, đi kèm logo của các nền tảng mạng xã hội có tích hợp link click dẫn trực tiếp đến các kênh chính thức của anh:
        *   **Facebook**: [https://www.facebook.com/mrhungtrinh/](https://www.facebook.com/mrhungtrinh/)
        *   **YouTube**: [https://www.youtube.com/@hungtrinh5055](https://www.youtube.com/@hungtrinh5055)
        *   **LinkedIn**: [https://www.linkedin.com/in/hung-trinh-18117323b/](https://www.linkedin.com/in/hung-trinh-18117323b/)
        *   **Zalo**: Link Zalo cá nhân/kênh chat trực tiếp của anh.
    *   **ĐÀO TẠO / COURSES**: Đường dẫn tới khóa học AI, Webinar, Mini Courses.
    *   **TÀI NGUYÊN / RESOURCES**: Nơi tải tài liệu, Blogs SEO, Cẩm nang ứng dụng.
    *   **HUNG TRINH AI**: Địa chỉ (Hanoi, Vietnam), Email (`contact@hungtrinh.ai`) và thông tin bản quyền.

---

## 3. Kiến Trúc Kỹ Thuật (System Architecture)

*   **Frontend**: Next.js (App Router, JavaScript) sử dụng Vanilla CSS để tối ưu hóa tốc độ tải trang, hiệu năng và chuẩn SEO cho Blog.
*   **Đa ngôn ngữ (i18n)**: Hỗ trợ song ngữ Anh - Việt bằng cấu trúc thư mục dạng `/[lang]/` trong Next.js. Sử dụng Middleware để tự động nhận diện ngôn ngữ và điều hướng. Static texts lưu trong các file Dictionary JSON (`en.json` và `vi.json`).
*   **Backend & Auth**: Supabase (Cơ sở dữ liệu PostgreSQL + Supabase Auth hỗ trợ đăng nhập Google, Apple, và Email/Magic Link + Supabase Storage lưu tài liệu quà tặng). Các bảng hỗ trợ trường song ngữ (ví dụ: `title_vi`, `title_en`).
*   **Thanh toán**: Tự động hóa quét mã VietQR động thông qua webhook đồng bộ của **PayOS** (hoặc Casso) liên kết trực tiếp với ngân hàng cá nhân của anh Hùng.
*   **Thông báo Admin**: Telegram Bot tự động gửi tin nhắn báo cáo giao dịch thời gian thực đến điện thoại của anh Hùng.
*   **Email**: Tích hợp dịch vụ gửi mail tự động **Resend** (gửi vé webinar, link Zoom và link khảo sát).
*   **Zalo**: Điều hướng bằng link nhóm Zalo cá nhân (`zalo.me/g/xxxxx`) trên giao diện sau khi khách hàng hoàn thành form thu lead hoặc thanh toán.

---

## 4. Phân Hệ Chức Năng (Functional Modules)

Hệ thống được chia thành 5 phân hệ cốt lõi hoạt động đồng bộ với nhau (Xem chi tiết bảng tính năng tại Mục 5):

1.  **Phân hệ Thu Lead Quà Tặng (Lead Magnet)**: Landing page quà tặng -> Form thu lead -> Lưu Supabase DB -> Resend tự động gửi mail chứa link tài liệu -> Popup mời vào nhóm Zalo cộng đồng.
2.  **Phân hệ Đăng ký & Thanh toán Webinar**: Landing page webinar (tạo sublink đo lường) -> Sinh mã VietQR động -> Học viên chuyển khoản -> Webhook tự động nhận diện giao dịch -> Đổi trạng thái đơn thành "Đã thanh toán" -> Gửi mail vé Zoom và link Google Sheet khảo sát -> Mời vào nhóm Zalo kín của lớp học.
3.  **Cổng Học Viên (Student Portal)**: Đăng nhập đa kênh -> Học viên xem danh sách các buổi record webinar đã thanh toán (nhúng video bảo mật chống tải chùa) và các khóa học ngắn (Mini Course) -> Trợ lý học tập AI hỗ trợ học tập và Upsell dịch vụ.
4.  **Quản trị CRM & Báo cáo Admin**: Thống kê doanh thu, số lượng đơn hàng, lead, biểu đồ chiến dịch -> Đồng bộ hai chiều dữ liệu học viên sang Google Sheets -> Quản lý thủ công đơn hàng.
5.  **SEO Blog**: Quản lý bài viết chia sẻ kiến thức chuẩn SEO hỗ trợ song ngữ.

---

## 5. Bảng Danh Sách Tính Năng Toàn Diện (Comprehensive Feature List)

| Phân hệ (Subsystem) | Tính năng (Feature) | Mô tả chi tiết (Detailed Description) | Thành phần kỹ thuật (Tech Stack) | Mức độ ưu tiên (Priority) |
| :--- | :--- | :--- | :--- | :--- |
| **Hệ thống chung & i18n** | Cấu hình Đa ngôn ngữ | Thiết lập Middleware đa ngôn ngữ (`/[lang]/`) cho toàn bộ website, tự động nhận diện ngôn ngữ trình duyệt và sử dụng các file từ điển dịch JSON (Anh - Việt). | Next.js, i18n Middleware | Cao (P0) |
| | Đăng Nhập Đa Phương Thức | Học viên đăng nhập nhanh chóng bằng: Google Account, Apple ID, Email Magic Link hoặc email/mật khẩu truyền thống. | Supabase Auth (OAuth, Magic Link) | Cao (P0) |
| **Trang chủ & Blog** | Trang chủ Cá nhân (Sility style) | Giao diện sáng (Light Mode), bố cục chia đôi (ảnh anh Hùng bên phải, chữ lớn bên trái), CTA kép, Header Light Mode và Footer tối màu tương phản. | Next.js, Vanilla CSS | Cao (P0) |
| | Blog SEO | Danh sách bài viết và trang chi tiết bài viết chuẩn SEO đa ngôn ngữ. | Next.js, Markdown parser | Trung bình (P1) |
| **Thu Lead Quà Tặng** | Landing Page Lead Magnet | Trang tặng tài liệu (CES Global style), Form đăng ký (Họ tên, SĐT, Email), lưu dữ liệu lead vào bảng `leads`. | Next.js, Supabase Database | Cao (P0) |
| | Gửi Quà Tự Động & Zalo | Gửi mail tự động chứa tài liệu tải từ Supabase Storage thông qua Resend API; hiển thị popup mời vào nhóm Zalo cộng đồng. | Resend API, Supabase Storage | Cao (P0) |
| **Webinar & Thanh toán** | Landing Page Webinar | Trang giới thiệu sự kiện, hỗ trợ tạo sublink theo chiến dịch (đo lường UTM) để phân loại nguồn đăng ký. | Next.js, Dynamic Routes | Cao (P0) |
| | Checkout VietQR Động | Tự động sinh mã VietQR động chứa số tài khoản, số tiền và nội dung chuyển khoản duy nhất (`HTAIWEBINAR_REG123`), đếm ngược 15 phút. | Next.js, VietQR API | Cao (P0) |
| | Webhook Thanh Toán | Webhook nhận đồng bộ giao dịch từ PayOS/Casso tự động cập nhật đơn hàng thành "Đã thanh toán" trong bảng `registrations`. | PayOS/Casso API, Supabase API | Cao (P0) |
| | Gửi Vé & Đồng Bộ Google Sheets | Gửi mail tự động chứa vé webinar, link Zoom và link khảo sát Google Sheets; đồng bộ dữ liệu học viên sang Google Sheets. | Resend API, Google Sheets API | Cao (P0) |
| | Nhóm Zalo Lớp Học | Chuyển hướng học viên sang nhóm Zalo kín ngay khi thanh toán thành công. | Next.js, Zalo link | Cao (P0) |
| | Alert cho Admin | Telegram Bot tự động báo tin nhắn "Có học viên đăng ký/thanh toán thành công" trong 1 giây đến điện thoại của anh Hùng. | Telegram Bot API | Trung bình (P1) |
| **Cổng Học Viên (LMS)** | Portal Học Viên | Khu vực học tập bảo mật hiển thị danh sách video record các webinar đã tham gia. Video nhúng Vimeo/Cloudflare Stream chống tải chùa. | Next.js, Vimeo / Cloudflare API | Cao (P0) |
| | Khóa học ngắn (Mini Course) | Cấu trúc Chương -> Bài học (Video + Tài liệu đi kèm) bổ trợ kiến thức. | Next.js, Supabase Storage | Trung bình (P1) |
| | AI Study Assistant (Upsell) | Chatbot AI hỗ trợ học viên giải đáp kiến thức liên quan đến bài học và gợi ý khéo léo dịch vụ chuyển giao AI doanh nghiệp cao cấp hơn. | Gemini / Claude API, Vector DB | Thấp (P2) |
| **Quản trị CRM** | Dashboard Admin | CRM quản lý dữ liệu tập trung: Thống kê doanh thu, biểu đồ lead/chiến dịch và cập nhật đơn thủ công. | Next.js, Supabase, ChartJS | Trung bình (P1) |

---

## 6. Kế Hoạch Triển Khai & Kiểm Thử (Implementation & Verification Plan)

Dự án sẽ được triển khai đồng bộ tất cả các tính năng trong một phiên bản phát hành toàn diện nhằm đảm bảo tính liền mạch của quy trình tự động hóa.

### Kế hoạch Kiểm Thử & Kiểm Duyệt (Verification Plan)
1. **Kiểm thử Thu Lead**: Điền form quà tặng, kiểm tra lưu dữ liệu Supabase, email tự động gửi link quà tặng và chuyển hướng nhóm Zalo cá nhân.
2. **Kiểm thử Webinar & Thanh toán**: Đăng ký webinar -> Quét VietQR thanh toán -> Webhook tự động đổi trạng thái đơn, đồng bộ sang Google Sheets, gửi email vé Zoom, mời vào nhóm Zalo kín, gửi thông báo Telegram cho Admin.
3. **Kiểm thử Portal**: Đăng nhập qua Google/Apple/Email Magic Link, kiểm tra phân quyền xem video record, kiểm tra cấu trúc mini course và chatbot hỗ trợ học tập.

---

## 7. Trạng Thái Triển Khai (Implementation Status)

*Tài liệu PRD gốc phía trên giữ nguyên không chỉnh sửa. Mục này chỉ ghi nhận tiến độ thực tế — xem chi tiết đầy đủ từng hạng mục tại [FEATURE_LIST.md](./FEATURE_LIST.md).*

- **Đã hoàn thành** (slice "webinar checkout"): Landing page webinar load theo slug thật (không còn mock), CTA đăng ký tạo đơn `payment_orders` thật, tracking `ref`/`utm_*` từ sublink được lưu vào `payment_orders.metadata`.
- **Schema bổ sung**: bảng `webinars` + `payment_orders` đã tạo và chạy thật trên Supabase — xem [SUPABASE_DESIGN.md §6](./SUPABASE_DESIGN.md#6-schema-bổ-sung-webinar--payment-orders).
- **Chưa hoàn thành**: ảnh VietQR thật và webhook PayOS/Casso chưa test end-to-end (thiếu cấu hình env `NEXT_PUBLIC_VIETQR_*`); Google OAuth chưa bật ở Supabase (nút đăng nhập Google đang ẩn qua feature flag `NEXT_PUBLIC_AUTH_GOOGLE_ENABLED`); Course/LMS, Blog CMS, Admin CMS nội dung, Tracking/Funnel reporting vẫn ở trạng thái mock hoặc chưa bắt đầu.
