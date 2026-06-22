-- =========================================================================
-- KIẾN TRÚC CƠ SỞ DỮ LIỆU & PHÂN QUYỀN SUPABASE - WEBAPP HUNG TRINH AI
-- File: supabase_schema.sql
-- Mô tả: Chạy file này trực tiếp trên Supabase SQL Editor
-- =========================================================================

-- Kích hoạt tiện ích tạo UUID nếu chưa có
create extension if not exists "uuid-ossp";

-- Xóa các bảng cũ nếu tồn tại để tránh xung đột khi chạy lại script (Tùy chọn)
-- drop table if exists public.activity_logs cascade;
-- drop table if exists public.subscriptions cascade;
-- drop table if exists public.tasks cascade;
-- drop table if exists public.lead_tags cascade;
-- drop table if exists public.leads cascade;
-- drop table if exists public.pipeline_stages cascade;
-- drop table if exists public.lead_lists cascade;
-- drop table if exists public.team_members cascade;
-- drop table if exists public.teams cascade;
-- drop table if exists public.profiles cascade;

-- =========================================================================
-- 1. ĐỊNH NGHĨA CÁC BẢNG (TABLES DEFINITION)
-- =========================================================================

-- BẢNG 1: profiles (Hồ sơ người dùng đồng bộ từ auth.users)
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text unique not null,
    full_name text,
    avatar_url text,
    role text not null default 'student' check (role in ('admin', 'team_leader', 'sales', 'student')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- BẢNG 2: teams (Danh sách các nhóm kinh doanh)
create table public.teams (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    leader_id uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now()
);

-- BẢNG 3: team_members (Bảng bắc cầu giữa Teams và Profiles)
create table public.team_members (
    team_id uuid references public.teams(id) on delete cascade,
    member_id uuid references public.profiles(id) on delete cascade,
    created_at timestamptz not null default now(),
    primary key (team_id, member_id)
);

-- BẢNG 4: lead_lists (Các chiến dịch, nguồn thu thập Lead)
create table public.lead_lists (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    description text,
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now()
);

-- BẢNG 5: pipeline_stages (Các bước trong phễu bán hàng CRM)
create table public.pipeline_stages (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    "order" integer not null default 0,
    created_at timestamptz not null default now()
);

-- BẢNG 6: leads (Thông tin khách hàng tiềm năng)
create table public.leads (
    id uuid primary key default gen_random_uuid(),
    first_name text not null,
    last_name text,
    email text,
    phone text,
    list_id uuid references public.lead_lists(id) on delete set null,
    stage_id uuid references public.pipeline_stages(id) on delete set null,
    assigned_to uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- BẢNG 7: lead_tags (Thẻ phân loại gắn kèm với Lead)
create table public.lead_tags (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid not null references public.leads(id) on delete cascade,
    tag text not null,
    created_at timestamptz not null default now(),
    unique (lead_id, tag)
);

-- BẢNG 8: tasks (Các công việc cần làm của Sales để chăm sóc Lead)
create table public.tasks (
    id uuid primary key default gen_random_uuid(),
    lead_id uuid references public.leads(id) on delete cascade,
    assigned_to uuid references public.profiles(id) on delete set null,
    title text not null,
    description text,
    due_date timestamptz,
    status text not null default 'pending' check (status in ('pending', 'completed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- BẢNG 9: subscriptions (Vé đăng ký webinar / Khóa học của học viên)
create table public.subscriptions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    item_type text not null check (item_type in ('webinar', 'course')),
    item_id uuid not null, -- ID tham chiếu đến Webinar hoặc Course bên ngoài
    payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
    amount numeric(12, 2) not null default 0.00,
    created_at timestamptz not null default now()
);

-- BẢNG 10: activity_logs (Lịch sử thao tác nghiệp vụ hệ thống)
create table public.activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete set null,
    action text not null,
    details jsonb default '{}'::jsonb,
    created_at timestamptz not null default now()
);

-- =========================================================================
-- 2. TỐI ƯU HÓA HIỆU NĂNG VỚI CÁC CHỈ MỤC (INDEXES)
-- =========================================================================
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_teams_leader on public.teams(leader_id);
create index if not exists idx_team_members_member on public.team_members(member_id);
create index if not exists idx_team_members_team on public.team_members(team_id);
create index if not exists idx_lead_lists_created_by on public.lead_lists(created_by);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_leads_stage_id on public.leads(stage_id);
create index if not exists idx_leads_list_id on public.leads(list_id);
create index if not exists idx_lead_tags_lead_id on public.lead_tags(lead_id);
create index if not exists idx_tasks_assigned_to on public.tasks(assigned_to);
create index if not exists idx_tasks_lead_id on public.tasks(lead_id);
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_activity_logs_user_id on public.activity_logs(user_id);
create index if not exists idx_activity_logs_created_at on public.activity_logs(created_at desc);

-- =========================================================================
-- 3. CÁC HÀM HELPER SQL CHẠY VỚI QUYỀN TRỊ (SECURITY DEFINER)
-- CHỐNG ĐỆ QUY VÀ NÂNG CAO HIỆU NĂNG CỦA RLS POLICIES
-- =========================================================================

-- Helper 1: Lấy vai trò của người dùng hiện tại (Bypass RLS, cache bằng stable)
create or replace function public.get_user_role(user_uuid uuid)
returns text as $$
declare
    user_role text;
begin
    select role into user_role from public.profiles where id = user_uuid;
    return coalesce(user_role, 'student');
end;
$$ language plpgsql security definer stable;

-- Helper 2: Kiểm tra xem một user có phải thành viên của team do leader quản lý hay không
create or replace function public.is_member_of_my_team(leader_uuid uuid, member_uuid uuid)
returns boolean as $$
begin
    return exists (
        select 1 
        from public.teams t
        join public.team_members tm on t.id = tm.team_id
        where t.leader_id = leader_uuid and tm.member_id = member_uuid
    );
end;
$$ language plpgsql security definer stable;

-- Helper 3: Kiểm tra một user có phải thành viên của một team cụ thể không
create or replace function public.check_is_team_member(user_uuid uuid, check_team_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 
        from public.team_members 
        where team_id = check_team_id and member_id = user_uuid
    );
end;
$$ language plpgsql security definer stable;

-- Helper 4: Kiểm tra một user có phải leader của một team cụ thể không
create or replace function public.check_is_team_leader(user_uuid uuid, check_team_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 
        from public.teams 
        where id = check_team_id and leader_id = user_uuid
    );
end;
$$ language plpgsql security definer stable;

-- Helper 5: Kiểm tra xem Lead List có được tạo bởi User hoặc thành viên trong team của Leader không
create or replace function public.check_list_owner_or_team(user_uuid uuid, check_list_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 
        from public.lead_lists l
        where l.id = check_list_id 
          and (
              l.created_by = user_uuid 
              or public.is_member_of_my_team(user_uuid, l.created_by)
          )
    );
end;
$$ language plpgsql security definer stable;


-- =========================================================================
-- 4. KÍCH HOẠT VÀ ĐỊNH NGHĨA ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Bật RLS cho toàn bộ các bảng dữ liệu
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.lead_lists enable row level security;
alter table public.pipeline_stages enable row level security;
alter table public.leads enable row level security;
alter table public.lead_tags enable row level security;
alter table public.tasks enable row level security;
alter table public.subscriptions enable row level security;
alter table public.activity_logs enable row level security;

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: profiles
-- -------------------------------------------------------------------------
create policy "Xem profiles: Người dùng xem chính mình hoặc Nhân sự nội bộ xem"
on public.profiles for select
using (
    auth.uid() = id 
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader', 'sales')
);

create policy "Cập nhật profiles: Người dùng tự cập nhật thông tin (trừ Role)"
on public.profiles for update
using (auth.uid() = id)
with check (
    auth.uid() = id 
    and role = public.get_user_role(auth.uid()) -- Khóa không cho phép tự ý đổi role
);

create policy "Quyền tối cao: Admin được toàn quyền trên profiles"
on public.profiles for all
using (public.get_user_role(auth.uid()) = 'admin');

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: teams
-- -------------------------------------------------------------------------
create policy "Xem teams: Admin, Leader của team đó, hoặc Thành viên của team đó"
on public.teams for select
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or leader_id = auth.uid() 
    or public.check_is_team_member(auth.uid(), id)
);

create policy "Quản trị teams: Chỉ Admin hoặc Trưởng nhóm được sửa/quản lý team của họ"
on public.teams for all
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or leader_id = auth.uid()
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: team_members
-- -------------------------------------------------------------------------
create policy "Xem thành viên team: Chỉ Admin, Leader của team hoặc các Thành viên trong cùng team"
on public.team_members for select
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or member_id = auth.uid() 
    or public.check_is_team_leader(auth.uid(), team_id) 
    or public.check_is_team_member(auth.uid(), team_id)
);

create policy "Quản lý thành viên team: Admin hoặc Trưởng nhóm có quyền thêm/bỏ thành viên"
on public.team_members for all
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or public.check_is_team_leader(auth.uid(), team_id)
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: lead_lists (Chiến dịch thu lead)
-- -------------------------------------------------------------------------
create policy "Xem danh sách lead list: Admin, Leader, và Sales đều được xem"
on public.lead_lists for select
using (
    public.get_user_role(auth.uid()) in ('admin', 'team_leader', 'sales')
);

create policy "Quản lý lead list: Admin và Trưởng nhóm quản lý danh sách"
on public.lead_lists for all
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or (public.get_user_role(auth.uid()) = 'team_leader' and (created_by = auth.uid() or created_by is null))
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: pipeline_stages
-- -------------------------------------------------------------------------
create policy "Xem phễu: Nhân sự nội bộ được xem cấu trúc phễu bán hàng"
on public.pipeline_stages for select
using (
    public.get_user_role(auth.uid()) in ('admin', 'team_leader', 'sales')
);

create policy "Quản lý phễu: Chỉ Admin được cấu trúc phễu bán hàng"
on public.pipeline_stages for all
using (
    public.get_user_role(auth.uid()) = 'admin'
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: leads (Bảo mật CRM cốt lõi)
-- -------------------------------------------------------------------------
create policy "Xem leads: Admin xem hết; Leader xem team của mình; Sales xem lead được phân công"
on public.leads for select
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or (public.get_user_role(auth.uid()) = 'team_leader' and (
        assigned_to = auth.uid() 
        or public.is_member_of_my_team(auth.uid(), assigned_to)
        or public.check_list_owner_or_team(auth.uid(), list_id)
    )) 
    or (public.get_user_role(auth.uid()) = 'sales' and assigned_to = auth.uid())
);

create policy "Thêm leads: Mọi khách vãng lai và landing page đều được tạo lead mới"
on public.leads for insert
with check (true);

create policy "Cập nhật leads: Theo vai trò quản lý"
on public.leads for update
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or (public.get_user_role(auth.uid()) = 'team_leader' and (
        assigned_to = auth.uid() 
        or public.is_member_of_my_team(auth.uid(), assigned_to)
        or public.check_list_owner_or_team(auth.uid(), list_id)
    )) 
    or (public.get_user_role(auth.uid()) = 'sales' and assigned_to = auth.uid())
)
with check (
    public.get_user_role(auth.uid()) = 'admin' 
    or (public.get_user_role(auth.uid()) = 'team_leader' and (
        assigned_to = auth.uid() 
        or public.is_member_of_my_team(auth.uid(), assigned_to)
        or public.check_list_owner_or_team(auth.uid(), list_id)
    )) 
    or (public.get_user_role(auth.uid()) = 'sales' and assigned_to = auth.uid())
);

create policy "Xóa leads: Chỉ Admin và Trưởng nhóm được quyền xóa lead"
on public.leads for delete
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or (public.get_user_role(auth.uid()) = 'team_leader' and (
        assigned_to = auth.uid() 
        or public.is_member_of_my_team(auth.uid(), assigned_to)
        or public.check_list_owner_or_team(auth.uid(), list_id)
    ))
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: lead_tags
-- -------------------------------------------------------------------------
create policy "Xem tags: Nếu có quyền xem lead thì được xem tag của lead đó"
on public.lead_tags for select
using (
    exists (select 1 from public.leads where id = lead_id)
);

create policy "Quản trị tags: Nếu có quyền quản lý lead thì được quản lý tag"
on public.lead_tags for all
using (
    exists (select 1 from public.leads where id = lead_id)
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: tasks
-- -------------------------------------------------------------------------
create policy "Quản lý công việc: Admin xem/ghi tất cả; Leader xem/ghi của team; Sales xem/ghi công việc phân công cho mình hoặc lead của mình"
on public.tasks for all
using (
    public.get_user_role(auth.uid()) = 'admin' 
    or (public.get_user_role(auth.uid()) = 'team_leader' and (
        assigned_to = auth.uid() 
        or public.is_member_of_my_team(auth.uid(), assigned_to)
        or exists (select 1 from public.leads where id = lead_id)
    )) 
    or (public.get_user_role(auth.uid()) = 'sales' and (
        assigned_to = auth.uid() 
        or exists (select 1 from public.leads where id = lead_id and assigned_to = auth.uid())
    ))
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: subscriptions (Đăng ký học viên)
-- -------------------------------------------------------------------------
create policy "Xem đăng ký: Học viên xem đơn của mình; Admin/Leader xem toàn bộ"
on public.subscriptions for select
using (
    user_id = auth.uid() 
    or public.get_user_role(auth.uid()) in ('admin', 'team_leader')
);

create policy "Tạo đăng ký: Học viên tự tạo đơn đăng ký hoặc Admin tạo"
on public.subscriptions for insert
with check (
    user_id = auth.uid() 
    or public.get_user_role(auth.uid()) = 'admin'
);

create policy "Cập nhật/Xóa đăng ký: Chỉ Admin (hoặc webhook server bypass RLS) được thực hiện"
on public.subscriptions for all
using (
    public.get_user_role(auth.uid()) = 'admin'
);

-- -------------------------------------------------------------------------
-- POLICIES CHO BẢNG: activity_logs
-- -------------------------------------------------------------------------
create policy "Xem nhật ký: Chỉ Admin mới được xem lịch sử log hệ thống"
on public.activity_logs for select
using (
    public.get_user_role(auth.uid()) = 'admin'
);

create policy "Ghi nhật ký: Mọi user đã đăng nhập đều tự ghi log cho chính mình"
on public.activity_logs for insert
with check (
    auth.uid() = user_id 
    or user_id is null
);


-- =========================================================================
-- 5. TRIGGER ĐỒNG BỘ THÔNG TIN TỪ AUTH.USERS SANG PUBLIC.PROFILES
-- HỖ TRỢ IDENTITY LINKING TỰ ĐỘNG VÀ KHÔNG OVERWRITE HỌC VIÊN
-- =========================================================================

-- Định nghĩa hàm trigger đồng bộ
create or replace function public.handle_user_changes()
returns trigger as $$
begin
    if tg_op = 'INSERT' then
        insert into public.profiles (id, email, full_name, avatar_url, role)
        values (
            new.id,
            new.email,
            coalesce(
                new.raw_user_meta_data->>'full_name', 
                new.raw_user_meta_data->>'name', 
                split_part(new.email, '@', 1)
            ),
            new.raw_user_meta_data->>'avatar_url',
            coalesce(new.raw_user_meta_data->>'role', 'student') -- Mặc định là student
        );
    elsif tg_op = 'UPDATE' then
        -- Cập nhật email và thông tin cá nhân cơ bản khi thay đổi ở auth.users
        -- Không bao giờ tự động cập nhật lại cột 'role' để tránh mất phân quyền thủ công từ Admin
        update public.profiles
        set email = new.email,
            full_name = coalesce(
                new.raw_user_meta_data->>'full_name', 
                new.raw_user_meta_data->>'name', 
                public.profiles.full_name
            ),
            avatar_url = coalesce(
                new.raw_user_meta_data->>'avatar_url',
                public.profiles.avatar_url
            ),
            updated_at = now()
        where id = new.id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- Đăng ký trigger lên bảng auth.users
create or replace trigger on_auth_user_changes
    after insert or update on auth.users
    for each row execute procedure public.handle_user_changes();


-- =========================================================================
-- 6. SEED DATA MẪU PHÙ HỢP VỚI WEBAPP HUNG TRINH AI
-- =========================================================================

-- 6.1. Tạo các giai đoạn trong phễu bán hàng (Pipeline Stages)
insert into public.pipeline_stages (name, "order") values
('Khách mới đăng ký', 1),
('Đã liên hệ tư vấn', 2),
('Chờ chuyển khoản (VietQR)', 3),
('Đã thanh toán thành công', 4),
('Không có nhu cầu', 5)
on conflict (name) do update set "order" = excluded."order";

-- Lưu ý quan trọng: Dữ liệu liên quan đến bảng profiles, teams, leads cần chạy thực tế 
-- sau khi đã có người dùng (UUIDs) thực trong auth.users của dự án Supabase.
