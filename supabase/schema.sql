-- ============================================================================
-- Newcomer Training Schedule — Phase 2 schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query)
-- ============================================================================

-- ---------- TEMPLATES (reusable content, no dates) ----------

create table if not exists templates (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  description       text,
  skip_weekends     boolean not null default true,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists template_days (
  id                uuid primary key default gen_random_uuid(),
  template_id       uuid not null references templates(id) on delete cascade,
  day_number        int not null,
  title             text not null,
  description       text,
  sort_order        int not null default 0
);
create index if not exists idx_template_days_template_id on template_days(template_id);

create table if not exists template_activities (
  id                 uuid primary key default gen_random_uuid(),
  template_day_id    uuid not null references template_days(id) on delete cascade,
  type               text not null check (type in ('training','learning_hub','task','break')),
  title              text not null,
  description        text,
  trainer            text,
  start_time         time,
  end_time           time,
  estimated_minutes  int,
  url                text,
  location           text,
  sort_order         int not null default 0
);
create index if not exists idx_template_activities_day_id on template_activities(template_day_id);

-- ---------- SCHEDULES (a template instantiated with real dates) ----------

create table if not exists schedules (
  id                uuid primary key default gen_random_uuid(),
  template_id       uuid references templates(id) on delete set null,
  name              text not null,
  slug              text not null unique,
  start_date        date,
  skip_weekends     boolean not null default true,
  status            text not null default 'draft' check (status in ('draft','published','archived')),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists training_days (
  id                uuid primary key default gen_random_uuid(),
  schedule_id       uuid not null references schedules(id) on delete cascade,
  day_number        int not null,
  title             text not null,
  date              date not null,
  description       text,
  sort_order        int not null default 0
);
create index if not exists idx_training_days_schedule_id on training_days(schedule_id);

create table if not exists activities (
  id                 uuid primary key default gen_random_uuid(),
  training_day_id    uuid not null references training_days(id) on delete cascade,
  type               text not null check (type in ('training','learning_hub','task','break')),
  title              text not null,
  description        text,
  trainer            text,
  start_time         time,
  end_time           time,
  estimated_minutes  int,
  url                text,
  location           text,
  sort_order         int not null default 0
);
create index if not exists idx_activities_training_day_id on activities(training_day_id);

-- ---------- updated_at triggers ----------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_templates_updated_at on templates;
create trigger trg_templates_updated_at
  before update on templates
  for each row execute function set_updated_at();

drop trigger if exists trg_schedules_updated_at on schedules;
create trigger trg_schedules_updated_at
  before update on schedules
  for each row execute function set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
-- Public (anon) role can only ever read PUBLISHED schedule content.
-- Nothing about templates or drafts is exposed publicly.
-- Admin write access (authenticated + role check) is added in Phase 3
-- alongside Supabase Auth — until then, writes only happen via the
-- Supabase Dashboard or service-role scripts, never from the browser.

alter table templates enable row level security;
alter table template_days enable row level security;
alter table template_activities enable row level security;
alter table schedules enable row level security;
alter table training_days enable row level security;
alter table activities enable row level security;

-- Public read: only published schedules, and only their own days/activities.

drop policy if exists "public read published schedules" on schedules;
create policy "public read published schedules"
  on schedules for select
  to anon, authenticated
  using (status = 'published');

drop policy if exists "public read days of published schedules" on training_days;
create policy "public read days of published schedules"
  on training_days for select
  to anon, authenticated
  using (
    exists (
      select 1 from schedules
      where schedules.id = training_days.schedule_id
      and schedules.status = 'published'
    )
  );

drop policy if exists "public read activities of published schedules" on activities;
create policy "public read activities of published schedules"
  on activities for select
  to anon, authenticated
  using (
    exists (
      select 1 from training_days
      join schedules on schedules.id = training_days.schedule_id
      where training_days.id = activities.training_day_id
      and schedules.status = 'published'
    )
  );

-- Templates, template_days, template_activities: no public policies at all.
-- (RLS is enabled with zero policies, so anon/authenticated get nothing —
-- correct for now since only admins should ever see template content.)
