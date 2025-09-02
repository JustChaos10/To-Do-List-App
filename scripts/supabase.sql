-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Table: todos
create table if not exists public.todos (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null,
  title text not null,
  description text,
  due_date timestamptz,
  priority text check (priority in ('low','medium','high')) default 'medium',
  tags text[] default '{}',
  completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists todos_user_id_idx on public.todos(user_id);
create index if not exists todos_completed_idx on public.todos(completed);
create index if not exists todos_priority_idx on public.todos(priority);
create index if not exists todos_due_date_idx on public.todos(due_date);
create index if not exists todos_created_at_idx on public.todos(created_at);

-- RLS
alter table public.todos enable row level security;

drop policy if exists "Users can view their todos" on public.todos;
create policy "Users can view their todos" on public.todos
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their todos" on public.todos;
create policy "Users can insert their todos" on public.todos
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their todos" on public.todos;
create policy "Users can update their todos" on public.todos
  for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete their todos" on public.todos;
create policy "Users can delete their todos" on public.todos
  for delete
  using (auth.uid() = user_id);


