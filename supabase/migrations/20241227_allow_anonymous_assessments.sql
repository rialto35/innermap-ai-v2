-- Allow anonymous (non-logged-in) users to create assessments
-- 비로그인 사용자도 검사를 수행할 수 있도록 RLS 정책 수정

-- test_assessments: 비로그인 사용자 INSERT 허용
DROP POLICY IF EXISTS "own_test_assessments" ON public.test_assessments;

-- SELECT: 본인 것만 조회 (로그인 사용자) 또는 user_id가 NULL인 경우 (비로그인)
CREATE POLICY "read_test_assessments" ON public.test_assessments
  FOR SELECT USING (
    user_id = auth.uid() OR user_id IS NULL
  );

-- INSERT: 누구나 가능 (user_id는 NULL 또는 본인 UUID만 허용)
CREATE POLICY "insert_test_assessments" ON public.test_assessments
  FOR INSERT WITH CHECK (
    user_id IS NULL OR user_id = auth.uid()
  );

-- UPDATE/DELETE: 본인 것만 (로그인 사용자만)
CREATE POLICY "update_test_assessments" ON public.test_assessments
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "delete_test_assessments" ON public.test_assessments
  FOR DELETE USING (user_id = auth.uid());

-- test_assessment_results: 비로그인 사용자 조회 허용
DROP POLICY IF EXISTS "own_test_results" ON public.test_assessment_results;

-- SELECT: assessment의 user_id가 본인이거나 NULL인 경우
CREATE POLICY "read_test_results" ON public.test_assessment_results
  FOR SELECT USING (
    EXISTS(
      SELECT 1 FROM public.test_assessments a 
      WHERE a.id = assessment_id 
        AND (a.user_id = auth.uid() OR a.user_id IS NULL)
    )
  );

-- INSERT: 누구나 가능 (assessment_id가 유효하면)
CREATE POLICY "insert_test_results" ON public.test_assessment_results
  FOR INSERT WITH CHECK (
    EXISTS(
      SELECT 1 FROM public.test_assessments a 
      WHERE a.id = assessment_id
        AND (a.user_id IS NULL OR a.user_id = auth.uid())
    )
  );

-- user_profiles: 로그인 사용자만 (기존 정책 유지)
-- 비로그인 사용자는 프로필 저장 안 함

