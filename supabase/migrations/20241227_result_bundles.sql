-- Result Bundle Schema (single source of truth by result_id)
-- Creates result_views, result_coaching, result_horoscope, and user_latest_result MV

-- ===============================
-- Result Views (dashboard cache)
-- ===============================
CREATE TABLE IF NOT EXISTS public.result_views (
  result_id UUID PRIMARY KEY REFERENCES public.test_assessments(id) ON DELETE CASCADE,
  level INT,
  xp_current INT,
  xp_max INT,
  strengths TEXT[],
  growth_areas TEXT[],
  quests JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Result Coaching (daily/weekly coaching cache)
-- ===============================
CREATE TABLE IF NOT EXISTS public.result_coaching (
  result_id UUID PRIMARY KEY REFERENCES public.test_assessments(id) ON DELETE CASCADE,
  daily_coaching JSONB,
  weekly_plan JSONB,
  narrative JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Result Horoscope (daily fortune-style coaching)
-- ===============================
CREATE TABLE IF NOT EXISTS public.result_horoscope (
  result_id UUID PRIMARY KEY REFERENCES public.test_assessments(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  fortune JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ===============================
-- Updated_at triggers
-- ===============================
CREATE TRIGGER result_views_updated_at
  BEFORE UPDATE ON public.result_views
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER result_coaching_updated_at
  BEFORE UPDATE ON public.result_coaching
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===============================
-- Materialized view for latest result per user
-- ===============================
DROP MATERIALIZED VIEW IF EXISTS public.user_latest_result;
CREATE MATERIALIZED VIEW public.user_latest_result AS
SELECT
  ta.user_id,
  MAX(ta.completed_at) AS latest_at,
  (ARRAY_AGG(ta.id ORDER BY ta.completed_at DESC))[1] AS result_id
FROM public.test_assessments ta
GROUP BY ta.user_id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_user_latest_result_user_id
  ON public.user_latest_result(user_id);

-- ===============================
-- Enable RLS and policies
-- ===============================
ALTER TABLE public.result_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_coaching ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.result_horoscope ENABLE ROW LEVEL SECURITY;

-- Users can access their cached dashboard/coaching/horoscope by result ownership
CREATE POLICY result_views_owner_policy ON public.result_views
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.test_assessments ta
      WHERE ta.id = result_id AND (ta.user_id = auth.uid() OR ta.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_assessments ta
      WHERE ta.id = result_id AND (ta.user_id = auth.uid() OR ta.user_id IS NULL)
    )
  );

CREATE POLICY result_coaching_owner_policy ON public.result_coaching
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.test_assessments ta
      WHERE ta.id = result_id AND (ta.user_id = auth.uid() OR ta.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_assessments ta
      WHERE ta.id = result_id AND (ta.user_id = auth.uid() OR ta.user_id IS NULL)
    )
  );

CREATE POLICY result_horoscope_owner_policy ON public.result_horoscope
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.test_assessments ta
      WHERE ta.id = result_id AND (ta.user_id = auth.uid() OR ta.user_id IS NULL)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.test_assessments ta
      WHERE ta.id = result_id AND (ta.user_id = auth.uid() OR ta.user_id IS NULL)
    )
  );
