# PR #5.1 빠른 참조 가이드
> 1분 안에 배포하기

---

## 🚀 빠른 시작 (3 커맨드)

```bash
# 1. DB 마이그레이션
# Supabase Dashboard > SQL Editor에서 실행:
# supabase/migrations/004_reports_enhancement_safe.sql

# 2. Edge Function 배포
supabase functions deploy generate-report

# 3. 시크릿 설정
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set SUPABASE_URL=https://<project-ref>.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJh...
```

---

## 🧪 테스트 (1분)

```bash
# 1. 리포트 생성 요청
curl -X POST https://your-domain.vercel.app/api/report \
  -H "Content-Type: application/json" \
  -d '{"resultId": "<실제-결과-ID>"}'

# 2. 상태 확인 (Supabase Dashboard > reports 테이블)
SELECT id, status, length(summary_md) FROM reports ORDER BY created_at DESC LIMIT 1;
# 기대: status='ready', summary_md > 0

# 3. UI 확인
# /report/<reportId> 접속 → Markdown 본문 표시
```

---

## 📊 운영 쿼리

```sql
-- 큐 상태
SELECT status, COUNT(*) FROM reports WHERE created_at > NOW() - INTERVAL '1 day' GROUP BY status;

-- 최근 10개
SELECT id, status, started_at, finished_at FROM reports ORDER BY created_at DESC LIMIT 10;

-- 실패 리포트
SELECT id, error_msg FROM reports WHERE status = 'failed' ORDER BY created_at DESC;
```

---

## 🔥 긴급 수정

```bash
# Edge Function 재배포
supabase functions deploy generate-report

# 시크릿 업데이트
supabase secrets set OPENAI_API_KEY=새로운-키

# 로그 확인
# Dashboard > Edge Functions > generate-report > Logs
```

---

## 📖 전체 가이드

자세한 내용: [PR5.1_DEPLOYMENT.md](./PR5.1_DEPLOYMENT.md)

