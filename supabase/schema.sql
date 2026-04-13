-- Praxis Platform — Complete Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query)

-- ─────────────────────────────────────────
-- USERS & PROFILES
-- ─────────────────────────────────────────

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  career_path text default 'data_engineering',
  -- Career paths: data_engineering | product_management | project_management |
  --   digital_marketing | financial_analysis | ux_design | sales_bd |
  --   hr_people | operations | customer_success
  current_level integer default 1,       -- 1=Junior Intern … 5=Senior Manager
  experience_points integer default 0,
  subscription_tier text default 'free', -- free | premium | pro
  subscription_id text,                  -- Stripe subscription ID
  organisation_id uuid,                  -- current virtual org
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ─────────────────────────────────────────
-- VIRTUAL ORGANISATIONS
-- ─────────────────────────────────────────

create table public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,  -- startup | corporate | agency | bank | public_sector
  description text,
  industry text,
  size text,           -- small | medium | large
  culture text,        -- demanding | balanced | fast_paced | structured
  logo_initials text,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Seed the 5 launch organisations
insert into public.organisations (name, type, description, industry, size, culture, logo_initials) values
  ('Nexus Digital', 'startup', 'Fast-growing B2B SaaS company building analytics tools', 'Technology', 'small', 'fast_paced', 'ND'),
  ('GlobalBank Advisory', 'bank', 'Mid-tier investment bank and financial advisory firm', 'Finance', 'large', 'demanding', 'GB'),
  ('Apex Creative Agency', 'agency', 'Full-service marketing and digital agency', 'Marketing', 'medium', 'balanced', 'AC'),
  ('Meridian FMCG', 'corporate', 'Global consumer goods manufacturer', 'FMCG', 'large', 'structured', 'MF'),
  ('CivicWorks Trust', 'public_sector', 'Public sector digital transformation body', 'Government', 'medium', 'structured', 'CW');

-- ─────────────────────────────────────────
-- SIMULATION SESSIONS
-- ─────────────────────────────────────────

create table public.simulation_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  organisation_id uuid references public.organisations(id),
  career_path text not null,
  sim_day integer default 1,       -- Which day of the simulation (1-5 per level)
  clock_in_time timestamptz,
  clock_out_time timestamptz,
  total_score integer default 0,
  xp_earned integer default 0,
  status text default 'active',    -- active | completed | abandoned
  created_at timestamptz default now()
);

alter table public.simulation_sessions enable row level security;
create policy "Users access own sessions" on public.simulation_sessions
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- TASKS
-- ─────────────────────────────────────────

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.simulation_sessions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  type text not null,       -- email_reply | document | decision | report | meeting | standup
  title text not null,
  description text,
  urgency text default 'normal',  -- urgent | high | normal | low
  assigned_at timestamptz default now(),
  due_at timestamptz,
  completed_at timestamptz,
  user_response text,        -- what the user typed/chose
  decision_choice text,      -- option chosen (A/B/C)
  decision_quality text,     -- good | medium | bad
  score integer,             -- points earned (0-100)
  xp_earned integer default 0,
  ai_feedback text,          -- AI-generated feedback on the response
  created_at timestamptz default now()
);

alter table public.tasks enable row level security;
create policy "Users access own tasks" on public.tasks
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- KPI METRICS (daily snapshots)
-- ─────────────────────────────────────────

create table public.kpi_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  session_id uuid references public.simulation_sessions(id),
  recorded_at timestamptz default now(),
  -- Core KPIs (0-100)
  reliability_score integer default 0,
  responsiveness_score integer default 0,
  quality_score integer default 0,
  communication_score integer default 0,
  scope_control_score integer default 0,
  -- Computed overall
  performance_index integer default 0,
  -- Raw counters for the day
  tasks_total integer default 0,
  tasks_on_time integer default 0,
  decisions_made integer default 0,
  decisions_good integer default 0,
  avg_response_minutes integer default 0
);

alter table public.kpi_metrics enable row level security;
create policy "Users access own KPIs" on public.kpi_metrics
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- AI MESSAGES (inbox simulation)
-- ─────────────────────────────────────────

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.simulation_sessions(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  sender_persona text not null,  -- boss | marcus | sarah | client | hr | peer
  sender_name text not null,
  sender_role text,
  subject text,
  body text not null,
  is_read boolean default false,
  urgency text default 'normal',
  requires_response boolean default false,
  response_deadline_minutes integer,  -- minutes after send before KPI impact
  trigger_type text,   -- scheduled | consequence | reaction
  created_at timestamptz default now()
);

alter table public.messages enable row level security;
create policy "Users access own messages" on public.messages
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- PORTFOLIO (verifiable experience record)
-- ─────────────────────────────────────────

create table public.portfolio_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  career_path text not null,
  level_achieved integer not null,
  organisation_name text,
  start_date timestamptz,
  end_date timestamptz,
  final_pi_score integer,
  key_achievements text[],
  certificate_id text unique,
  is_public boolean default true,
  created_at timestamptz default now()
);

alter table public.portfolio_entries enable row level security;
create policy "Users access own portfolio" on public.portfolio_entries
  for all using (auth.uid() = user_id);
create policy "Public portfolio entries readable by all"
  on public.portfolio_entries for select
  using (is_public = true);

-- ─────────────────────────────────────────
-- JOB BOARD (multi-org mobility)
-- ─────────────────────────────────────────

create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id),
  career_path text not null,
  level_required integer not null,
  title text not null,
  description text,
  min_pi_score integer default 70,
  is_open boolean default true,
  posted_at timestamptz default now(),
  closes_at timestamptz
);

create table public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.job_postings(id),
  user_id uuid references public.profiles(id) on delete cascade,
  status text default 'pending',  -- pending | accepted | rejected
  applied_at timestamptz default now()
);

alter table public.job_applications enable row level security;
create policy "Users access own applications" on public.job_applications
  for all using (auth.uid() = user_id);

-- ─────────────────────────────────────────
-- HELPER: auto-update profiles.updated_at
-- ─────────────────────────────────────────

create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function update_updated_at();

-- ─────────────────────────────────────────
-- HELPER: auto-create profile on signup
-- ─────────────────────────────────────────

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
