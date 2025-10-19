-- Add inner9_scores column to results table
ALTER TABLE public.results
  ADD COLUMN IF NOT EXISTS inner9_scores JSONB;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_results_user_created
  ON public.results(user_id, created_at DESC);

-- Add GIN index for inner9_scores JSONB queries
CREATE INDEX IF NOT EXISTS idx_results_inner9_scores 
  ON public.results USING GIN (inner9_scores);

-- Add comment for documentation
COMMENT ON COLUMN public.results.inner9_scores IS 'Inner9 scores: creation, will, sensitivity, harmony, expression, insight, resilience, balance, growth (0-100 scale)';



