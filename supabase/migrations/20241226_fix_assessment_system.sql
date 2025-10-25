-- Assessment System Schema (Fixed)
-- 검사 시스템: 프로필, 검사, 결과, 이메일 큐, 구독
-- 기존 results 테이블과의 충돌 방지

-- user_profiles
CREATE TABLE IF NOT EXISTS public.user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  gender TEXT CHECK (gender IN ('male','female','other')) DEFAULT NULL,
  birthdate DATE,
  email TEXT,
  consent_required_at TIMESTAMPTZ,
  consent_marketing_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- assessments (기존 테이블과 이름 충돌 방지)
CREATE TABLE IF NOT EXISTS public.test_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  engine_version TEXT NOT NULL,
  raw_answers JSONB NOT NULL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- assessment_results (기존 results와 구분)
CREATE TABLE IF NOT EXISTS public.test_assessment_results (
  assessment_id UUID PRIMARY KEY REFERENCES public.test_assessments(id) ON DELETE CASCADE,
  mbti TEXT,
  big5 JSONB,                -- {O: number, C: number, E: number, A: number, N: number}
  keywords TEXT[],           -- top5
  inner9 JSONB,              -- 잠금용
  world JSONB,               -- {continent: text, tribe: text, stone: text}
  confidence NUMERIC,        -- 0~1
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- email_jobs
CREATE TABLE IF NOT EXISTS public.email_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.test_assessments(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  status TEXT CHECK (status IN ('queued','sent','failed')) DEFAULT 'queued',
  retry_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- plan_subscriptions (미도입 단계: 스키마만)
CREATE TABLE IF NOT EXISTS public.plan_subscriptions (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT CHECK (plan IN ('free','premium','pro')) DEFAULT 'free',
  status TEXT CHECK (status IN ('active','canceled','past_due')) DEFAULT 'active',
  renew_at TIMESTAMPTZ
);

-- RLS 활성화
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_assessment_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (기존 정책이 있으면 삭제 후 재생성)
DROP POLICY IF EXISTS "own_profile" ON public.user_profiles;
CREATE POLICY "own_profile" ON public.user_profiles
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "own_test_assessments" ON public.test_assessments;
CREATE POLICY "own_test_assessments" ON public.test_assessments
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "own_test_results" ON public.test_assessment_results;
CREATE POLICY "own_test_results" ON public.test_assessment_results
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.test_assessments a 
      WHERE a.id = assessment_id AND a.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "own_emails" ON public.email_jobs;
CREATE POLICY "own_emails" ON public.email_jobs
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "own_sub" ON public.plan_subscriptions;
CREATE POLICY "own_sub" ON public.plan_subscriptions
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_test_assessments_user_id ON public.test_assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_test_assessments_completed_at ON public.test_assessments(completed_at);
CREATE INDEX IF NOT EXISTS idx_email_jobs_status ON public.email_jobs(status);
CREATE INDEX IF NOT EXISTS idx_email_jobs_user_id ON public.email_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);

