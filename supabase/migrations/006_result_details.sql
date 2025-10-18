-- result_details: Stores narratives/coaching/growth/charts per result
-- Idempotent creation

create table if not exists public.result_details (
  result_id uuid primary key references public.test_results(id) on delete cascade,
  narrative_short text,
  narrative_long text,
  coaching_blocks jsonb,
  growth_vector jsonb,
  charts jsonb,
  pdf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Helpful indexes (idempotent)
create index if not exists idx_result_details_created_at on public.result_details (created_at desc);
create index if not exists idx_result_details_coaching_gin on public.result_details using gin (coaching_blocks);


