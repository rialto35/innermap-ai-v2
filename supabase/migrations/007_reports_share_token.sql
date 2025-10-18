-- Add share_token to reports for secure sharing links
-- Idempotent migration

alter table public.reports add column if not exists share_token text unique;

-- Optional: generated timestamp for share token issuance
alter table public.reports add column if not exists share_issued_at timestamptz;

-- Index for quick lookups by token
create index if not exists idx_reports_share_token on public.reports(share_token);


