# 🔧 Database Migration Guide

## PR #3, #4.5 - Assessments & Results Schema

### 📝 Quick Start

**Supabase Dashboard에서 실행:**

1. [Supabase Dashboard](https://supabase.com/dashboard) 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. **+ New Query** 클릭
5. `supabase/migrations/002_assessments_results.sql` 파일 내용 전체 복사
6. SQL Editor에 붙여넣기
7. **Run** 버튼 클릭 (또는 `Ctrl+Enter`)

---

### 📋 생성되는 테이블

#### 1. `assessments` (원시 응답)
```sql
- id (UUID, PK)
- user_id (TEXT) -- email
- answers (JSONB) -- { "q_001": 5, ... }
- answers_hash (TEXT) -- SHA256 for idempotency
- engine_version (TEXT) -- 'v1.1.0'
- test_type (TEXT) -- 'quick' | 'full'
- draft (BOOLEAN) -- auto-save drafts
- created_at, updated_at (TIMESTAMPTZ)
```

#### 2. `results` (스코어링 결과)
```sql
- id (UUID, PK)
- user_id (TEXT)
- assessment_id (UUID, FK)
- engine_version (TEXT)
- big5_scores (JSONB)
- mbti_scores (JSONB)
- reti_scores (JSONB)
- tribe (JSONB)
- stone (JSONB)
- hero (JSONB)
- created_at (TIMESTAMPTZ)
```

#### 3. `reports` (AI 리포트)
```sql
- id (UUID, PK)
- user_id (TEXT)
- result_id (UUID, FK)
- status (TEXT) -- 'queued' | 'running' | 'ready' | 'failed'
- model_version (TEXT)
- summary_md (TEXT)
- visual_data (JSONB)
- error_message (TEXT)
- created_at, updated_at (TIMESTAMPTZ)
```

#### 4. `payments` (결제/플랜)
```sql
- id (UUID, PK)
- user_id (TEXT)
- plan_type (TEXT) -- 'free' | 'premium' | 'pro'
- stripe_customer_id, stripe_subscription_id (TEXT)
- status (TEXT) -- 'active' | 'inactive' | 'cancelled'
- current_period_end (TIMESTAMPTZ)
- created_at, updated_at (TIMESTAMPTZ)
```

---

### ✅ 검증

마이그레이션 후 다음 쿼리로 확인:

```sql
-- 테이블 존재 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('assessments', 'results', 'reports', 'payments');

-- 인덱스 확인
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
  AND tablename IN ('assessments', 'results', 'reports', 'payments');

-- RLS 정책 확인
SELECT tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

---

### 🔄 Rollback (필요시)

```sql
-- 테이블 삭제 (순서 중요: FK 관계)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reports CASCADE;
DROP TABLE IF EXISTS results CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
```

---

### 🚀 다음 단계

마이그레이션 완료 후:

1. ✅ 로컬 개발 서버 재시작: `npm run dev`
2. ✅ `/analyze` 페이지 접속
3. ✅ 설문 진행 및 자동 저장 테스트
4. ✅ 제출 후 `/results/[id]` 확인

---

### 🐛 Troubleshooting

**"Could not find the table" 에러:**
- Supabase Dashboard에서 마이그레이션 실행 확인
- 테이블 목록에 `assessments`, `results` 등이 보이는지 확인

**RLS 에러:**
- 현재 RLS는 `USING (true)`로 임시 설정
- TODO: auth.uid() 기반으로 전환 필요

**유니크 제약 위반:**
- `answers_hash` + `engine_version` 조합이 중복되면 기존 결과 반환
- 의도된 동작 (idempotency)

