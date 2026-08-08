-- Xora — shutdown: messages table + RLS
-- Jalankan di Supabase SQL editor atau via `supabase db push`

create extension if not exists "pgcrypto";

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  service text,
  budget text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'done')),
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

-- Izinkan anonim mengirim pesan (insert) tanpa perlu login
create policy "Allow anonymous insert messages"
  on public.messages
  for insert
  to anon
  with check (true);

-- Hanya admin terautentikasi yang bisa membaca & mengubah status
create policy "Admin select messages"
on public.messages
for select
to authenticated
using (true);

create policy "Admin update messages"
on public.messages
for update
to authenticated
using (true);

-- Jalankan Query ini (melalui SQL Editor) untuk menjadikan user admin membaca pesan:
-- create policy "Admin read messages"
-- on public.messages
-- for select
-- to authenticated
-- using (true);
--
-- Untuk akses via dashboard aplikasi (tidak memakai RLS dengan role authenticated),
-- kamu bisa menon-aktifkan RLS via dashboard, atau membuat service-role user + proxy backend.