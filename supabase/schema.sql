-- ==============================================================
-- KINATA PORTFOLIO: SUPABASE DATABASE & STORAGE SCHEMA
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- 100% Free Tier compatible (500MB DB + 1GB Storage)
-- ==============================================================

-- 1. Create Portfolio Data Document Table
create table if not exists public.portfolio_data (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.portfolio_data enable row level security;

-- Policy: Allow anyone (public/anon) to read portfolio data
drop policy if exists "Public can read portfolio data" on public.portfolio_data;
create policy "Public can read portfolio data"
  on public.portfolio_data
  for select
  using (true);

-- Policy: Allow admin / service_role to update portfolio data
drop policy if exists "Admin full access to portfolio data" on public.portfolio_data;
create policy "Admin full access to portfolio data"
  on public.portfolio_data
  for all
  using (true)
  with check (true);

-- 2. Create Storage Bucket for Portfolio Media (Images, Videos, PDFs)
insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

-- Storage Policy: Allow public read access to all files in portfolio-media
drop policy if exists "Public Access to Portfolio Media" on storage.objects;
create policy "Public Access to Portfolio Media"
  on storage.objects
  for select
  using (bucket_id = 'portfolio-media');

-- Storage Policy: Allow upload access to portfolio-media
drop policy if exists "Upload Access to Portfolio Media" on storage.objects;
create policy "Upload Access to Portfolio Media"
  on storage.objects
  for insert
  with check (bucket_id = 'portfolio-media');

-- Storage Policy: Allow update access to portfolio-media
drop policy if exists "Update Access to Portfolio Media" on storage.objects;
create policy "Update Access to Portfolio Media"
  on storage.objects
  for update
  using (bucket_id = 'portfolio-media');

-- Storage Policy: Allow delete access to portfolio-media
drop policy if exists "Delete Access to Portfolio Media" on storage.objects;
create policy "Delete Access to Portfolio Media"
  on storage.objects
  for delete
  using (bucket_id = 'portfolio-media');
