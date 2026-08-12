-- =========================================================================
-- SCHEMA BỔ SUNG: CAMPAIGNS - WEBAPP HUNG TRINH AI
-- File: supabase_schema_campaigns.sql
-- Mô tả: Chạy SAU KHI đã chạy supabase_schema.sql (cần bảng profiles và
--        hàm get_user_role() đã tồn tại). Chạy trực tiếp trên Supabase SQL
--        Editor.
--
-- Phạm vi: Thay thế trang Admin Campaigns đang 100% dữ liệu giả bằng bảng
-- thật — không làm open/click tracking, AI viết nội dung thật, xóa, hay
-- lên lịch gửi (nằm ngoài phạm vi slice này).
-- =========================================================================

create table public.campaigns (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    subject text not null,
    body text not null,
    audience text not null check (audience in ('all', 'leads', 'students')),
    status text not null default 'draft' check (status in ('draft', 'sending', 'sent', 'failed')),
    recipient_count integer not null default 0,
    last_error text,
    created_at timestamptz not null default now(),
    sent_at timestamptz
);

create index if not exists idx_campaigns_status on public.campaigns(status);

alter table public.campaigns enable row level security;

-- Admin-only, không có policy public read nào — khác các bảng nội dung
-- (webinars/courses/blog_posts) vốn cho phép SELECT công khai khi published.
create policy "Quản lý chiến dịch: Chỉ Admin được xem/tạo/sửa"
on public.campaigns for all
using ( public.get_user_role(auth.uid()) = 'admin' )
with check ( public.get_user_role(auth.uid()) = 'admin' );
