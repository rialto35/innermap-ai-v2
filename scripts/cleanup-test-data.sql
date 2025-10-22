-- =====================================================
-- InnerMap AI v2 - Test Data Cleanup Script
-- =====================================================
-- 목적: 테스트 계정 및 관련 데이터 정리
-- 주의: 프로덕션 환경에서는 신중하게 실행할 것!
-- =====================================================

-- 1. 특정 이메일 패턴의 사용자 확인 (실행 전 확인용)
-- =====================================================
SELECT 
  id,
  email,
  name,
  provider,
  provider_id,
  created_at,
  updated_at
FROM users
WHERE 
  email LIKE '%rialto35%'
  OR email LIKE '%test%'
  OR email LIKE 'naver:%'
  OR email LIKE 'kakao:%'
ORDER BY created_at DESC;

-- 2. 해당 사용자들의 검사 결과 수 확인
-- =====================================================
SELECT 
  u.email,
  u.provider,
  COUNT(tr.id) as test_count,
  MAX(tr.created_at) as last_test_date
FROM users u
LEFT JOIN test_results tr ON u.id = tr.user_id
WHERE 
  u.email LIKE '%rialto35%'
  OR u.email LIKE '%test%'
  OR u.email LIKE 'naver:%'
  OR u.email LIKE 'kakao:%'
GROUP BY u.id, u.email, u.provider
ORDER BY test_count DESC;

-- 3. 특정 사용자 ID로 관련 데이터 확인
-- =====================================================
-- 사용자 ID를 여기에 입력하세요
-- SELECT * FROM test_results WHERE user_id = 'USER_ID_HERE';
-- SELECT * FROM results WHERE user_id = 'USER_ID_HERE';
-- SELECT * FROM user_settings WHERE user_id = 'USER_ID_HERE';

-- =====================================================
-- 실제 삭제 쿼리 (주의: 되돌릴 수 없음!)
-- =====================================================

-- 4. rialto35@naver.com 네이버 계정 데이터 삭제
-- =====================================================
-- Step 1: 사용자 ID 확인
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- naver:rialto35@naver.com 사용자 ID 가져오기
  SELECT id INTO target_user_id
  FROM users
  WHERE email = 'naver:rialto35@naver.com' AND provider = 'naver'
  LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    RAISE NOTICE 'Found user ID: %', target_user_id;
    
    -- Step 2: 관련 데이터 삭제 (외래키 순서 고려)
    -- 2-1. results 테이블
    DELETE FROM results WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted from results';
    
    -- 2-2. test_results 테이블
    DELETE FROM test_results WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted from test_results';
    
    -- 2-3. user_settings 테이블
    DELETE FROM user_settings WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted from user_settings';
    
    -- 2-4. reports 테이블 (있다면)
    DELETE FROM reports WHERE user_id = target_user_id;
    RAISE NOTICE 'Deleted from reports';
    
    -- Step 3: 사용자 삭제
    DELETE FROM users WHERE id = target_user_id;
    RAISE NOTICE 'Deleted user: %', target_user_id;
    
  ELSE
    RAISE NOTICE 'User not found: naver:rialto35@naver.com';
  END IF;
END $$;

-- =====================================================
-- 5. 모든 테스트 계정 일괄 삭제 (선택적)
-- =====================================================
-- 주의: 이 쿼리는 매우 위험합니다. 프로덕션에서는 사용하지 마세요!
/*
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN 
    SELECT id, email FROM users 
    WHERE email LIKE '%test%' 
       OR email LIKE 'naver:rialto35%'
       OR email LIKE 'kakao:rialto35%'
  LOOP
    RAISE NOTICE 'Deleting user: % (%)', user_record.email, user_record.id;
    
    DELETE FROM results WHERE user_id = user_record.id;
    DELETE FROM test_results WHERE user_id = user_record.id;
    DELETE FROM user_settings WHERE user_id = user_record.id;
    DELETE FROM reports WHERE user_id = user_record.id;
    DELETE FROM users WHERE id = user_record.id;
  END LOOP;
END $$;
*/

-- =====================================================
-- 6. 삭제 후 확인
-- =====================================================
SELECT 
  'users' as table_name,
  COUNT(*) as remaining_count
FROM users
WHERE 
  email LIKE '%rialto35%'
  OR email LIKE '%test%'
  OR email LIKE 'naver:%'
  OR email LIKE 'kakao:%'

UNION ALL

SELECT 
  'test_results' as table_name,
  COUNT(*) as remaining_count
FROM test_results tr
JOIN users u ON tr.user_id = u.id
WHERE 
  u.email LIKE '%rialto35%'
  OR u.email LIKE '%test%'
  OR u.email LIKE 'naver:%'
  OR u.email LIKE 'kakao:%';

-- =====================================================
-- 7. 개별 사용자 삭제 (안전한 방법)
-- =====================================================
-- 사용 방법:
-- 1. 먼저 SELECT로 삭제할 사용자 확인
-- 2. 해당 사용자의 ID를 복사
-- 3. 아래 쿼리의 'USER_ID_HERE'를 실제 ID로 교체하여 실행

/*
-- 특정 사용자 ID로 삭제
DO $$
DECLARE
  target_id UUID := 'USER_ID_HERE'; -- 여기에 실제 UUID 입력
BEGIN
  DELETE FROM results WHERE user_id = target_id;
  DELETE FROM test_results WHERE user_id = target_id;
  DELETE FROM user_settings WHERE user_id = target_id;
  DELETE FROM reports WHERE user_id = target_id;
  DELETE FROM users WHERE id = target_id;
  
  RAISE NOTICE 'Deleted user and all related data: %', target_id;
END $$;
*/

-- =====================================================
-- 8. 프로바이더별 중복 계정 확인
-- =====================================================
SELECT 
  CASE 
    WHEN email LIKE 'google:%' THEN SUBSTRING(email FROM 8)
    WHEN email LIKE 'naver:%' THEN SUBSTRING(email FROM 7)
    WHEN email LIKE 'kakao:%' THEN SUBSTRING(email FROM 7)
    ELSE email
  END as raw_email,
  STRING_AGG(provider || ':' || email, ', ') as accounts,
  COUNT(*) as account_count
FROM users
GROUP BY raw_email
HAVING COUNT(*) > 1
ORDER BY account_count DESC;

