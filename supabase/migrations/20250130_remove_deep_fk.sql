-- Remove FK constraints from deep_analysis_reports
ALTER TABLE public.deep_analysis_reports DROP CONSTRAINT IF EXISTS deep_analysis_reports_user_id_fkey;
ALTER TABLE public.deep_analysis_reports DROP CONSTRAINT IF EXISTS deep_analysis_reports_assessment_id_fkey;
