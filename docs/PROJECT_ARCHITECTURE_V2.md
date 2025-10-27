# InnerMap AI v2 — 프로젝트 아키텍처 문서

> **작성일**: 2025-01-27  
> **버전**: v1.1.0  
> **브랜치**: feature/anon-guard  
> **목적**: 프로젝트 구조, 코드 컨벤션, 디자인 시스템 종합 정리

---

## 📊 프로젝트 개요

### 기본 정보
- **이름**: InnerMap AI v2
- **버전**: 1.1.0
- **설명**: AI 기반 심리 분석 플랫폼 (Big5, MBTI, RETI → Inner9 변환 → 144 영웅 원형 매칭)
- **목표**: "검사 → 결과 → 성장 → 리포트" 3분 내 완결

### 기술 스택

#### Frontend
- **프레임워크**: Next.js 15.5.5 (App Router)
- **언어**: TypeScript 5 (strict mode)
- **UI**: React 19.2.0
- **스타일링**: Tailwind CSS 3.4.17
- **애니메이션**: Framer Motion 12.23.24
- **차트**: Recharts 3.2.1
- **폼**: React Hook Form 7.65.0 + Zod 3.25.76
- **상태**: Zustand 5.0.8 + SWR 2.3.6

#### Backend & Infrastructure
- **인증**: NextAuth v4.24.11 (Google, Kakao, Naver OAuth)
- **데이터베이스**: Supabase (PostgreSQL + RLS)
- **결제**: Stripe 14.8.0
- **AI**: OpenAI API / Anthropic API
- **배포**: Vercel (Frontend) + Supabase (DB)
- **테스트**: Playwright 1.56.1 + Vitest 2.1.9

---

## 🏗️ 폴더 구조

```
innermap-ai-v2/
├─ src/
│  ├─ app/                    # Next.js 15 App Router
│  │  ├─ (app)/              # 그룹 라우트
│  │  ├─ api/                # API Routes
│  │  │  ├─ analyze/         # 분석 엔진
│  │  │  ├─ test/            # 검사 관련
│  │  │  ├─ results/         # 결과 조회
│  │  │  └─ auth/[...nextauth]/  # NextAuth
│  │  ├─ analyze/            # 검사 시작
│  │  ├─ test/               # 검사 진행
│  │  ├─ results/            # 결과 페이지 ⚠️ 통일 필요
│  │  ├─ result/             # (레거시, 제거 예정)
│  │  ├─ mypage/             # 대시보드
│  │  ├─ layout.tsx          # 루트 레이아웃
│  │  └─ globals.css         # 전역 스타일
│  │
│  ├─ components/            # React 컴포넌트
│  │  ├─ layout/            # 레이아웃
│  │  ├─ analyze/           # 검사 UI
│  │  ├─ dashboard/         # 대시보드
│  │  ├─ report/            # 리포트
│  │  ├─ charts/            # 차트
│  │  └─ ui/                # shadcn/ui
│  │
│  ├─ lib/                   # 비즈니스 로직
│  │  ├─ engine/            # 분석 엔진
│  │  ├─ ai/                # AI 프롬프트
│  │  ├─ analyze/           # 검사 로직
│  │  ├─ auth/              # 인증
│  │  ├─ payments/          # 결제
│  │  ├─ auth.ts            # NextAuth 설정
│  │  ├─ supabase.ts        # Supabase 클라이언트
│  │  ├─ routes.ts          # 라우트 헬퍼
│  │  └─ utils.ts           # 유틸리티
│  │
│  ├─ core/                  # 핵심 엔진
│  │  ├─ im-core/           # Inner9 분석 엔진
│  │  │  ├─ index.ts        # 메인 파이프라인
│  │  │  ├─ types.ts        # 타입 정의
│  │  │  ├─ scoreBig5.ts    # Big5 스코어링
│  │  │  ├─ scoreMBTI.ts    # MBTI 스코어링
│  │  │  ├─ inner9.ts       # Inner9 변환 ✅ 최근 수정
│  │  │  ├─ hero-match.ts   # 영웅 매칭
│  │  │  └─ narrative.ts    # 내러티브
│  │  └─ inner9/            # Inner9 로직
│  │
│  ├─ hooks/                 # Custom Hooks
│  ├─ types/                 # TypeScript 타입
│  └─ data/                  # 정적 데이터
│
├─ public/                   # 정적 리소스
│  ├─ assets/               # 이미지
│  ├─ heroes/               # 144 영웅 이미지
│  └─ fonts/                # Pretendard 폰트
│
├─ supabase/                 # Supabase 설정
│  ├─ migrations/           # DB 마이그레이션
│  └─ functions/            # Edge Functions
│
├─ docs/                     # 프로젝트 문서
├─ scripts/                  # 유틸리티 스크립트
│  └─ verify-env.mjs        # 환경 변수 검증 ✅ 최근 수정
│
├─ package.json
├─ tsconfig.json
├─ tailwind.config.js
└─ next.config.ts
```

---

## 📝 코드 컨벤션

### 명명 규칙

#### 파일명
```typescript
// 컴포넌트: PascalCase.tsx
PageContainer.tsx
HeroCard.tsx

// 유틸리티: camelCase.ts
utils.ts
auth.ts

// API 라우트: route.ts
app/api/analyze/route.ts
```

#### 변수/함수명
```typescript
// 변수: camelCase
const userName = "dev";
const isLoggedIn = true;

// 함수: camelCase (동사 시작)
function calculateScore() {}
function fetchUserData() {}

// 상수: UPPER_SNAKE_CASE
const API_BASE_URL = "https://api.example.com";
const MAX_RETRY_COUNT = 3;

// 컴포넌트: PascalCase
function PageContainer() {}
```

#### 타입/인터페이스
```typescript
// Type Alias 우선 (interface 금지)
type User = {
  id: string;
  email: string;
};

type PageContainerProps = {
  children: ReactNode;
};
```

### TypeScript 규칙

#### Strict Mode 필수
```json
{
  "compilerOptions": {
    "strict": true,  // ✅ 필수
    "noEmit": true
  }
}
```

#### `any` 금지
```typescript
// ❌ BAD
function processData(data: any) {}

// ✅ GOOD
type DataInput = { value: string };
function processData(data: DataInput) {}

// ✅ GOOD (unknown 사용)
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null) {
    // 타입 가드
  }
}
```

#### 파일 길이 제한
- 최대 300줄
- 컴포넌트는 100줄 이하 권장

### Import 순서
```typescript
// 1. React / Next.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. 외부 라이브러리
import { motion } from 'framer-motion';
import { z } from 'zod';

// 3. 내부 라이브러리 (@/ alias)
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// 4. 컴포넌트
import PageContainer from '@/components/layout/PageContainer';

// 5. 타입
import type { User } from '@/types';

// 6. 상대 경로
import { localHelper } from './helpers';
```

---

## 🎨 디자인 시스템

### 색상 팔레트

#### 기본 배경
```css
background: linear-gradient(to bottom, 
  #0F1424 0%,   /* navy-dark */
  #0B1220 80%,
  #0B1220 100%
);
```

#### 컬러 시스템
```javascript
// tailwind.config.js
{
  colors: {
    navy: {
      dark: '#0F1424',
      medium: '#20253A',
    },
    violet: { 500: '#8B5CF6' },
    cyan: { 400: '#22D3EE' },
    blue: { 600: '#2563EB' },
    green: { 600: '#16A34A' },
  }
}
```

### 버튼 스타일

```css
/* 기본 버튼 */
.btn-primary {
  @apply px-6 py-3 min-h-[44px]
         bg-blue-600 text-white 
         rounded-xl 
         hover:bg-blue-700 
         transition-all 
         font-medium;
}

/* 그라데이션 버튼 */
.btn-gradient {
  @apply px-6 py-3 min-h-[44px]
         bg-gradient-to-r from-violet-500 to-cyan-500
         text-white rounded-xl
         hover:opacity-90
         transition-all
         font-medium;
}
```

### 카드 스타일

```css
.card-glass {
  @apply rounded-2xl 
         border border-white/10 
         bg-white/5 
         backdrop-blur-md 
         shadow-[0_8px_30px_rgb(0,0,0,0.12)];
}
```

### 타이포그래피

```tsx
// 페이지 제목
<h1 className="text-3xl md:text-4xl font-bold text-white">
  제목
</h1>

// 본문
<p className="text-base text-slate-200 opacity-80">
  본문 텍스트
</p>
```

---

## 🔧 환경 변수

### 필수 환경 변수 (5개)
```bash
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_here
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 선택 환경 변수 (OAuth)
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Kakao OAuth (선택)
KAKAO_CLIENT_ID=your_kakao_client_id
KAKAO_CLIENT_SECRET=your_kakao_client_secret

# Naver OAuth (선택)
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret
```

### Feature Flags
```bash
# 익명 검사 활성화 (기본: false)
IM_ANON_TEST_ENABLED=false
NEXT_PUBLIC_IM_ANON_TEST_ENABLED=false
```

### AI API (선택)
```bash
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key
```

---

## 🚀 개발 워크플로우

### 로컬 개발
```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 설정
cp env.example.txt .env.local
# .env.local 편집

# 3. 개발 서버 실행
npm run dev

# 4. 타입 체크
npm run typecheck

# 5. 린트
npm run lint
```

### 빌드 & 배포
```bash
# 프로덕션 빌드
npm run build

# 로컬 프리뷰
npm run start

# Vercel 배포 (자동)
git push origin main
```

### Commit Convention
```bash
# 형식
<type>(<scope>): <subject>

# 타입
feat:     새로운 기능
fix:      버그 수정
refactor: 리팩터링
chore:    빌드/설정 변경
docs:     문서 변경
test:     테스트 추가/수정

# 예시
feat(analyze): add anonymous test guard feature flag
fix(core): add defensive code for undefined mbti in Inner9
```

---

## 🐛 최근 수정 사항

### 2025-01-27

#### 1. Inner9 분석 버그 수정
**파일**: `src/core/im-core/inner9.ts`

**문제**: `mbti`가 `undefined`일 때 `.includes()` 호출로 500 에러

**해결**:
- `mbti`와 `reti` 파라미터를 optional로 변경
- 기본값 설정: `mbti = ''`, `reti = 5`
- `safeMbti`, `safeReti` 변수로 방어 코드 추가

```typescript
export function toInner9(data: {
  big5: Big5Scores;
  mbti?: string;  // ✅ optional
  reti?: number;  // ✅ optional
  weights?: { big5: number; mbti: number; reti: number };
}): Inner9Axis[] {
  const { big5, mbti = '', reti = 5, weights = { big5: 1, mbti: 0.5, reti: 0.5 } } = data;
  
  const safeMbti = mbti || '';
  const safeReti = reti ?? 5;
  // ...
}
```

#### 2. 빌드 환경 변수 검증 완화
**파일**: `scripts/verify-env.mjs`

**문제**: OAuth 환경 변수 누락 시 빌드 실패

**해결**:
- OAuth 환경 변수를 required → optional로 이동
- `checkAuthProviders()` 함수 추가 (경고만 출력)
- 빌드는 통과하되, 로그인 기능 사용 시 최소 1개 OAuth 필요

**필수 환경 변수**: 5개 (Supabase + NextAuth 기본)  
**선택 환경 변수**: OAuth, AI API

---

## ⚠️ 알려진 이슈

### BUG-001: Inner9 분석 500 에러 (해결됨 ✅)
- **증상**: Big5만 입력 시 500 에러
- **원인**: `mbti.includes()` 호출 시 undefined
- **해결**: 2025-01-27 수정 완료

### BUG-002: Vercel 빌드 실패 (해결됨 ✅)
- **증상**: `GOOGLE_CLIENT_SECRET` 누락으로 빌드 실패
- **원인**: 환경 변수 검증이 너무 엄격
- **해결**: 2025-01-27 OAuth를 선택 사항으로 변경

### BUG-003: 라우트 경로 혼재 (진행 중 🔄)
- **증상**: `/result/` (단수)와 `/results/` (복수) 혼용
- **영향**: 일부 링크 404 가능성
- **계획**: `/results/`로 통일 예정

### BUG-004: 세션 지속성 이슈 (알려진 버그)
- **증상**: 페이지 이동 시 로그아웃
- **원인**: NextAuth 세션 관리 이슈
- **상태**: 조사 중

---

## 📚 참고 문서

- `docs/INNERMAP_V2_MASTER_PLAN.md` - 프로젝트 마스터 플랜
- `docs/IMCORE_ARCHITECTURE.md` - 엔진 아키텍처
- `docs/ANON_GUARD_FEATURE.md` - 익명 검사 플래그 기능
- `.cursor/rules.md` - 개발 규칙 (헌법)

---

**작성**: AI Assistant (Claude Sonnet 4.5)  
**검수**: 필요 시 팀 리뷰 요청

