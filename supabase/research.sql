-- EVOLVE Research v1. Execute no SQL Editor após schema.sql.
-- ATENÇÃO: exige Supabase Auth. Sem login e consentimento não haverá coleta central.
-- Sem acesso anônimo, sem service_role no cliente, sem tracking de conteúdo pessoal.
create table if not exists public.evolve_research_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.evolve_research_admins enable row level security;
revoke all on public.evolve_research_admins from anon,authenticated;
grant select on public.evolve_research_admins to authenticated;
drop policy if exists researcher_can_see_own_membership on public.evolve_research_admins;
create policy researcher_can_see_own_membership on public.evolve_research_admins
 for select to authenticated using(user_id=(select auth.uid()));

create table if not exists public.evolve_research_events (
 event_id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 event_name text not null check(event_name in (
 'onboarding_completed','goal_created','goal_updated','plan_previewed','plan_applied',
 'plan_replanned','activity_completed','activity_reopened','checkin_saved',
 'calendar_exported','calendar_connected','screen_opened','feedback_requested')),
 goal_category text check(goal_category is null or goal_category in ('health','mind','business','life','home','other')),
 segment text check(segment is null or segment in ('home','goals','agenda','checkin','insights','coach','settings','new','edit','week','month','unknown')),
 value_bucket text check(value_bucket is null or value_bucket in ('0','1','2-3','4-6','7+','1-15','16-30','31-60','61+','none')),
 created_at timestamptz not null default now()
);
create index if not exists evolve_research_user_idx on public.evolve_research_events(user_id);
create index if not exists evolve_research_when_idx on public.evolve_research_events(created_at desc);
alter table public.evolve_research_events enable row level security;
revoke all on public.evolve_research_events from anon, authenticated;
grant select,insert,update,delete on public.evolve_research_events to authenticated;
drop policy if exists researcher_update_own_events on public.evolve_research_events;
create policy researcher_update_own_events on public.evolve_research_events for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
drop policy if exists researcher_write_own_events on public.evolve_research_events;
create policy researcher_write_own_events on public.evolve_research_events for insert to authenticated with check(user_id=(select auth.uid()));
drop policy if exists researcher_read_authorized_events on public.evolve_research_events;
create policy researcher_read_authorized_events on public.evolve_research_events for select to authenticated using (
 user_id=(select auth.uid()) or exists (select 1 from public.evolve_research_admins a where a.user_id=(select auth.uid()))
);
drop policy if exists researcher_delete_own_events on public.evolve_research_events;
create policy researcher_delete_own_events on public.evolve_research_events for delete to authenticated using(user_id=(select auth.uid()));

create table if not exists public.evolve_research_feedback (
 feedback_id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 rating integer not null check(rating between 1 and 5),
 topic text not null check(topic in ('bug','usability','feature','planning','calendar','other')),
 message text not null check(length(message) between 3 and 1200),
 created_at timestamptz not null default now()
);
create index if not exists evolve_research_feedback_user_idx on public.evolve_research_feedback(user_id);
create index if not exists evolve_research_feedback_when_idx on public.evolve_research_feedback(created_at desc);
alter table public.evolve_research_feedback enable row level security;
revoke all on public.evolve_research_feedback from anon,authenticated;
grant select,insert,update,delete on public.evolve_research_feedback to authenticated;
drop policy if exists researcher_update_own_feedback on public.evolve_research_feedback;
create policy researcher_update_own_feedback on public.evolve_research_feedback for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
drop policy if exists researcher_write_own_feedback on public.evolve_research_feedback;
create policy researcher_write_own_feedback on public.evolve_research_feedback for insert to authenticated with check(user_id=(select auth.uid()));
drop policy if exists researcher_read_authorized_feedback on public.evolve_research_feedback;
create policy researcher_read_authorized_feedback on public.evolve_research_feedback for select to authenticated using (
 user_id=(select auth.uid()) or exists (select 1 from public.evolve_research_admins a where a.user_id=(select auth.uid()))
);
drop policy if exists researcher_delete_own_feedback on public.evolve_research_feedback;
create policy researcher_delete_own_feedback on public.evolve_research_feedback for delete to authenticated using(user_id=(select auth.uid()));

-- Para conceder acesso ao painel do pesquisador, substitua pelo UUID do fundador:
-- insert into public.evolve_research_admins(user_id) values ('UUID-DO-USUARIO') on conflict do nothing;
-- Operação de retenção sugerida: remover eventos antigos após 90 dias, sob política de dados publicada.