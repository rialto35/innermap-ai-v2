# 🗄️ Supabase 설정 가이드

## 📋 개요

InnerMap AI v2의 데이터베이스로 Supabase를 사용합니다.

---

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env.local` 파일에 다음 변수들을 추가하세요:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://ghytatucfdmjxxjtfhle.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeXRhdHVjZmRtanh4anRmaGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNDAwNTcsImV4cCI6MjA3NTkxNjA1N30.VVRTDcuNbe9gQPpyyis2Ovf1OqcV5IZiSqyz_cupoYY
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeXRhdHVjZmRtanh4anRmaGxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDM0MDA1NywiZXhwIjoyMDc1OTE2MDU3fQ.Lsix2C8vyLt_w-wLNe6MeFKuqh7tqfY8Wu6-jZ57ikA
SUPABASE_DB_URL=postgresql://postgres:jk0224JK@db.ghytatucfdmjxxjtfhle.supabase.co:5432/postgres
```

### 2. 마이그레이션 실행

Supabase Dashboard에서 SQL Editor를 열고 `supabase/migrations/001_initial_schema.sql` 파일의 내용을 실행하세요.

**또는** Supabase CLI를 사용:

```bash
# Supabase CLI 설치 (한 번만)
npm install -g supabase

# 프로젝트 연결
supabase link --project-ref ghytatucfdmjxxjtfhle

# 마이그레이션 실행
supabase db push
```

---

## 📊 데이터베이스 스키마

### 1. `users` - 사용자 프로필

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| email | TEXT | 이메일 (unique) |
| name | TEXT | 사용자 이름 |
| image | TEXT | 프로필 이미지 URL |
| provider | TEXT | OAuth 제공자 (google/kakao/naver) |
| provider_id | TEXT | OAuth ID |
| level | INTEGER | 사용자 레벨 (기본 1) |
| exp_current | INTEGER | 현재 경험치 |
| exp_next | INTEGER | 다음 레벨까지 필요 경험치 |
| created_at | TIMESTAMPTZ | 생성 시간 |
| updated_at | TIMESTAMPTZ | 수정 시간 |

### 2. `test_results` - 검사 결과

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 사용자 FK |
| test_type | TEXT | 검사 유형 (imcore/big5/hero-analysis) |
| name | TEXT | 응답자 이름 |
| birth_date | DATE | 생년월일 |
| gender_preference | TEXT | 성별 선호 (male/female) |
| mbti_type | TEXT | MBTI 유형 (ENFP, INTP 등) |
| mbti_confidence | JSONB | MBTI 확률 |
| reti_top1 | TEXT | RETI 1순위 |
| reti_top2 | TEXT | RETI 2순위 |
| reti_scores | JSONB | RETI 전체 점수 |
| big5_* | INTEGER | Big5 점수 (0-100) |
| growth_* | INTEGER | 성장 벡터 점수 (0-100) |
| hero_id | TEXT | 영웅 ID |
| hero_name | TEXT | 영웅 이름 |
| tribe_name | TEXT | 부족 이름 |
| stone_name | TEXT | 결정석 이름 |
| raw_scores | JSONB | 원본 점수 전체 |
| created_at | TIMESTAMPTZ | 생성 시간 |
| updated_at | TIMESTAMPTZ | 수정 시간 |

### 3. `ai_reports` - AI 분석 리포트

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 사용자 FK |
| test_result_id | UUID | 검사 결과 FK |
| report_type | TEXT | 리포트 유형 |
| content | TEXT | Markdown 리포트 내용 |
| created_at | TIMESTAMPTZ | 생성 시간 |
| updated_at | TIMESTAMPTZ | 수정 시간 |

### 4. `user_settings` - 사용자 설정

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | Primary Key |
| user_id | UUID | 사용자 FK (unique) |
| email_notifications | BOOLEAN | 이메일 알림 |
| push_notifications | BOOLEAN | 푸시 알림 |
| profile_visibility | TEXT | 프로필 공개 범위 |
| theme | TEXT | 테마 (dark/light/auto) |
| language | TEXT | 언어 (ko/en/ja) |
| created_at | TIMESTAMPTZ | 생성 시간 |
| updated_at | TIMESTAMPTZ | 수정 시간 |

---

## 🔒 보안 (Row Level Security)

모든 테이블에 RLS가 활성화되어 있습니다:

- **사용자는 자신의 데이터만 조회/수정 가능**
- Service Role Key는 서버 사이드에서만 사용
- Anon Key는 클라이언트에서 안전하게 사용 가능

---

## 🛠️ 사용 예시

### 클라이언트 사이드 (React 컴포넌트)

```typescript
import { supabase } from '@/lib/supabase'

// 검사 결과 조회
const { data, error } = await supabase
  .from('test_results')
  .select('*')
  .eq('user_id', userId)
  .order('created_at', { ascending: false })
  .limit(10)
```

### 서버 사이드 (API Route)

```typescript
import { supabaseAdmin } from '@/lib/supabase'

// 검사 결과 저장 (Service Role)
const { data, error } = await supabaseAdmin
  .from('test_results')
  .insert({
    user_id: userId,
    test_type: 'imcore',
    mbti_type: 'ENFP',
    // ... 나머지 필드
  })
```

---

## 📝 다음 단계

1. ✅ Supabase 클라이언트 설정 완료
2. ✅ 데이터베이스 스키마 설계 완료
3. 🔄 마이그레이션 SQL 실행 (Supabase Dashboard)
4. 🔄 API 라우트를 Supabase로 전환
5. 🔄 대시보드/마이페이지 DB 연동

---

## 🚨 주의사항

- **Service Role Key는 절대 클라이언트에 노출하지 마세요!**
- `.env.local` 파일은 `.gitignore`에 포함되어 있습니다
- Vercel 배포 시 환경 변수를 별도로 설정하세요
- RLS 정책을 수정할 때는 신중하게 테스트하세요

---

## 🔗 참고 링크

- [Supabase Dashboard](https://supabase.com/dashboard/project/ghytatucfdmjxxjtfhle)
- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

