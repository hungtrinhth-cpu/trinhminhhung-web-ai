# Tài Liệu Bản Tóm Tắt Thiết Kế (DESIGN BRIEF)
## Dự án: Webapp AI Trainer - Cá nhân Hung Trinh AI

Bản tóm tắt thiết kế này định hình hệ thống nhận diện giao diện (UI/UX Design System), thiết lập phong cách mỹ thuật và quy định cấu trúc thiết kế các trang/thành phần (component) cho ứng dụng Hung Trinh AI.

---

## 1. Phong Cách Thiết Kế Chủ Đạo (Core Design Style)

*   **Tối giản & Tinh tế (Minimalism)**: Loại bỏ các chi tiết thừa, các dải gradient phức tạp hoặc đường phân cách dày. Tập trung vào tỷ lệ chữ, khoảng trống lớn và độ tương phản cao.
*   **Không gian & Khoảng trắng (White Space)**: Tăng kích thước đệm (padding, margin) lớn hơn thông thường từ 15-20% để tạo độ thoáng mắt, sang trọng và dễ đọc.
*   **Kính mờ nhẹ (Soft Glassmorphism)**: Các thành phần giao diện nổi sử dụng màu nền bán trong suốt kết hợp làm mờ hậu cảnh (`backdrop-filter: blur(12px)`) cùng viền siêu mảnh (0.5px - 1px) tạo hiệu ứng chiều sâu nhẹ nhàng như lớp sương.
*   **Font chữ mỏng & Hiện đại**: Sử dụng các font sans-serif hiện đại với độ dày nét chữ mảnh (Font weight: `300` - Light, `400` - Regular, `500` - Medium).

---

## 2. Bảng Màu & Typography (Color & Typography)

### 2.1. Bảng màu đồng bộ nhận diện thương hiệu Visun (Visun Brand Palette)
Chúng ta áp dụng hệ màu nhận diện chính thức của Tập đoàn Visun để đảm bảo đồng bộ thương hiệu từ B2B đến Digital Touchpoints:

*   **Nền trang chủ đạo (Base Background)**: Mist (`#F6F8FB`) hoặc Pure White (`#FFFFFF`) - mang lại cảm giác sạch sẽ, hiện đại và tập trung tối đa vào nội dung.
*   **Nền container phụ (Secondary Background)**: Mist (`#F6F8FB`) hoặc be xám nhẹ - dùng cho các vùng nền cần phân tách nhẹ (như sidebar, top bar).
*   **Màu nhấn duy nhất (Primary Accent)**: Màu Cam Visun (`#F37021`) - được sử dụng làm màu nhấn chính của toàn bộ hệ thống (dành cho CTA, trạng thái đăng ký, liên kết quan trọng).
*   **Màu bổ trợ (Supporting Brand Color)**: Màu Xanh Visun (`#1A56A8`) - làm nền tảng công nghệ, dùng cho trạng thái menu active, đường viền và biểu tượng kỹ thuật số.
*   **Màu chữ chính (Heading & Body Text)**: Màu Ink (`#0E1422`) - đảm bảo tỷ lệ tương phản tối đa trên nền sáng, tạo vẻ hiện đại và dễ đọc.
*   **Màu chữ phụ (Subtext)**: Màu Slate (`#3B4256`) - dùng cho mô tả phụ và chú thích.
*   **Màu đường viền & Lưới (Borders & Grid)**: Viền siêu mảnh (`rgba(59, 66, 86, 0.1)` hoặc `#EAE3D5`) - mỏng 1px hoặc 0.5px để phân tách các khối nhẹ nhàng.

### 2.2. Typography (Hệ thống Kiểu chữ)
*   **Font chữ chính kỹ thuật số (Primary Font)**: **Inter** (Google Fonts) - sử dụng cho mọi điểm chạm digital của Visun.
*   **Font chữ bổ trợ (System Fallback)**: Sans-serif hệ thống.
*   **Kích thước & Trọng lượng (Hierarchy)**:
    *   **H1 (Hero Headline)**: Inter Black (`42px` - `60px`, font-weight: `900`), khoảng cách dòng (`line-height: 1.2`), tracking `-2%`.
    *   **H2 (Section Title)**: Inter ExtraBold (`24px` - `32px`, font-weight: `800`), tracking `-1.5%`.
    *   **H3 (Sub-section Title)**: Inter Bold (`14px` - `18px`, font-weight: `700`), tracking `-1%`.
    *   **Eyebrow (Label/Category)**: Inter Bold (`9px` - `11px`, font-weight: `700`, viết hoa, tracking `+10%`).
    *   **Body Text**: Inter Regular/Light (`14px` - `16px`, font-weight: `400`, `line-height: 1.55`).
    *   **Button/Badge Text**: Inter Bold/Medium (`12px` - `14px`, font-weight: `700`/`500`, tracking rộng `0.05em`, viết hoa).

---

## 3. Cấu Trúc Bố Cục Các Trang (Page Layout Structure)

### 3.1. Trang chủ (Sility Brand Layout)
Bố cục một cột thoáng, phần đầu trang (Hero) sử dụng cấu trúc chia đôi (Split Hero):
*   **Navbar (Header)**: Thiết kế dạng thanh nổi kính mờ màu trắng sữa/trong suốt (`rgba(255, 255, 255, 0.8)` hoặc `rgba(246, 248, 251, 0.8)`), căn chỉnh ở giữa trang với khoảng đệm hai bên rộng.
*   **Hero Section**:
    *   **Trái (60% width)**: Chữ tiêu đề lớn, mỏng, ngắt dòng nghệ thuật kết hợp dấu `+` màu cam Visun (`ĐÀO TẠO+ CHUYỂN GIAO+ VẬN HÀNH+ AI+`). Mô tả giới thiệu ngắn gọn và hai nút CTA song song.
    *   **Phải (40% width)**: Ảnh chân dung anh Hùng sắc nét, nền được xử lý trong suốt hòa vào nền Mist (`#F6F8FB`), căn lề phải sát góc.
*   **Footer**: Màu Ink tối màu tương phản (`#0E1422`) để kết thúc trang một cách vững chãi, chia 4 cột thông tin gọn gàng.

### 3.2. Landing Page Webinar & Checkout
*   **Webinar Detail**: Cấu trúc một cột tập trung. Tiêu đề lớn ở trung tâm (Inter Black), đi kèm danh sách Badge mô tả. Accordion danh mục bài học tối giản xếp dọc ở giữa.
*   **Sticky Payment Widget (Thẻ thanh toán nổi)**:
    *   Thẻ hiển thị giá tiền và nút Đăng ký sẽ bám theo rìa phải màn hình trên máy tính (hoặc bám ở cạnh dưới điện thoại) dưới dạng card kính mờ thanh mảnh.
*   **Checkout Page**:
    *   **Trái**: Thông tin sự kiện và hướng dẫn chuyển khoản.
    *   **Phải**: Thẻ hiển thị mã VietQR động được tạo sắc nét với viền mỏng màu cam Visun (`#F37021`), đồng hồ đếm ngược thiết kế đơn giản bằng chữ số mỏng.

### 3.3. Cổng Học Viên & Dashboard
*   **Khung giao diện (Dashboard Shell)**:
    *   **Trái**: Thanh điều hướng dọc (Sidebar) màu nền phụ Mist (`#F6F8FB`) viền mảnh, cố định.
    *   **Giữa (Main Content)**: Vùng làm việc chính nền sáng (`#FFFFFF` hoặc `#F6F8FB`), sử dụng lưới CSS Grid để hiển thị danh sách buổi học/video dạng Card kính mờ.
*   **Trình phát Video Record**: Video chính chiếm diện tích lớn ở trung tâm, bên phải là thanh Accordion danh sách bài học và khung Chat với trợ lý AI được bo góc cấu trúc kính mờ nhẹ.

---

## 4. Đặc Tả Phong Cách Thành Phần (Component Styling)

### 4.1. Card (Thẻ thông tin)
*   **Style**: Kính mờ nhẹ (Soft Glassmorphism).
*   **CSS**:
    ```css
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(59, 66, 86, 0.1);
    border-radius: 12px;
    box-shadow: 0 4px 30px rgba(14, 20, 34, 0.02);
    padding: 24px;
    transition: all 0.3s ease;
    ```
*   **Hover State**: Đường viền đổi sang màu xanh Visun nhạt (`rgba(26, 86, 168, 0.3)`) hoặc cam nhạt, bóng đổ sâu hơn một chút.

### 4.2. Button (Nút bấm)
*   **Primary Button (Nút chính)**:
    *   **Style**: Nền cam Visun trơn (`#F37021`), chữ trắng, chữ in hoa mỏng, bo góc tròn hoàn toàn (rounded-full).
    *   **CSS**:
        ```css
        background-color: #F37021;
        color: #FFFFFF;
        border-radius: 9999px;
        font-weight: 700;
        letter-spacing: 0.05em;
        transition: transform 0.2s ease, opacity 0.2s ease;
        ```
    *   **Hover**: Nút hơi nẩy lên nhẹ (`transform: translateY(-1px)`) và độ mờ giảm nhẹ (`opacity: 0.95`).
*   **Secondary Button (Nút phụ)**:
    *   **Style**: Viền mảnh màu Slate nhạt (`1px solid rgba(59, 66, 86, 0.2)`), nền trong suốt, chữ màu Ink (`#0E1422`).
    *   **Hover**: Viền đổi sang màu cam Visun (`#F37021`), nền chuyển sang Pure White (`#FFFFFF`).

### 4.3. Input (Ô nhập liệu)
*   **Style**: Tối giản, thanh mảnh.
*   **CSS**:
    ```css
    width: 100%;
    height: 48px;
    padding: 0 16px;
    background: rgba(255, 255, 255, 0.8);
    border: 0;
    border-bottom: 1px solid rgba(59, 66, 86, 0.2);
    color: #0E1422;
    font-weight: 400;
    transition: border-color 0.3s ease;
    ```
*   **Active/Focus State**: Đường viền dưới đổi sang màu cam Visun (`#F37021`), loại bỏ hoàn toàn viền outline mặc định của trình duyệt.

### 4.4. Badge (Thẻ trạng thái)
*   **Style**: Siêu nhỏ, bo tròn, màu dịu mắt.
*   **CSS**:
    ```css
    display: inline-flex;
    padding: 4px 12px;
    background: rgba(243, 112, 33, 0.06); /* Màu cam Visun với opacity 6% */
    border: 0.5px solid rgba(243, 112, 33, 0.2);
    border-radius: 9999px;
    font-size: 11px;
    color: #F37021;
    font-weight: 500;
    letter-spacing: 0.02em;
    ```

### 4.5. Sidebar (Thanh điều hướng dọc)
*   **Style**: Một khối màu Mist (`#F6F8FB`) thẳng đứng, tách biệt với vùng nội dung chính bằng đường line 0.5px màu be xám hoặc Slate mờ.
*   **Layout**: Logo HUNG TRINH AI ở trên cùng; ở giữa là danh mục các nút menu dọc với khoảng cách (gap) thoáng rộng.
*   **Menu Item State**:
    *   **Active**: Chữ đổi sang màu nhấn cam Visun (`#F37021`), ở cạnh trái có một thanh chỉ thị màu cam thẳng đứng cao 16px và dày 2px.
    *   **Inactive/Hover**: Chữ màu Slate (`#3B4256`), khi hover chuột chữ chuyển sang màu Ink đậm (`#0E1422`).

### 4.6. Kanban Card (Thẻ quản lý lead trong Admin)
*   **Style**: Thẻ nhỏ gọn, nền trắng tinh khiết (`#FFFFFF`) xếp trong các cột dọc của bảng quản lý lead.
*   **Layout**:
    *   Phần đầu: Tên Lead (chữ đậm vừa, size 14px) và mã đơn hàng (size 11px màu xám).
    *   Phần giữa: Hiển thị nhanh số điện thoại và email dạng icon mờ.
    *   Phần chân: Một badge thể hiện chiến dịch (ví dụ: `FB-Post-01`) và một badge trạng thái thanh toán (cam cho "Đã thanh toán" - `#F37021`, xanh cho "Chờ quét mã" - `#1A56A8`).
    *   Viền của Kanban Card siêu mỏng 0.5px (`rgba(59, 66, 86, 0.1)`), tạo sự thanh thoát tối đa trên bảng quản trị.
