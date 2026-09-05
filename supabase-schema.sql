-- Ednivo GCC SAT v5 — student-only Supabase schema
create extension if not exists pgcrypto;

alter table if exists public.profiles drop constraint if exists profiles_role_check;
update public.profiles set role='student' where role='parent';
alter table if exists public.profiles add constraint profiles_role_check check (role in ('student','admin'));

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'student' check (role in ('student','admin')),
  name text, email text, phone text, country text, curriculum text, grade text,
  target_score integer check (target_score between 400 and 1600),
  test_date date, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.diagnostic_results (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  score_estimate integer, score_low integer, score_high integer, score_range text,
  math_score integer, rw_score integer, skill_map jsonb not null default '{}'::jsonb,
  answers jsonb not null default '[]'::jsonb, duration_seconds integer, created_at timestamptz not null default now()
);
create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  question_id text, subject text, skill text, difficulty integer, correct boolean, is_correct boolean,
  time_seconds integer, error_type text, confidence integer, created_at timestamptz not null default now()
);
create table if not exists public.study_plans (
  user_id uuid primary key references auth.users(id) on delete cascade,
  target_score integer, test_date date, plan jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table if not exists public.mock_results (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade,
  mock_number integer, total_score integer, math_score integer, rw_score integer,
  duration_seconds integer, skill_map jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(), name text, email text, phone text, country text,
  curriculum text, source text, score_range text, target_score integer, role text default 'student',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.diagnostic_results enable row level security;
alter table public.practice_attempts enable row level security;
alter table public.study_plans enable row level security;
alter table public.mock_results enable row level security;
alter table public.leads enable row level security;

drop policy if exists "profiles own" on public.profiles;
create policy "profiles own" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "diagnostics own read" on public.diagnostic_results;
create policy "diagnostics own read" on public.diagnostic_results for select using (auth.uid() = user_id);
drop policy if exists "diagnostics own insert" on public.diagnostic_results;
create policy "diagnostics own insert" on public.diagnostic_results for insert with check (auth.uid() = user_id);
drop policy if exists "attempts own read" on public.practice_attempts;
create policy "attempts own read" on public.practice_attempts for select using (auth.uid() = user_id);
drop policy if exists "attempts own insert" on public.practice_attempts;
create policy "attempts own insert" on public.practice_attempts for insert with check (auth.uid() = user_id);
drop policy if exists "plans own" on public.study_plans;
create policy "plans own" on public.study_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "mocks own read" on public.mock_results;
create policy "mocks own read" on public.mock_results for select using (auth.uid() = user_id);
drop policy if exists "mocks own insert" on public.mock_results;
create policy "mocks own insert" on public.mock_results for insert with check (auth.uid() = user_id);
drop policy if exists "public lead insert" on public.leads;
create policy "public lead insert" on public.leads for insert with check (true);

drop table if exists public.parent_links cascade;

create index if not exists diagnostics_user_created_idx on public.diagnostic_results(user_id, created_at desc);
create index if not exists attempts_user_created_idx on public.practice_attempts(user_id, created_at desc);
create index if not exists mocks_user_created_idx on public.mock_results(user_id, created_at desc);
