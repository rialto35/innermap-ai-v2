-- 임시 디버깅용 RLS 정책 (개발 환경에서만 사용)
-- 이 정책은 모든 사용자가 모든 리포트에 접근할 수 있게 합니다.

-- 기존 정책 삭제
drop policy if exists "owner_read_reports" on reports;
drop policy if exists "owner_write_reports" on reports;

-- 디버깅용 정책 생성 (모든 접근 허용)
create policy "debug_access_reports" on reports
  for all using (true);

-- reports_deep 테이블도 동일하게 처리
drop policy if exists "owner_readwrite_reports_deep" on reports_deep;

create policy "debug_access_reports_deep" on reports_deep
  for all using (true);

-- 주의: 이 정책은 개발 환경에서만 사용하고, 
-- 프로덕션 배포 전에 제거해야 합니다!
