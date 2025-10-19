-- Add inner9_scores column to results table
ALTER TABLE public.results
  ADD COLUMN IF NOT EXISTS inner9_scores JSONB;



