-- Add owner_token for anonymous result ownership
-- 익명 사용자 결과 소유권 증명용 토큰 추가

-- test_assessments에 owner_token 컬럼 추가
ALTER TABLE public.test_assessments 
ADD COLUMN IF NOT EXISTS owner_token VARCHAR(64);

-- 인덱스 추가 (토큰으로 조회 시 성능 향상)
CREATE INDEX IF NOT EXISTS idx_test_assessments_owner_token 
ON public.test_assessments(owner_token) 
WHERE owner_token IS NOT NULL;

-- RLS 정책 업데이트: owner_token 기반 조회 허용
-- 기존 정책 삭제
DROP POLICY IF EXISTS "read_test_assessments" ON public.test_assessments;

-- 새 정책: 로그인 사용자 본인 것 OR 익명(user_id NULL)은 서버에서 토큰 검증
-- RLS는 INSERT/UPDATE/DELETE만 제한하고, SELECT는 애플리케이션 레벨에서 처리
CREATE POLICY "read_test_assessments" ON public.test_assessments
  FOR SELECT USING (
    user_id = auth.uid() OR user_id IS NULL
  );

-- INSERT 정책 유지 (누구나 가능)
-- UPDATE: 로그인 사용자만 본인 것 수정 가능
-- DELETE: 로그인 사용자만 본인 것 삭제 가능

COMMENT ON COLUMN public.test_assessments.owner_token IS 
'Anonymous user ownership token (HTTPOnly cookie). NULL for logged-in users.';

