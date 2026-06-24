# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

---

## Tech Stack — Không thay đổi

- **Framework:** Next.js 16 (App Router) + React 19 — JavaScript, không phải TypeScript
- **Styling:** Tailwind CSS v4 với `@theme` block trong `globals.css` — không phải `tailwind.config.js`
- **Backend / Auth / Database:** Supabase (`@supabase/supabase-js` + `@supabase/ssr`)
- **i18n:** `[lang]` dynamic segment, dictionaries tại `src/dictionaries/vi.json` và `en.json`
- **Routing:** Next.js App Router — không dùng React Router
- **State:** React built-in (useState, useContext) — không có Redux hay Zustand

## Auth — Chỉ dùng Supabase Auth

- Hỗ trợ Google OAuth và email/password qua Supabase
- Supabase client: `src/lib/supabase/client.js` (browser), `src/lib/supabase/server.js` (server component)
- Session được quản lý bởi Supabase SSR — không dùng localStorage
- Auth callback route: `src/app/[lang]/auth/callback/route.js`

## Bảo mật dữ liệu — Bắt buộc

- Tất cả Supabase queries phải có điều kiện `user_id = auth.uid()`
- Không bao giờ query data mà không có user_id filter
- Không bao giờ disable RLS

## Cấu trúc thư mục

- `src/app/[lang]/` — tất cả các routes, phân cấp theo locale
- `src/components/layout/` — Navbar, Footer
- `src/components/ui/` — các UI component tái dùng (Button, Card, Modal, Badge...)
- `src/lib/supabase/` — tất cả Supabase client/server/middleware helpers
- `src/dictionaries/` — file dịch `vi.json` và `en.json`

## i18n Convention

- Mọi text hiển thị phải lấy từ `dict` — không hardcode tiếng Việt hay tiếng Anh trong JSX
- Fallback pattern: `{dict?.section?.key ?? "fallback text"}`
- Thêm key mới vào **cả hai** file `vi.json` và `en.json` cùng lúc
- `NEXT_LOCALE` cookie lưu lựa chọn ngôn ngữ của user — middleware đọc cookie này khi redirect

## Design System

- Màu sắc định nghĩa trong `@theme` block của `globals.css` — dùng Tailwind token (`text-visun-orange`, `bg-visun-blue`...)
- **Brand palette:** Visun Blue `#1A56A8` (70%), White (20%), Orange `#F37021` (10%)
- **Extended:** Deep Blue `#0F3D7A`, Sky Blue `#4A82D4`, Sunset `#C4541A`, Sunrise `#FBA875`
- Glass effect: `.glass-card` (backdrop-blur 12px, bg white/70, border subtle)
- Blue gradient sections: class `section-blue-banner`
- Animation: `.reveal` + `.visible` toggle qua IntersectionObserver (xem `AnimateIn.js`)
- Font: Inter — dùng token `font-headline-hero`, `font-headline-section`, `font-body-md`, `font-button-text`

## Navbar Modes

Navbar nhận prop `mode`: `"public"` (mặc định), `"portal"`, `"admin"` — render khác nhau cho từng context

## Convention

- JavaScript, không TypeScript — không dùng `.ts` / `.tsx`
- Tên file: PascalCase cho components, camelCase cho utils và lib
- Server Components là mặc định — chỉ thêm `"use client"` khi cần interactivity
- Luôn handle error khi gọi Supabase
- Nội dung hiển thị: ưu tiên tiếng Việt cho VI, tiếng Anh cho EN — không mix ngôn ngữ trong cùng một locale
