-- ============================================
-- 익명 검사 지원: owner_token 추가 (안전 버전)
-- ============================================
-- 작성일: 2025-01-27
-- 목적: 익명 사용자의 검사 결과 소유권 검증
-- 방식: HTTPOnly 쿠키 + owner_token 매칭

-- ============================================
-- 1. owner_token 컬럼 추가 (멱등성 보장)
-- ============================================
DO $$ 
BEGIN
  -- owner_token 컬럼이 없으면 추가
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'test_assessments' 
    AND column_name = 'owner_token'
  ) THEN
    ALTER TABLE public.test_assessments
    ADD COLUMN owner_token VARCHAR(64) NULL;
    
    RAISE NOTICE '✅ Added owner_token column to test_assessments';
  ELSE
    RAISE NOTICE 'ℹ️  owner_token column already exists, skipping';
  END IF;
END $$;

-- ============================================
-- 2. 인덱스 추가 (멱등성 보장)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_test_assessments_owner_token 
ON public.test_assessments(owner_token)
WHERE owner_token IS NOT NULL;

-- ============================================
-- 3. user_id 컬럼 NULL 허용 확인
-- ============================================
DO $$ 
BEGIN
  -- user_id가 NOT NULL이면 NULL 허용으로 변경
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'test_assessments' 
    AND column_name = 'user_id'
    AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.test_assessments
    ALTER COLUMN user_id DROP NOT NULL;
    
    RAISE NOTICE '✅ Changed user_id to allow NULL (for anonymous users)';
  ELSE
    RAISE NOTICE 'ℹ️  user_id already allows NULL, skipping';
  END IF;
END $$;

-- ============================================
-- 4. RLS 정책 업데이트 (기존 정책 삭제 후 재생성)
-- ============================================

-- 기존 정책 삭제
DROP POLICY IF EXISTS "own_test_assessments" ON public.test_assessments;
DROP POLICY IF EXISTS "own_test_results" ON public.test_assessment_results;

-- 새 정책: test_assessments 읽기
-- - 로그인 사용자: 본인 데이터만
-- - 익명 사용자: owner_token이 있는 데이터만
CREATE POLICY "read_test_assessments" ON public.test_assessments
  FOR SELECT USING (
    user_id = auth.uid()
    OR (user_id IS NULL AND owner_token IS NOT NULL)
  );

-- 새 정책: test_assessments 쓰기
-- - 로그인 사용자: user_id 필수
-- - 익명 사용자: owner_token 필수
CREATE POLICY "insert_test_assessments" ON public.test_assessments
  FOR INSERT WITH CHECK (
    (user_id = auth.uid() AND user_id IS NOT NULL)
    OR (user_id IS NULL AND owner_token IS NOT NULL)
  );

-- 새 정책: test_assessments 수정
-- - 본인만 수정 가능
CREATE POLICY "update_test_assessments" ON public.test_assessments
  FOR UPDATE USING (
    user_id = auth.uid()
    OR (user_id IS NULL AND owner_token IS NOT NULL)
  );

-- 새 정책: test_assessment_results 읽기
-- - test_assessments의 소유자만 읽기 가능
CREATE POLICY "read_test_results" ON public.test_assessment_results
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.test_assessments a
      WHERE a.id = assessment_id
        AND (
          a.user_id = auth.uid()
          OR (a.user_id IS NULL AND a.owner_token IS NOT NULL)
        )
    )
  );

-- 새 정책: test_assessment_results 쓰기
-- - test_assessments의 소유자만 쓰기 가능
CREATE POLICY "insert_test_results" ON public.test_assessment_results
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.test_assessments a
      WHERE a.id = assessment_id
        AND (
          a.user_id = auth.uid()
          OR (a.user_id IS NULL AND a.owner_token IS NOT NULL)
        )
    )
  );

-- ============================================
-- 5. 코멘트 추가
-- ============================================
COMMENT ON COLUMN public.test_assessments.owner_token IS
'익명 사용자 소유권 검증용 토큰. 32바이트 hex 문자열 (64자). HTTPOnly 쿠키로 전달됨. 로그인 사용자는 NULL.';

COMMENT ON COLUMN public.test_assessments.user_id IS
'로그인 사용자 ID (UUID). 익명 사용자는 NULL. owner_token과 배타적 관계.';

-- ============================================
-- 6. 완료 로그
-- ============================================
DO $$ 
BEGIN
  RAISE NOTICE '✅ 익명 검사 지원 마이그레이션 완료';
  RAISE NOTICE '   - owner_token 컬럼 추가 (멱등성 보장)';
  RAISE NOTICE '   - user_id NULL 허용';
  RAISE NOTICE '   - RLS 정책 업데이트 (익명 + 로그인 지원)';
  RAISE NOTICE '   - 인덱스 추가 (owner_token)';
  RAISE NOTICE '';
  RAISE NOTICE '📋 다음 단계:';
  RAISE NOTICE '   1. API에서 owner_token 생성 (crypto.randomBytes(32).toString("hex"))';
  RAISE NOTICE '   2. HTTPOnly 쿠키 설정 (result_<id>_owner)';
  RAISE NOTICE '   3. 결과 조회 시 쿠키 검증';
END $$;

