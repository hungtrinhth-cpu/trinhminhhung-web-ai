-- =========================================================================
-- SCHEMA BỔ SUNG: BLOG_POSTS - WEBAPP HUNG TRINH AI
-- File: supabase_schema_blog.sql
-- Mô tả: Chạy SAU KHI đã chạy supabase_schema.sql (cần bảng profiles và
--        hàm get_user_role() đã tồn tại). Chạy trực tiếp trên Supabase SQL
--        Editor. Độc lập với supabase_schema_courses_lessons.sql — không
--        phụ thuộc thứ tự giữa 2 file này.
--
-- Phạm vi: CHỈ tạo bảng public.blog_posts — bảng nội dung cuối cùng còn
-- thiếu trong Phase 0.2 (Feature List).
-- =========================================================================

-- =========================================================================
-- 1. ĐỊNH NGHĨA BẢNG (TABLE DEFINITION)
-- =========================================================================

-- BẢNG: blog_posts (Bài viết blog, mỗi ngôn ngữ là 1 row riêng)
-- unique(slug, lang) — cùng 1 slug text được phép tồn tại ở 2 ngôn ngữ khác
-- nhau (2 bài khác nhau), nhưng không trùng trong cùng 1 ngôn ngữ. Khớp với
-- cách getBlogPostBySlug(slug, lang) trong src/lib/queries/blog.js đã query.
create table public.blog_posts (
    id uuid primary key default gen_random_uuid(),
    slug text not null,
    lang text not null default 'vi' check (lang in ('vi', 'en')),
    title text not null,
    excerpt text,
    content text,
    thumbnail_url text,
    category text,
    read_time_min integer,
    status text not null default 'draft' check (status in ('draft', 'published')),
    published_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (slug, lang)
);

-- =========================================================================
-- 2. CHỈ MỤC (INDEXES)
-- =========================================================================
create index if not exists idx_blog_posts_status on public.blog_posts(status);
create index if not exists idx_blog_posts_lang on public.blog_posts(lang);

-- =========================================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =========================================================================
alter table public.blog_posts enable row level security;

create policy "Xem bài viết: Ai cũng xem được bài đã published; Admin/Leader xem cả bản nháp"
on public.blog_posts for select
using (
    status = 'published'
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader')
);

create policy "Quản lý bài viết: Chỉ Admin được tạo/sửa/xóa"
on public.blog_posts for all
using (
    public.get_user_role(auth.uid()) = 'admin'
)
with check (
    public.get_user_role(auth.uid()) = 'admin'
);
