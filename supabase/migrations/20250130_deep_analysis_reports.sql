-- Deep Analysis Reports Table
-- Stores AI-generated 13-step reports and 12 practical cards
-- Migration: 20250130_deep_analysis_reports

CREATE TABLE IF NOT EXISTS public.deep_analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  assessment_id UUID NOT NULL,
  
  -- 13-step report sections (JSON)
  report_sections JSONB NOT NULL,
  
  -- 12 practical cards (JSON)
  practical_cards JSONB NOT NULL,
  
  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  model_version TEXT DEFAULT 'claude-sonnet-4-20250514',
  token_count INTEGER,
  
  UNIQUE(user_id, assessment_id)
);

-- Indexes for better query performance
CREATE INDEX idx_deep_reports_user ON public.deep_analysis_reports(user_id);
CREATE INDEX idx_deep_reports_assessment ON public.deep_analysis_reports(assessment_id);
CREATE INDEX idx_deep_reports_generated_at ON public.deep_analysis_reports(generated_at DESC);

-- Comments for documentation
COMMENT ON TABLE public.deep_analysis_reports IS 'AI-generated deep analysis reports with 13 sections and 12 practical cards';
COMMENT ON COLUMN public.deep_analysis_reports.report_sections IS '13-step integrated report sections in JSON format';
COMMENT ON COLUMN public.deep_analysis_reports.practical_cards IS '12 practical analysis cards in JSON format';
COMMENT ON COLUMN public.deep_analysis_reports.model_version IS 'Claude model version used for generation';
COMMENT ON COLUMN public.deep_analysis_reports.token_count IS 'Total tokens used for generation';

-- RLS Policies
ALTER TABLE public.deep_analysis_reports ENABLE ROW LEVEL SECURITY;

-- Users can only read their own reports
CREATE POLICY "Users can read own deep reports"
  ON public.deep_analysis_reports
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own reports
CREATE POLICY "Users can insert own deep reports"
  ON public.deep_analysis_reports
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users can update own deep reports"
  ON public.deep_analysis_reports
  FOR UPDATE
  USING (auth.uid() = user_id);

