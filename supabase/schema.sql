-- EVOLVE Beta — execute no SQL Editor de seu projeto Supabase.
-- Cada usuário autenticado só pode consultar/editar seu próprio espaço.
create table if not exists public.evolve_workspaces (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint workspace_size_guard check (pg_column_size(data)<2000000)
);

alter table public.evolve_workspaces enable row level security;

create policy "read_own_workspace" on public.evolve_workspaces
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "insert_own_workspace" on public.evolve_workspaces
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "update_own_workspace" on public.evolve_workspaces
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "delete_own_workspace" on public.evolve_workspaces
  for delete to authenticated using ((select auth.uid()) = user_id);

create or replace function public.evolve_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
drop trigger if exists trg_evolve_updated on public.evolve_workspaces;
create trigger trg_evolve_updated before update on public.evolve_workspaces
  for each row execute function public.evolve_updated_at();

-- Não dê acesso anônimo a dados privados. Não use service_role no cliente.
