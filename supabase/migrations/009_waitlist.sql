-- Waitlist table for premium early-access
create table if not exists public.waitlist (
  id bigserial primary key,
  email text not null,
  user_id uuid null,
  source_page text null,
  referer text null,
  notes text null,
  created_at timestamptz not null default now(),
  unique(email)
);

create index if not exists idx_waitlist_created_at on public.waitlist (created_at desc);
create index if not exists idx_waitlist_source_page on public.waitlist (source_page);

alter table public.waitlist enable row level security;

-- Policy: Anyone can insert their own waitlist entry
create policy "Anyone can insert waitlist entry" on public.waitlist
  for insert with check (true);

-- Policy: Admins can view all waitlist entries (requires custom role or service key)
create policy "Service role can view waitlist" on public.waitlist
  for select using (auth.jwt() ->> 'role' = 'service_role');

