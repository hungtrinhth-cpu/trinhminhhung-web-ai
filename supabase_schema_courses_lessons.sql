-- =========================================================================
-- SCHEMA BỔ SUNG: COURSES + LESSONS + LESSON_PROGRESS - WEBAPP HUNG TRINH AI
-- File: supabase_schema_courses_lessons.sql
-- Mô tả: Chạy SAU KHI đã chạy supabase_schema.sql VÀ
--        supabase_schema_webinar_payments.sql (cần bảng profiles,
--        subscriptions đã tồn tại). Chạy trực tiếp trên Supabase SQL Editor.
--
-- Phạm vi: CHỈ tạo 3 bảng cần cho slice "Course/LMS real DB foundation":
--   - public.courses
--   - public.lessons
--   - public.lesson_progress
-- Bảng blog_posts KHÔNG nằm trong file này, sẽ có migration riêng ở phase sau.
-- =========================================================================

-- =========================================================================
-- 1. ĐỊNH NGHĨA CÁC BẢNG (TABLES DEFINITION)
-- =========================================================================

-- BẢNG: courses (Nội dung catalog + trang chi tiết khóa học)
create table public.courses (
    id uuid primary key default gen_random_uuid(),
    slug text not null unique,
    title text not null,
    subtitle text,
    description text,
    level text,
    price numeric(12, 2) not null default 0.00,
    original_price numeric(12, 2),
    thumbnail_url text,
    tags jsonb not null default '[]'::jsonb,
    status text not null default 'draft' check (status in ('draft', 'published', 'closed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- BẢNG: lessons (Bài học thuộc 1 khóa học)
-- unique(course_id, "order") vừa đảm bảo thứ tự bài học trong 1 khóa không
-- trùng nhau, vừa là conflict target để seed lessons chạy lại không bị nhân đôi.
create table public.lessons (
    id uuid primary key default gen_random_uuid(),
    course_id uuid not null references public.courses(id) on delete cascade,
    title text not null,
    description text,
    video_url text,
    duration_sec integer,
    "order" integer not null default 0,
    is_preview boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (course_id, "order")
);

-- BẢNG: lesson_progress (Tiến độ học của từng học viên theo từng bài)
-- unique(user_id, lesson_id) bắt buộc để khớp với upsert onConflict
-- 'user_id,lesson_id' đã dùng sẵn trong portal/actions.js's setLessonProgress().
create table public.lesson_progress (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    lesson_id uuid not null references public.lessons(id) on delete cascade,
    completed boolean not null default false,
    completed_at timestamptz,
    created_at timestamptz not null default now(),
    unique (user_id, lesson_id)
);

-- =========================================================================
-- 2. CHỈ MỤC (INDEXES)
-- =========================================================================
create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_lessons_course_id on public.lessons(course_id);
create index if not exists idx_lesson_progress_user_id on public.lesson_progress(user_id);
create index if not exists idx_lesson_progress_lesson_id on public.lesson_progress(lesson_id);

-- =========================================================================
-- 3. HÀM HELPER (dùng lại pattern SECURITY DEFINER của get_user_role())
-- =========================================================================
create or replace function public.has_paid_course_access(user_uuid uuid, target_course_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 from public.subscriptions
        where user_id = user_uuid
          and item_type = 'course'
          and item_id = target_course_id
          and payment_status = 'paid'
    );
end;
$$ language plpgsql security definer stable;

-- =========================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- =========================================================================
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: courses
-- -------------------------------------------------------------------------
create policy "Xem khóa học: Ai cũng xem được khóa đã published; Admin/Leader xem cả bản nháp"
on public.courses for select
using (
    status = 'published'
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader')
);

create policy "Quản lý khóa học: Chỉ Admin được tạo/sửa/xóa"
on public.courses for all
using (
    public.get_user_role(auth.uid()) = 'admin'
)
with check (
    public.get_user_role(auth.uid()) = 'admin'
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: lessons
-- -------------------------------------------------------------------------
create policy "Xem bài học: Preview công khai, học viên đã mua, hoặc Admin/Leader"
on public.lessons for select
using (
    is_preview = true
    or public.has_paid_course_access(auth.uid(), course_id)
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader')
);

create policy "Quản lý bài học: Chỉ Admin được tạo/sửa/xóa"
on public.lessons for all
using (
    public.get_user_role(auth.uid()) = 'admin'
)
with check (
    public.get_user_role(auth.uid()) = 'admin'
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: lesson_progress
-- -------------------------------------------------------------------------
create policy "Xem tiến độ học: Học viên xem của mình; Admin/Leader xem tất cả"
on public.lesson_progress for select
using (
    user_id = auth.uid()
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader')
);

create policy "Ghi tiến độ học: Học viên tự tạo tiến độ của mình"
on public.lesson_progress for insert
with check (
    user_id = auth.uid()
);

create policy "Sửa tiến độ học: Học viên tự sửa tiến độ của mình"
on public.lesson_progress for update
using (
    user_id = auth.uid()
)
with check (
    user_id = auth.uid()
);

-- =========================================================================
-- 5. SEED DATA: 1 KHÓA HỌC + 2 BÀI HỌC MẪU ĐỂ TEST /vi/khoa-hoc/ai-mastery-pro
-- =========================================================================
insert into public.courses (
    slug, title, subtitle, description, level,
    price, original_price, thumbnail_url, tags, status
) values (
    'ai-mastery-pro',
    'AI Mastery Pro',
    'Làm chủ AI toàn diện từ nền tảng đến ứng dụng thực tiễn',
    'Khóa học chuyên sâu giúp bạn hiểu bản chất AI hiện đại, thành thạo các công cụ chủ lực và biết cách triển khai AI vào vận hành doanh nghiệp SME Việt Nam — từ tư duy chiến lược đến thực hành từng bước.',
    'Nâng cao',
    2499000, 3499000,
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCIJ0vRmYAElmUkDlRioYE8vEntXv6InNTbLf6o_FVOv3idhXdTdt511tvSAg6bmlQSe7GybbOzTk6wk_kqU-mXg',
    '["AI", "Automation", "SME"]'::jsonb,
    'published'
)
on conflict (slug) do nothing;

insert into public.lessons (course_id, title, description, video_url, duration_sec, "order", is_preview)
select id,
    'Giới thiệu: Tại sao AI là tương lai?',
    'Tổng quan về cuộc cách mạng AI và tác động đến doanh nghiệp SME Việt Nam.',
    'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    750, 1, true
from public.courses where slug = 'ai-mastery-pro'
on conflict (course_id, "order") do nothing;

insert into public.lessons (course_id, title, description, video_url, duration_sec, "order", is_preview)
select id,
    'Kiến trúc hệ thống AI hiện đại',
    'Đi sâu vào cách các thành phần AI Agent, LLM và dữ liệu doanh nghiệp kết hợp với nhau.',
    'https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1',
    1125, 2, false
from public.courses where slug = 'ai-mastery-pro'
on conflict (course_id, "order") do nothing;
