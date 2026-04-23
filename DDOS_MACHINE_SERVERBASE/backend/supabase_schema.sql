-- ============================================================
-- DDoS Protection System — Supabase Schema
-- Run this in your Supabase project's SQL Editor
-- ============================================================

-- 1. Request log
create table if not exists request_log (
  id           bigserial primary key,
  created_at   timestamptz default now(),
  ip           text        not null,
  path         text        not null,
  method       text        default 'GET',
  blocked      boolean     default false,
  status_code  int         default 200
);

-- 2. Click events from EduNexus
create table if not exists click_events (
  id           bigserial primary key,
  created_at   timestamptz default now(),
  page         text,
  element      text,
  event_type   text        default 'click',
  from_ip      text,
  meta         text        -- JSON string for extra fields
);

-- 3. Banned IPs
create table if not exists banned_ips (
  ip           text        primary key,
  banned_at    timestamptz default now(),
  banned_until timestamptz,
  reason       text        default 'auto-ban'
);

-- ── RLS (allow public read + insert) ──────────────────────────────────────
alter table request_log  enable row level security;
alter table click_events enable row level security;
alter table banned_ips   enable row level security;

create policy "public_read_request_log"  on request_log  for select using (true);
create policy "public_insert_request_log" on request_log for insert with check (true);

create policy "public_read_click_events"  on click_events  for select using (true);
create policy "public_insert_click_events" on click_events for insert with check (true);

create policy "public_read_banned_ips"   on banned_ips   for select using (true);
create policy "public_insert_banned_ips" on banned_ips   for insert with check (true);
create policy "public_update_banned_ips" on banned_ips   for update using (true);
create policy "public_delete_banned_ips" on banned_ips   for delete using (true);

-- ── Enable Realtime ───────────────────────────────────────────────────────
alter publication supabase_realtime add table request_log;
alter publication supabase_realtime add table click_events;
alter publication supabase_realtime add table banned_ips;

-- ── Handy views for dashboard ─────────────────────────────────────────────
create or replace view traffic_summary as
select
  count(*)                                   as total_requests,
  count(*) filter (where blocked)            as blocked_requests,
  count(*) filter (where not blocked)        as allowed_requests,
  count(distinct ip)                         as unique_ips
from request_log;

create or replace view ip_threat_summary as
select
  ip,
  count(*)                           as total,
  count(*) filter (where blocked)    as blocked_count,
  count(*) filter (where not blocked) as allowed_count
from request_log
group by ip
order by total desc;

create or replace view click_summary as
select
  page,
  element,
  count(*) as click_count
from click_events
group by page, element
order by click_count desc;
