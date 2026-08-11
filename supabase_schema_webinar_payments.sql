-- =========================================================================
-- SCHEMA BỔ SUNG: WEBINAR + PAYMENT ORDERS - WEBAPP HUNG TRINH AI
-- File: supabase_schema_webinar_payments.sql
-- Mô tả: Chạy SAU KHI đã chạy supabase_schema.sql (cần bảng profiles,
--        subscriptions đã tồn tại). Chạy trực tiếp trên Supabase SQL Editor.
--
-- Phạm vi: CHỈ tạo 2 bảng cần cho first slice "Webinar + Checkout":
--   - public.webinars
--   - public.payment_orders
-- Các bảng courses/lessons/lesson_progress/blog_posts KHÔNG nằm trong file
-- này, sẽ có migration riêng ở phase sau.
-- =========================================================================

-- =========================================================================
-- 1. ĐỊNH NGHĨA CÁC BẢNG (TABLES DEFINITION)
-- =========================================================================

-- BẢNG: webinars (Nội dung landing page webinar)
create table public.webinars (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    subtitle text,
    instructor text,
    instructor_title text,
    instructor_bio text,
    scheduled_at timestamptz,
    duration_min integer,
    format text,
    level text,
    price numeric(12, 2) not null default 0.00,
    original_price numeric(12, 2),
    seats_total integer,
    seats_left integer,
    thumbnail_url text,
    tags jsonb not null default '[]'::jsonb,
    highlights jsonb not null default '[]'::jsonb,
    curriculum jsonb not null default '[]'::jsonb,
    status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- BẢNG: payment_orders (Đơn thanh toán VietQR — liên kết trực tiếp tới item
-- được mua qua item_type/item_id, KHÔNG phụ thuộc vào subscription_id. Lý do:
-- subscription_id có thể null (flow tương lai chưa chắc đã tạo subscription
-- ngay), nhưng đơn hàng luôn phải tự biết nó đang mua cái gì.
create table public.payment_orders (
    id uuid primary key default gen_random_uuid(),
    subscription_id uuid references public.subscriptions(id) on delete cascade,
    user_id uuid not null references public.profiles(id) on delete cascade,
    item_type text not null check (item_type in ('webinar', 'course', 'subscription')),
    item_id uuid,
    order_code text not null unique,
    amount numeric(12, 2) not null default 0.00,
    description text,
    qr_url text,
    bank_account text,
    bank_code text,
    payment_gateway text not null default 'vietqr',
    status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'expired')),
    -- Tracking sub-link/campaign: { "ref": "...", "utm_source": "...", "utm_medium": "...", "utm_campaign": "..." }
    metadata jsonb not null default '{}'::jsonb,
    webhook_payload jsonb,
    paid_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- =========================================================================
-- 2. CHỈ MỤC (INDEXES)
-- =========================================================================
create index if not exists idx_webinars_status on public.webinars(status);
create index if not exists idx_payment_orders_user_id on public.payment_orders(user_id);
create index if not exists idx_payment_orders_subscription_id on public.payment_orders(subscription_id);
create index if not exists idx_payment_orders_status on public.payment_orders(status);
create index if not exists idx_payment_orders_item on public.payment_orders(item_type, item_id);

-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- Dùng lại helper public.get_user_role() đã định nghĩa trong supabase_schema.sql
-- =========================================================================
alter table public.webinars enable row level security;
alter table public.payment_orders enable row level security;

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: webinars
-- -------------------------------------------------------------------------
create policy "Xem webinars: Ai cũng xem được webinar đã published; Admin/Leader xem cả bản nháp"
on public.webinars for select
using (
    status = 'published'
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader')
);

create policy "Quản lý webinars: Chỉ Admin được tạo/sửa/xóa"
on public.webinars for all
using (
    public.get_user_role(auth.uid()) = 'admin'
)
with check (
    public.get_user_role(auth.uid()) = 'admin'
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: payment_orders
-- -------------------------------------------------------------------------
create policy "Xem đơn thanh toán: Chủ đơn xem đơn của mình; Admin/Leader xem toàn bộ"
on public.payment_orders for select
using (
    user_id = auth.uid()
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader')
);

create policy "Tạo đơn thanh toán: User tự tạo đơn của chính mình hoặc Admin tạo"
on public.payment_orders for insert
with check (
    user_id = auth.uid()
    or public.get_user_role(auth.uid()) = 'admin'
);

create policy "Cập nhật/Xóa đơn thanh toán: Chỉ Admin (webhook server dùng service-role, tự bypass RLS)"
on public.payment_orders for update
using (
    public.get_user_role(auth.uid()) = 'admin'
);

create policy "Xóa đơn thanh toán: Chỉ Admin"
on public.payment_orders for delete
using (
    public.get_user_role(auth.uid()) = 'admin'
);

-- =========================================================================
-- 4. SEED DATA: 1 WEBINAR MẪU ĐỂ TEST /vi/webinar/ai-agent-2025
-- =========================================================================
insert into public.webinars (
    slug, title, subtitle, instructor, instructor_title, instructor_bio,
    scheduled_at, duration_min, format, level,
    price, original_price, seats_total, seats_left, thumbnail_url,
    tags, highlights, curriculum, status
) values (
    'ai-agent-2025',
    'AI Agent Thực Chiến 2025',
    'Xây dựng và triển khai hệ thống AI Agent tự động cho doanh nghiệp SME',
    'Hung Trinh',
    'Chuyên gia AI & Founder Hung Trinh AI',
    'Hơn 10 năm kinh nghiệm trong đào tạo và tư vấn giải pháp AI cho doanh nghiệp tại Việt Nam.',
    '2026-07-15 19:00:00+07',
    180,
    'Online Live',
    'Trung cấp',
    499000, 999000, 100, 23,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg',
    '["AI Agent", "Automation", "SME", "No-code"]'::jsonb,
    '[
        "Hiểu bản chất và kiến trúc AI Agent hiện đại",
        "Xây dựng agent tự động trả lời khách hàng 24/7",
        "Tích hợp vào quy trình bán hàng và chăm sóc khách hàng",
        "Demo live 5 use case thực tế tại doanh nghiệp Việt",
        "Template workflow miễn phí sau webinar",
        "Hỗ trợ Q&A trực tiếp với chuyên gia"
    ]'::jsonb,
    '[
        {"id": 1, "title": "Giới thiệu AI Agent & Kiến trúc hệ thống", "duration": "30 phút", "type": "video"},
        {"id": 2, "title": "Các nền tảng no-code xây dựng agent (Make, n8n, Flowise)", "duration": "45 phút", "type": "video"},
        {"id": 3, "title": "Demo thực tế: Agent tự động phân loại lead", "duration": "40 phút", "type": "demo"},
        {"id": 4, "title": "Demo thực tế: Chatbot chăm sóc khách hàng 24/7", "duration": "35 phút", "type": "demo"},
        {"id": 5, "title": "Q&A và hướng dẫn nhận template", "duration": "30 phút", "type": "qa"}
    ]'::jsonb,
    'published'
)
on conflict (slug) do nothing;
