-- InnerMap AI v2 - 테이블 정리 및 통합
-- 기존 중복 테이블들을 최신 구조로 통합
-- 생성일: 2025-01-27

-- =====================================================
-- 1. 기존 데이터 백업 (안전장치)
-- =====================================================

-- test_results 데이터를 test_assessment_results로 마이그레이션
INSERT INTO test_assessments (id, user_id, engine_version, raw_answers, completed_at, created_at)
SELECT 
  tr.id,
  tr.user_id,
  'legacy-v1.0.0' as engine_version,
  tr.raw_scores as raw_answers,
  tr.created_at as completed_at,
  tr.created_at
FROM test_results tr
WHERE NOT EXISTS (
  SELECT 1 FROM test_assessments ta WHERE ta.id = tr.id
);

-- test_assessment_results에 결과 데이터 삽입
INSERT INTO test_assessment_results (
  assessment_id,
  mbti,
  big5,
  keywords,
  inner9,
  world,
  confidence,
  created_at
)
SELECT 
  tr.id as assessment_id,
  tr.mbti_type as mbti,
  jsonb_build_object(
    'O', COALESCE(tr.big5_openness, 50) / 100.0,
    'C', COALESCE(tr.big5_conscientiousness, 50) / 100.0,
    'E', COALESCE(tr.big5_extraversion, 50) / 100.0,
    'A', COALESCE(tr.big5_agreeableness, 50) / 100.0,
    'N', COALESCE(tr.big5_neuroticism, 50) / 100.0
  ) as big5,
  ARRAY[]::text[] as keywords, -- 빈 배열로 초기화
  jsonb_build_object() as inner9, -- 빈 객체로 초기화
  jsonb_build_object(
    'hero', tr.hero_name,
    'tribe', tr.tribe_name,
    'stone', tr.stone_name
  ) as world,
  0.8 as confidence, -- 기본 신뢰도
  tr.created_at
FROM test_results tr
WHERE NOT EXISTS (
  SELECT 1 FROM test_assessment_results tar WHERE tar.assessment_id = tr.id
);

-- =====================================================
-- 2. 중복 테이블 제거 (안전하게)
-- =====================================================

-- 기존 테이블들의 외래키 제약조건 먼저 제거
ALTER TABLE ai_reports DROP CONSTRAINT IF EXISTS ai_reports_test_result_id_fkey;

-- 중복 테이블들 제거
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS results CASCADE;

-- test_results는 나중에 제거 (기존 코드 호환성 위해)
-- DROP TABLE IF EXISTS test_results CASCADE;

-- =====================================================
-- 3. 인덱스 최적화
-- =====================================================

-- test_assessments 인덱스
CREATE INDEX IF NOT EXISTS idx_test_assessments_user_id_created 
  ON test_assessments(user_id, created_at DESC);

-- test_assessment_results 인덱스  
CREATE INDEX IF NOT EXISTS idx_test_assessment_results_mbti 
  ON test_assessment_results(mbti);

CREATE INDEX IF NOT EXISTS idx_test_assessment_results_created 
  ON test_assessment_results(created_at DESC);

-- =====================================================
-- 4. RLS 정책 업데이트
-- =====================================================

-- test_assessments RLS
ALTER TABLE test_assessments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own assessments" ON test_assessments;
CREATE POLICY "Users can view own assessments" ON test_assessments
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own assessments" ON test_assessments;
CREATE POLICY "Users can insert own assessments" ON test_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- test_assessment_results RLS
ALTER TABLE test_assessment_results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own assessment results" ON test_assessment_results;
CREATE POLICY "Users can view own assessment results" ON test_assessment_results
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM test_assessments ta 
      WHERE ta.id = test_assessment_results.assessment_id 
      AND ta.user_id = auth.uid()
    )
  );

-- =====================================================
-- 5. 뷰 생성 (기존 코드 호환성)
-- =====================================================

-- test_results 뷰 (기존 코드 호환성)
CREATE OR REPLACE VIEW test_results_v AS
SELECT 
  ta.id,
  ta.user_id,
  'imcore' as test_type,
  COALESCE(up.email, 'user') as name,
  up.birthdate as birth_date,
  COALESCE(up.gender, 'male') as gender_preference,
  tar.mbti as mbti_type,
  jsonb_build_object() as mbti_confidence,
  'r5' as reti_top1, -- 기본값
  NULL as reti_top2,
  jsonb_build_object() as reti_scores,
  COALESCE((tar.big5->>'O')::numeric * 100, 50)::integer as big5_openness,
  COALESCE((tar.big5->>'C')::numeric * 100, 50)::integer as big5_conscientiousness,
  COALESCE((tar.big5->>'E')::numeric * 100, 50)::integer as big5_extraversion,
  COALESCE((tar.big5->>'A')::numeric * 100, 50)::integer as big5_agreeableness,
  COALESCE((tar.big5->>'N')::numeric * 100, 50)::integer as big5_neuroticism,
  50 as growth_innate,
  50 as growth_acquired,
  50 as growth_conscious,
  50 as growth_unconscious,
  50 as growth_growth,
  50 as growth_stability,
  50 as growth_harmony,
  50 as growth_individual,
  COALESCE(tar.world->>'hero', 'unknown') as hero_id,
  COALESCE(tar.world->>'hero', 'Unknown Hero') as hero_name,
  tar.world->>'tribe' as tribe_name,
  tar.world->>'tribe' as tribe_name_en,
  tar.world->>'stone' as stone_name,
  ta.raw_answers as raw_scores,
  ta.created_at,
  ta.created_at as updated_at
FROM test_assessments ta
LEFT JOIN test_assessment_results tar ON ta.id = tar.assessment_id
LEFT JOIN user_profiles up ON ta.user_id = up.user_id;

-- =====================================================
-- 6. 완료 로그
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '테이블 정리 완료:';
  RAISE NOTICE '- assessments, results 테이블 제거됨';
  RAISE NOTICE '- test_assessments, test_assessment_results로 통합됨';
  RAISE NOTICE '- test_results_v 뷰 생성됨 (기존 코드 호환성)';
  RAISE NOTICE '- RLS 정책 업데이트됨';
END $$;

