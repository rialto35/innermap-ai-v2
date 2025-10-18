-- Add Inner9 and version columns to results table
-- Migration: 010_inner_nine.sql

alter table public.results
  add column if not exists inner_nine jsonb,
  add column if not exists model_version text,
  add column if not exists engine_version text;

-- Index for Inner9 queries (optional, for future filtering/aggregation)
create index if not exists idx_results_inner9 on public.results using gin (inner_nine);

-- Comment for documentation
comment on column public.results.inner_nine is 'Inner9 scores: creation, will, sensitivity, harmony, expression, insight, resilience, balance, growth (0-100 scale)';
comment on column public.results.model_version is 'Inner9 model version (e.g., inner9@1.0.0)';
comment on column public.results.engine_version is 'Analysis engine version (e.g., im-core@1.0.0)';

