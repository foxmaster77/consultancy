-- Run in the Supabase SQL editor. The API uses the service role key and does not
-- expose this table to the browser.
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  stream text,
  board text,
  college text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;
