-- Developer Workspace · Supabase schema (PostgreSQL)
-- Run in Supabase SQL editor. Safe to re-run with IF NOT EXISTS.

create extension if not exists "pgcrypto";

-- Roles: guest is implicit (unauthenticated); admin via profiles.role
create type public.app_role as enum ('guest', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role public.app_role not null default 'guest',
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  category text,
  tags text[] not null default '{}',
  read_time text,
  author text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  content_md text,
  view_count bigint not null default 0,
  like_count bigint not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.post_metrics (
  post_id uuid not null references public.posts (id) on delete cascade,
  profile_id uuid references public.profiles (id) on delete cascade,
  visitor_key text not null,
  liked boolean not null default false,
  viewed_at timestamptz not null default now(),
  primary key (post_id, visitor_key)
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  title text not null,
  content_md text not null default '',
  tags text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text not null default 'planning' check (status in ('planning', 'building', 'shipped', 'archived')),
  progress int not null default 0 check (progress between 0 and 100),
  repo_url text,
  demo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_todos (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title text not null,
  done boolean not null default false,
  sort_order int not null default 0
);

create table if not exists public.learning_items (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  category text not null,
  name text not null,
  mastered boolean not null default false,
  notes text,
  unique (profile_id, category, name)
);

create table if not exists public.study_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  hours numeric(4, 1) not null default 0,
  studied_on date not null default current_date
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  name text not null,
  category text,
  level int not null default 0 check (level between 0 and 100),
  color text
);

create table if not exists public.growth_events (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  type text not null check (type in ('milestone', 'project', 'learning', 'writing')),
  title text not null,
  description text,
  tags text[] not null default '{}',
  event_date date not null default current_date
);

create table if not exists public.prompts (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  title text not null,
  category text not null,
  content text not null,
  use_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.prompt_favorites (
  profile_id uuid not null references public.profiles (id) on delete cascade,
  prompt_id uuid not null references public.prompts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (profile_id, prompt_id)
);

create table if not exists public.ai_models (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider text not null,
  monthly_limit int not null default 0,
  monthly_cost numeric(10, 2) not null default 0,
  status text not null default 'active',
  notes text
);

create table if not exists public.ai_agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  description text,
  model_hint text,
  status text not null default 'ready'
);

create table if not exists public.daily_tasks (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles (id) on delete cascade,
  title text not null,
  tag text,
  done boolean not null default false,
  task_date date not null default current_date
);

-- Indexes
create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);
create index if not exists notes_profile_idx on public.notes (profile_id, updated_at desc);
create index if not exists study_records_profile_date_idx on public.study_records (profile_id, studied_on desc);
create index if not exists daily_tasks_profile_date_idx on public.daily_tasks (profile_id, task_date desc);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_updated_at on public.posts;
create trigger posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

drop trigger if exists notes_updated_at on public.notes;
create trigger notes_updated_at before update on public.notes
  for each row execute function public.set_updated_at();

-- RLS
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.post_metrics enable row level security;
alter table public.notes enable row level security;
alter table public.projects enable row level security;
alter table public.project_todos enable row level security;
alter table public.learning_items enable row level security;
alter table public.study_records enable row level security;
alter table public.skills enable row level security;
alter table public.growth_events enable row level security;
alter table public.prompts enable row level security;
alter table public.prompt_favorites enable row level security;
alter table public.ai_models enable row level security;
alter table public.ai_agents enable row level security;
alter table public.daily_tasks enable row level security;

-- Helper: is_admin()
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

-- posts: public read published; admin write
create policy "posts_select_published" on public.posts
  for select using (status = 'published' or public.is_admin());
create policy "posts_write_admin" on public.posts
  for all using (public.is_admin()) with check (public.is_admin());

-- post_metrics: anyone can insert view/like with visitor_key; read own
create policy "post_metrics_insert_any" on public.post_metrics
  for insert with check (true);
create policy "post_metrics_select_any" on public.post_metrics
  for select using (true);
create policy "post_metrics_update_visitor" on public.post_metrics
  for update using (true);

-- Private data: owner only (admin can manage)
create policy "notes_owner" on public.notes
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

create policy "learning_owner" on public.learning_items
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

create policy "study_records_owner" on public.study_records
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

create policy "skills_owner" on public.skills
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

create policy "growth_events_owner" on public.growth_events
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

create policy "prompts_owner" on public.prompts
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

create policy "prompt_favorites_owner" on public.prompt_favorites
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

create policy "daily_tasks_owner" on public.daily_tasks
  for all using (auth.uid() = profile_id or public.is_admin())
  with check (auth.uid() = profile_id or public.is_admin());

-- Public read / admin write catalogs
create policy "projects_read" on public.projects for select using (true);
create policy "projects_write_admin" on public.projects
  for all using (public.is_admin()) with check (public.is_admin());

create policy "project_todos_read" on public.project_todos for select using (true);
create policy "project_todos_write_admin" on public.project_todos
  for all using (public.is_admin()) with check (public.is_admin());

create policy "ai_models_read" on public.ai_models for select using (true);
create policy "ai_models_write_admin" on public.ai_models
  for all using (public.is_admin()) with check (public.is_admin());

create policy "ai_agents_read" on public.ai_agents for select using (true);
create policy "ai_agents_write_admin" on public.ai_agents
  for all using (public.is_admin()) with check (public.is_admin());
