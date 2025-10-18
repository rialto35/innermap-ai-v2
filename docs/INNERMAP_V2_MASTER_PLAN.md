# InnerMap AI v2 — 통합 개발 마스터 플랜

> 기준: 2025-10-18 KST  
> 엔진: Next.js 15 (App Router) · TypeScript · Tailwind · shadcn/ui · NextAuth · Supabase (PostgreSQL) · Stripe · Recharts · Supabase Edge Functions

---

## 0. 전반 원칙

- UX 흐름: "검사 → 결과 → 성장 → 리포트 → 마이페이지 허브" 3분 내 완결
- 로그인 없이는 요약 체험만, 로그인 시 저장/공유 활성화
- 모든 시간 KST(Asia/Seoul) 동기화
- 역할: `user / pro / admin` , Stripe 구독 상태로 접근 제어

---

## 1. 라우트 구조

```
/
├─ login
├─ analyze
│  └─ loading
├─ report/[id]       → 요약/심층 탭
├─ mypage (= dashboard)
└─ api/*
```

> `/report/new` 삭제, “리포트 생성하기”는 `/mypage` 모달로 흡수

---

## 2. 페이지 기능

| 페이지 | 주요 역할 | 상태 |
| --- | --- | --- |
| `/` | 랜딩·CTA | Hero → Analyze 진입 |
| `/login` | OAuth(Google·Naver·Kakao) 로그인 | 완료 |
| `/analyze` | 생년월일 + MBTI + RETI + Big5 입력, 엔진 큐잉 | 완료 (LLM Edge Function 연결) |
| `/report/[id]` | 결과 요약 + 심층 리포트 탭 전환 | 통합 대상 |
| `/mypage` | 허브: 최근 리포트·레벨·추천 · 리포트 생성 | 표준 디자인 기준 |

---

## 3. DB 구조 (Supabase)

### 기존 유지

- `users`, `test_results`, `reports`

### 신규/수정

- `result_details` (내러티브·코칭·벡터 저장)
- `reports.share_token` + `share_issued_at` (공유 링크)

**뷰:** `results_v` → 기존 쿼리와 신규 스키마 호환

---

## 4. API 엔드포인트

| 경로 | 기능 |
| --- | --- |
| `POST /api/analyze/queue` | 입력 검증 후 엔진 큐잉 |
| `GET /api/analyze/status?jobId` | 진행상태 조회 |
| `GET /api/result/:id` | 결과 조회 + 권한 체크 |
| `POST /api/share/:id` | 소유자 검증 후 share_token 발급 |
| `POST /api/pdf/:id` | PDF 생성 요청 (html2pdf MVP) |
| `POST /api/event` | 이벤트 로깅 + rate limit 적용 |

---

## 5. 보안 / 권한

- 리포트 조회: 소유자 or 유효 share_token
- Stripe active 검증 middleware 필수
- Edge Functions 서비스 키 노출 금지
- `POST /api/analyze/queue` → 사용자 3회/일 , IP 10회/일 제한

---

## 6. UI / 디자인 시스템

### 공통 레이아웃

```
/app/(user)/layout.tsx   → 헤더, Footer 공통
```

### 배경 · 테마

- `bg-gradient-to-b from-[#0a0f1f] to-[#111827]`
- 카드: `bg-[#1a2035]/90 rounded-2xl shadow-lg border border-[#2a3355]`
- 포인트컬러: Violet 500 / Cyan 400
- 버튼: `rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 hover:opacity-90`

### 폰트

- Pretendard 500–700, text-slate-200, opacity 0.8
- 폰트크기 : 타이틀 `text-xl`, 본문 `text-sm~base`

---

## 7. 컴포넌트 아키텍처

```
/components/
 ├─ layout/
 │  ├ PageContainer.tsx
 │  ├ PageHeader.tsx
 │  ├ RightSidebar.tsx
 │  └ SectionCard.tsx
 ├─ report/
 │  ├ ReportSummary.tsx
 │  ├ ReportDetails.tsx
 │  ├ ReportCTA.tsx
 │  └ TabsReport.tsx
 └─ mypage/
     ├ MyReportsList.tsx
     ├ SubscriptionStatus.tsx
     └ CreateReportDialog.tsx
```

---

## 8. 시각화 / 리포트

- Recharts 로 Big5 Radar + Growth Vector
- SVG 저장 → Supabase Storage(`reports/{id}/charts/*.svg`)
- PDF : 클라이언트 html2pdf (MVP), 서버 렌더링은 차후

---

## 9. UX 플로우 (로그인 후)

```
로그인 → /mypage
  ↓
최근 리포트 클릭 → /report/[id]
  ↳ 요약 / 심층 탭 전환
  ↳ 공유 버튼 → share_token 발급 → /report/[id]?t=TOKEN
  ↳ 리포트 생성하기 → 모달 열림 → 신규 분석 시작
```

---

## 10. 개발 순서 (실행 플랜)

1. SQL : `result_details` · `reports.share_token` 마이그레이션 적용
2. `/api/event` · `/api/share/:id` 라우트 활성
3. 공통 레이아웃 추출(`/layout.tsx`)
4. `/mypage` 리디자인 + Dialog 통합
5. `/report/[id]` 탭형 리포트 화면 통합
6. Stripe status 검증 middleware 추가
7. 시각화 컴포넌트 통합 및 테마 적용

---

## 11. 검증 체크리스트

- ✅ 401/403 권한 동작 정상
- ✅ share_token 발급 → URL 접근 200
- ✅ Storage SVG 200 응답
- ✅ 이벤트 로그 POST OK
- ✅ 리포트 생성 모달 정상
- ✅ PDF 한글 폰트 렌더링 정상
- ✅ UI 톤·버튼·여백 일관성 유지

---

## 12. 디자인 시스템 — 기준 출처 / 적용 범위

| 요소 | 기준 출처 | 적용 범위 |
| --- | --- | --- |
| 배경 컬러 / 톤 | 마이페이지의 딥 네이비–블랙 그라데이션 | `bg-gradient-to-b from-[#0a0f1f] to-[#111827]` 통일 |
| 카드 스타일 | 마이페이지 Glass형 리포트 카드 | `bg-[#1a2035]/90`, `border-[#2a3355]`, `rounded-2xl` |
| 폰트 / 색상 | 마이페이지 텍스트 대비 비율 | `text-slate-200`, opacity 80, Pretendard 500~700 |
| 버튼 스타일 | “재검사하기 / 상세 리포트” 버튼 계열 | `bg-gradient-to-r from-violet-500 to-cyan-500` |
| 그래프 컬러 | Big5 / 성장 벡터 동일 팔레트 | Violet 400, Cyan 300, Emerald 400 |
| 사이드바 / 레이아웃 | 마이페이지 우측 활동 카드 구조 | `/report/[id]` 에 `RightSidebar.tsx` 재사용 |
| 배경 명암비 | 마이페이지 카드 대비 | 모든 페이지 동일 contrast 유지 |

> UI 테마 주도권: /mypage → /report/[id] → 리포트 생성 모달 순으로 확장.  
> 반응형 격자: flex gap-6 + grid-cols-12 패턴을 전역에서 재사용.

---

이 문서는 InnerMap AI v2 기능/디자인/데이터/플로우/검증을 통합한 1차 마스터 플랜이다.  
이 버전을 기준으로 모든 페이지·DB·API·UI 작업을 일관된 기준으로 진행한다.


