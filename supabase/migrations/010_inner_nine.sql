-- Add Inner9 and version columns to results table
-- Migration: 010_inner_nine.sql

alter table public.results
  add column if not exists inner_nine jsonb,
  add column if not exists model_version text,
  add column if not exists engine_version text,
  add column if not exists hero_code text,
  add column if not exists color_natal integer,
  add column if not exists color_growth integer,
  add column if not exists narrative text;

-- Index for Inner9 queries (optional, for future filtering/aggregation)
create index if not exists idx_results_inner9 on public.results using gin (inner_nine);
create index if not exists idx_results_hero_code on public.results (hero_code);

-- Comment for documentation
comment on column public.results.inner_nine is 'Inner9 scores: creation, will, sensitivity, harmony, expression, insight, resilience, balance, growth (0-100 scale)';
comment on column public.results.model_version is 'Inner9 model version (e.g., inner9@1.0.0)';
comment on column public.results.engine_version is 'Analysis engine version (e.g., im-core@1.0.0)';
comment on column public.results.hero_code is 'Matched hero code from hero_catalog';
comment on column public.results.color_natal is 'Natal color stone ID from color_catalog';
comment on column public.results.color_growth is 'Growth color stone ID from color_catalog';
comment on column public.results.narrative is 'Generated narrative summary';

