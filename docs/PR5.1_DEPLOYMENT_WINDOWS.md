# PR #5.1 배포 가이드 (Windows)
> Supabase CLI 없이 Dashboard로 배포하기

**예상 소요 시간: 5분**

---

## ⚠️ Windows 환경 주의사항

Supabase CLI는 Windows에서 npm global 설치를 지원하지 않습니다.  
대신 **Supabase Dashboard**를 사용하여 배포합니다.

---

## 1️⃣ DB 마이그레이션 (2분)

### Supabase Dashboard 사용

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 좌측 메뉴 → **SQL Editor**
4. 파일 열기: `e:\innermap-ai-v2\supabase\migrations\004_reports_enhancement_safe.sql`
5. 전체 내용 복사 후 SQL Editor에 붙여넣기
6. **Run** 버튼 클릭
7. 성공 메시지 확인: `✅ Reports enhancement migration completed successfully!`

### 검증

SQL Editor에서 실행:
```sql
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'reports'
ORDER BY ordinal_position;
```

**기대 결과:** `status`, `summary_md`, `visuals_json`, `error_msg`, `started_at`, `finished_at` 컬럼이 보여야 함

---

## 2️⃣ Edge Function 생성 (3분)

### Supabase Dashboard에서 직접 생성

1. **Dashboard** → 좌측 메뉴 → **Edge Functions**
2. **Create Function** 버튼 클릭
3. Function 이름 입력: `generate-report`
4. **Create** 클릭

### 코드 복사

1. 생성된 Function 클릭
2. **Edit** 탭으로 이동
3. 기존 코드 전체 삭제
4. `e:\innermap-ai-v2\supabase\functions\generate-report\index.ts` 파일 내용 복사
5. 붙여넣기
6. **Deploy** 버튼 클릭
7. 배포 완료 대기 (30초 정도)

---

## 3️⃣ 환경 변수 설정 (1분)

### Dashboard에서 Secrets 설정

1. **Edge Functions** → `generate-report` → **Settings** 탭
2. **Secrets** 섹션에서 다음 변수 추가:

```
OPENAI_API_KEY = sk-...
SUPABASE_URL = https://<your-project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJh...
```

**Service Role Key 확인:**
- Dashboard → **Settings** → **API** → `service_role` 키 복사

3. 각 시크릿 추가 후 **Save** 클릭

---

## 4️⃣ Cron 설정 (선택, 1분)

자동 큐 처리를 위한 스케줄 설정:

1. **Edge Functions** → `generate-report` → **Schedules** 탭
2. **Create Schedule** 클릭
3. Cron Expression 입력:
   - `*/15 * * * *` (15초마다 - 권장)
   - 또는 `*/30 * * * *` (30초마다 - 부하 적음)
4. **Save** 클릭

---

## 5️⃣ 테스트 (2분)

### 5-1. 리포트 생성 요청

브라우저에서 테스트:

1. 로그인한 상태로 개발자 도구 열기 (F12)
2. Console 탭에서 실행:

```javascript
// 실제 결과 ID로 교체하세요
const resultId = "실제-결과-ID-입력";

fetch('/api/report', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resultId })
}).then(r => r.json()).then(console.log);

// 기대 응답:
// { reportId: "...", status: "queued", message: "..." }
```

### 5-2. 상태 확인

**Dashboard → Table Editor → reports:**

```sql
SELECT 
  id, 
  status, 
  started_at, 
  finished_at, 
  length(summary_md) as content_length
FROM reports
ORDER BY created_at DESC
LIMIT 5;
```

**예상 시퀀스 (15-60초):**
1. `status = 'queued'` (즉시)
2. `status = 'processing'` (15-30초 후)
3. `status = 'ready'`, `content_length > 0` (30-60초 후)

### 5-3. UI 확인

브라우저에서 `/report/<reportId>` 접속:

✅ **queued:** ⏳ 대기 중 배지  
✅ **processing:** ⚡ 생성 중 애니메이션  
✅ **ready:** ✅ 완료 + Markdown 본문 + Big5 차트

---

## 6️⃣ 트러블슈팅

### ❌ "Function not found"

**확인:**
- Dashboard > Edge Functions에서 `generate-report` 존재 확인
- Function URL 확인: `https://<project-ref>.supabase.co/functions/v1/generate-report`

### ❌ "summary_md is NULL"

**Edge Function 로그 확인:**
1. Dashboard > Edge Functions > `generate-report` > **Logs** 탭
2. 최근 실행 로그에서 에러 확인

**흔한 원인:**
- OPENAI_API_KEY 미설정 또는 잘못된 키
- SUPABASE_SERVICE_ROLE_KEY 미설정

### ❌ "Unauthorized"

**Service Role Key 재확인:**
1. Dashboard > Settings > API
2. `service_role` 키 복사 (anon 키 아님!)
3. Edge Function Secrets에 다시 설정

---

## 7️⃣ 수동 테스트 (Edge Function 직접 실행)

Dashboard에서 Function을 수동으로 트리거할 수 있습니다:

1. **Edge Functions** → `generate-report` → **Invoke** 탭
2. **Request Body** (선택):
   ```json
   {}
   ```
3. **Invoke** 버튼 클릭
4. **Response** 확인:
   - 성공: `{ "message": "No reports in queue" }` 또는 `{ "reportId": "...", "status": "ready" }`
   - 실패: 에러 메시지 확인

---

## 📊 운영 모니터링

### 큐 상태 확인 (SQL Editor)

```sql
-- 현재 큐 상황
SELECT 
  status,
  COUNT(*) as count,
  AVG(EXTRACT(EPOCH FROM (finished_at - started_at)))::int as avg_seconds
FROM reports
WHERE created_at > NOW() - INTERVAL '1 day'
GROUP BY status;
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

## ✅ 배포 완료 체크리스트

- [ ] DB 마이그레이션 완료 (004_reports_enhancement_safe.sql)
- [ ] Edge Function 생성 및 배포 (Dashboard)
- [ ] Secrets 설정 완료 (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
- [ ] Cron 스케줄 설정 (선택)
- [ ] 리포트 생성 테스트 (POST /api/report)
- [ ] 상태 전환 확인 (queued → processing → ready)
- [ ] UI 확인 (/report/[id])

---

## 🔄 재배포가 필요한 경우

코드 수정 후:

1. Dashboard > Edge Functions > `generate-report` > **Edit** 탭
2. 수정된 코드 붙여넣기
3. **Deploy** 버튼 클릭
4. 배포 완료 대기

---

## 📞 추가 지원

문제가 지속되면:

1. **Edge Function Logs** 확인 (Dashboard > Edge Functions > Logs)
2. **Database Logs** 확인 (Dashboard > Logs > Database)
3. **Vercel Logs** 확인 (Vercel Dashboard > Logs)
4. GitHub Issue 제출 또는 Supabase Discord 문의

---

**배포 성공을 기원합니다! 🚀**

Dashboard를 사용하면 CLI 없이도 모든 기능을 사용할 수 있습니다!

