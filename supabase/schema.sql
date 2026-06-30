-- 起跑線上的共鳴｜Supabase backend schema
-- Run this file in Supabase SQL Editor before switching VITE_DATA_BACKEND to "supabase".

create table if not exists public.tasks (
  id text primary key,
  title text not null,
  organization text not null,
  summary text not null,
  details text not null,
  skills text[] not null default '{}'::text[],
  mode text not null check (mode in ('線上', '實體', '混合')),
  time text not null,
  volunteer_hours boolean not null default false,
  contact text not null,
  status text not null default '招募中' check (status in ('招募中', '已媒合', '已結束')),
  location text not null default '',
  privacy_consent boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.students (
  id text primary key,
  name text not null,
  school text not null,
  identity text not null check (identity in ('高中生', '大學生')),
  background text not null,
  skills text[] not null default '{}'::text[],
  bio text not null,
  availability text not null,
  contact text not null,
  needs_hours boolean not null default false,
  is_public boolean not null default false,
  privacy_consent boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.applications (
  id text primary key,
  task_id text not null references public.tasks(id) on delete cascade,
  student_name text not null,
  contact text not null,
  skill text not null,
  reason text not null,
  privacy_consent boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
before update on public.tasks
for each row execute function public.set_updated_at();

drop trigger if exists set_students_updated_at on public.students;
create trigger set_students_updated_at
before update on public.students
for each row execute function public.set_updated_at();

drop trigger if exists set_applications_updated_at on public.applications;
create trigger set_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

alter table public.tasks enable row level security;
alter table public.students enable row level security;
alter table public.applications enable row level security;

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.admin_profiles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

grant usage on schema public to anon, authenticated;

grant select, insert on public.tasks to anon, authenticated;
grant update, delete on public.tasks to authenticated;

grant insert on public.students to anon, authenticated;
grant select, update, delete on public.students to authenticated;

grant insert on public.applications to anon, authenticated;
grant select, update, delete on public.applications to authenticated;

grant select on public.admin_profiles to authenticated;

drop policy if exists "Tasks are publicly readable" on public.tasks;
create policy "Tasks are publicly readable"
on public.tasks for select
using (true);

drop policy if exists "Anyone can publish consented tasks" on public.tasks;
create policy "Anyone can publish consented tasks"
on public.tasks for insert
with check (privacy_consent = true);

drop policy if exists "Authenticated admins can update tasks" on public.tasks;
create policy "Authenticated admins can update tasks"
on public.tasks for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can delete tasks" on public.tasks;
create policy "Authenticated admins can delete tasks"
on public.tasks for delete
to authenticated
using (public.is_admin());

drop policy if exists "Anyone can register consented students" on public.students;
create policy "Anyone can register consented students"
on public.students for insert
with check (privacy_consent = true);

drop policy if exists "Authenticated admins can read students" on public.students;
create policy "Authenticated admins can read students"
on public.students for select
to authenticated
using (public.is_admin());

drop policy if exists "Authenticated admins can update students" on public.students;
create policy "Authenticated admins can update students"
on public.students for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can delete students" on public.students;
create policy "Authenticated admins can delete students"
on public.students for delete
to authenticated
using (public.is_admin());

drop policy if exists "Anyone can apply with consent" on public.applications;
create policy "Anyone can apply with consent"
on public.applications for insert
with check (privacy_consent = true);

drop policy if exists "Authenticated admins can read applications" on public.applications;
create policy "Authenticated admins can read applications"
on public.applications for select
to authenticated
using (public.is_admin());

drop policy if exists "Authenticated admins can update applications" on public.applications;
create policy "Authenticated admins can update applications"
on public.applications for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated admins can delete applications" on public.applications;
create policy "Authenticated admins can delete applications"
on public.applications for delete
to authenticated
using (public.is_admin());

drop policy if exists "Authenticated admins can read admin profiles" on public.admin_profiles;
create policy "Authenticated admins can read admin profiles"
on public.admin_profiles for select
to authenticated
using (public.is_admin());
