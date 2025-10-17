# PR #5.1 배포 가이드
> 비동기 리포트 큐 + LLM 내러티브 + 상태 폴링 UI

**예상 소요 시간: 3-5분**

---

## 📋 체크리스트

- [ ] DB 마이그레이션 실행
- [ ] Edge Function 배포
- [ ] 환경 변수 설정
- [ ] 스모크 테스트 (큐 → 워커 → UI)
- [ ] 회귀 테스트 (멱등성, 권한, 실패 처리)

---

## 1️⃣ DB 마이그레이션 실행

### Option A: Supabase Dashboard (권장)

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택 → **SQL Editor**
3. 다음 파일 내용 복사:
   ```
   supabase/migrations/004_reports_enhancement_safe.sql
   ```
4. **Run** 클릭
5. 성공 메시지 확인: `✅ Reports enhancement migration completed successfully!`

### Option B: Supabase CLI

```bash
cd e:\innermap-ai-v2
supabase db push --include-all
```

### 검증

```sql
-- reports 테이블 컬럼 확인
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'reports'
ORDER BY ordinal_position;

-- 기대 결과: status, summary_md, visuals_json, error_msg, started_at, finished_at 컬럼 존재
```

---

## 2️⃣ Edge Function 배포

### 사전 준비

1. Supabase CLI 설치 확인:
   ```bash
   supabase --version
   # 없으면: npm install -g supabase
   ```

2. 프로젝트 링크 (최초 1회):
   ```bash
   supabase link --project-ref <YOUR_PROJECT_ID>
   ```

### 배포

```bash
cd e:\innermap-ai-v2
supabase functions deploy generate-report
```

**성공 메시지:**
```
Deployed Function generate-report in 2.3s
URL: https://<project-ref>.supabase.co/functions/v1/generate-report
```

### 검증

```bash
# 함수 목록 확인
supabase functions list

# 기대 결과:
# NAME                    VERSION    CREATED AT
# generate-report         1          2025-10-17 12:34:56
```

---

## 3️⃣ 환경 변수 설정

### 필수 시크릿

```bash
# OpenAI API Key (우선)
supabase secrets set OPENAI_API_KEY=sk-...

# Supabase URL
supabase secrets set SUPABASE_URL=https://<project-ref>.supabase.co

# Service Role Key (Dashboard > Settings > API > service_role key)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJh...

# (선택) Anthropic API Key (OpenAI 대체용)
# supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

### 검증

```bash
supabase secrets list

# 기대 결과:
# NAME                          
# OPENAI_API_KEY                (hidden)
# SUPABASE_URL                  (hidden)
# SUPABASE_SERVICE_ROLE_KEY     (hidden)
```

---

## 4️⃣ Cron 또는 트리거 설정 (선택)

### Option A: Cron (권장 - 자동 큐 처리)

1. Supabase Dashboard → **Edge Functions** → `generate-report`
2. **Schedules** 탭
3. **New Schedule** 클릭
4. Cron expression: `*/15 * * * *` (15초마다)
   - 또는 `*/30 * * * *` (30초마다 - 부하 적음)
5. **Save**

### Option B: HTTP 트리거 (수동)

POST /api/report에서 이미 트리거 코드 포함됨:
```typescript
// src/app/api/report/route.ts 참고
await triggerReportGeneration(newReport.id);
```

크론 없이도 리포트 요청 시 자동 실행됩니다.

---

## 5️⃣ 스모크 테스트 (3분)

### 5-1. 리포트 생성 요청

```bash
# 테스트용 결과 ID 확인 (Supabase Dashboard > results 테이블)
# 예: d97bf4c0-87d6-460b-a468-aa49892956f7

# API 호출
curl -X POST https://innermap-ai-v2.vercel.app/api/report \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<YOUR_SESSION>" \
  -d '{"resultId": "d97bf4c0-87d6-460b-a468-aa49892956f7"}'

# 기대 응답:
# {
#   "reportId": "abc123...",
#   "status": "queued",
#   "message": "리포트 생성이 시작되었습니다..."
# }
```

### 5-2. 워커 동작 확인

**Dashboard → Table Editor → reports:**
```sql
SELECT id, status, started_at, finished_at, length(summary_md) as md_len
FROM reports
ORDER BY created_at DESC
LIMIT 5;
```

**예상 시퀀스:**
1. `status = 'queued'` (즉시)
2. `status = 'processing'`, `started_at` 채워짐 (15-30초 후)
3. `status = 'ready'`, `finished_at` 채워짐, `summary_md` 길이 > 0 (30-60초 후)

### 5-3. UI 확인

브라우저에서 `/report/<reportId>` 접속:

1. **queued 상태:**
   - ⏳ "대기 중" 배지
   - 스피너 애니메이션
   - "예상 대기 시간: 약 5초"

2. **processing 상태:**
   - ⚡ "생성 중" 배지
   - 진행 바 애니메이션
   - "AI가 당신의 리포트를 작성하고 있습니다..."

3. **ready 상태:**
   - ✅ "완료" 배지
   - Markdown 본문 표시
   - Big5 레이더 차트
   - "PDF 다운로드", "공유하기" 버튼 (다음 PR에서 활성화)

---

## 6️⃣ 회귀/장애 테스트

### 6-1. 멱등성 테스트

```bash
# 같은 resultId로 2회 연속 요청
curl -X POST .../api/report -d '{"resultId":"..."}'
curl -X POST .../api/report -d '{"resultId":"..."}'

# 기대: 두 응답의 reportId가 동일
# 또는 두 번째 응답에 existingReport: true
```

### 6-2. 권한 테스트

```bash
# 비로그인 상태에서 /report/<id> 접속
# 기대: /login 리다이렉트 또는 401 에러

# 다른 사용자의 reportId 접근 시도
# 기대: 403 Forbidden
```

### 6-3. 실패 처리 테스트

**의도적 실패 유도:**
```bash
# OPENAI_API_KEY를 잠시 빈 값으로 변경
supabase secrets set OPENAI_API_KEY=invalid

# 리포트 생성 요청
curl -X POST .../api/report -d '{"resultId":"..."}'

# 기대:
# 1. status가 'failed'로 변경
# 2. error_msg에 "No LLM API key configured" 또는 유사 메시지
# 3. UI에서 "❌ 생성 실패" + "다시 시도" 버튼 표시

# 복구
supabase secrets set OPENAI_API_KEY=sk-...
```

### 6-4. 타임아웃 테스트

```bash
# Edge Function 로그 확인
# Dashboard > Edge Functions > generate-report > Logs

# 기대:
# - 각 호출이 45초 이내 완료
# - 429/5xx 에러 시 재시도 로직 동작 (로그에 "retry" 메시지)
```

---

## 7️⃣ 운영 모니터링

### 큐 상태 확인 쿼리

```sql
-- 현재 큐 상황
SELECT 
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (finished_at - started_at)))::int as avg_sec
FROM reports
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY status;

-- 기대 결과:
-- status      | count | avg_sec
-- queued      |   0   |  NULL
-- processing  |   1   |  NULL
-- ready       |  23   |  42
-- failed      |   0   |  NULL
```

### 최근 실패 리포트

```sql
SELECT id, result_id, error_msg, created_at
FROM reports
WHERE status = 'failed'
ORDER BY created_at DESC
LIMIT 10;
```

### Edge Function 로그

Dashboard > Edge Functions > `generate-report` > **Logs**

**필수 로그 라인:**
```
[generate-report] Processing report abc123...
[callLLM] Using OpenAI
[generate-report] Report abc123 completed successfully
```

---

## 🚨 흔한 이슈 해결

### ❌ "column reports.status already exists"

**원인:** 이전 마이그레이션과 중복

**해결:**
```sql
-- 004_reports_enhancement_safe.sql 사용 (멱등)
-- 또는 수동으로 확인:
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'reports' AND column_name = 'status';
```

### ❌ "Function not found (404)"

**원인:** 배포 실패 또는 이름 불일치

**해결:**
```bash
supabase functions list  # 이름 확인
cd supabase/functions/generate-report
ls  # index.ts 존재 확인
supabase functions deploy generate-report --no-verify-jwt
```

### ❌ "Unauthorized / 401"

**원인:** Service Role Key 미설정 또는 잘못된 키

**해결:**
```bash
# Dashboard > Settings > API > service_role key 복사
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=eyJh...

# Edge Function에서 createClient 호출 시 service role 사용 확인
```

### ❌ "summary_md is NULL"

**원인:** LLM 응답 파싱 실패

**해결:**
```typescript
// Edge Function 로그 확인:
// - "LLM call failed" → API 키 또는 모델 문제
// - "Failed to update report" → DB 쓰기 권한 문제

// 수동 테스트:
// 1. Dashboard > Edge Functions > generate-report > Invoke
// 2. 로그에서 응답 확인
```

---

## ✅ 배포 완료 확인

모든 테스트 통과 시:

- [x] DB에 status, summary_md, visuals_json 컬럼 존재
- [x] Edge Function 배포됨 (supabase functions list)
- [x] 시크릿 설정됨 (supabase secrets list)
- [x] 큐 등록 API 동작 (POST /api/report)
- [x] 워커가 queued → ready 전환 (15-60초 내)
- [x] UI 폴링 및 상태별 렌더링 정상
- [x] 멱등성, 권한, 실패 처리 확인

---

## 📞 트러블슈팅

문제가 지속되면:

1. **Supabase Logs** 확인:
   - Dashboard > Logs > Database
   - Dashboard > Edge Functions > generate-report > Logs

2. **Vercel Logs** 확인:
   - Vercel Dashboard > Project > Deployments > Latest > Logs
   - `/api/report` 호출 로그

3. **브라우저 Console** 확인:
   - Network 탭: `/api/report` 응답 코드
   - Console 탭: 에러 메시지

4. **GitHub Issue** 제출:
   - 로그 스크린샷
   - 재현 단계
   - 환경 정보 (Node, Supabase CLI 버전)

---

**배포 성공을 기원합니다! 🚀**

