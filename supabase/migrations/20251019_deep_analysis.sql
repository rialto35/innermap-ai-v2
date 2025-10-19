-- Add deep analysis columns to results table
-- Migration: 20251019_deep_analysis

-- Add big5_percentiles column (0~100 percentile for each Big5 factor)
ALTER TABLE public.results
ADD COLUMN IF NOT EXISTS big5_percentiles JSONB DEFAULT NULL;

-- Add mbti_ratios column (0~100 ratio for each MBTI axis)
ALTER TABLE public.results
ADD COLUMN IF NOT EXISTS mbti_ratios JSONB DEFAULT NULL;

-- Add analysis_text column (AI-generated psychological analysis)
ALTER TABLE public.results
ADD COLUMN IF NOT EXISTS analysis_text TEXT DEFAULT NULL;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_results_big5_percentiles ON public.results USING GIN (big5_percentiles);
CREATE INDEX IF NOT EXISTS idx_results_mbti_ratios ON public.results USING GIN (mbti_ratios);

-- Add comments for documentation
COMMENT ON COLUMN public.results.big5_percentiles IS 'Big5 percentile scores (0-100) for O, C, E, A, N';
COMMENT ON COLUMN public.results.mbti_ratios IS 'MBTI axis ratios (0-100) for EI, SN, TF, JP';
COMMENT ON COLUMN public.results.analysis_text IS 'AI-generated psychological analysis and growth advice';

