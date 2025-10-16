# 🧠 CURSOR_RULES.md — PromptCore Universal Development Standard

## 0. Mission Statement
모든 PromptCore 산하 프로젝트(예: Blogine, InnerMap, BidWatch)는 다음 세 가지 원칙으로 개발한다:
1. **가독성**: 코드보다 맥락이 먼저, 맥락보다 목적이 먼저.
2. **안정성**: 기능 추가보다 일관된 규칙 유지.
3. **자동화**: 사람이 반복하지 않는다 — 규칙과 에이전트가 한다.

---

## 1. Project Manifest
| 항목 | 값 |
|------|------|
| 언어 | TypeScript / Python |
| 프레임워크 | Next.js 15, Flask 3.x |
| UI | TailwindCSS 3.4, shadcn/ui, Framer Motion |
| DB | Supabase / PostgreSQL |
| AI | GPT-5 / Claude / CrewAI / OpenRouter |
| Infra | Vercel (Front), Railway (Back), Supabase (DB), Notion (Docs) |
| 버전관리 | GitHub + Cursor Rules 기반 체계적 Commit |
| 배포 | CI/CD 자동화 (Vercel Preview → Promote to Production) |

---

## 2. Folder Map (권장 구조)
```
project/
├─ app/ # Next.js app router (routes)
│ ├─ test/ # InnerMap 검사 흐름
│ ├─ r/[sessionId]/ # 결과 페이지
│ ├─ me/ # 마이페이지 / 로그인 필요
│ └─ api/ # 서버 routes
├─ components/ # 재사용 UI
├─ lib/ # core logic (im-core, prompt-engine 등)
├─ supabase/ # SQL 및 migrations
├─ scripts/ # CLI / seed / automation
├─ public/ # 정적 리소스
├─ styles/ # globals.css, theme.css
└─ cursor/ # rules, scaffolds, agents
```

---

## 3. Core Development Rules
### 3.1 코딩 규칙
- TypeScript strict 모드 유지 (`"strict": true`)
- any 금지, interface 대신 type alias 우선
- 파일 하나당 300줄 이하
- CSS 색상은 **CSS 변수(--pc-*)**만 사용
- dynamic import 시 반드시 `{ ssr: false }`
- console.log 금지 (logger 사용)
- 함수/컴포넌트명: PascalCase, 파일명: kebab-case

### 3.2 UI / UX
- Tailwind는 class 6줄 이상 시 `cn()`으로 압축
- a11y: 버튼에는 `role` / `aria-label` 필수
- prefers-reduced-motion 미디어쿼리 존중
- OG 이미지: `/r/[id]` 및 `/me` 공유 시 자동 생성

### 3.3 보안 규칙
- API 키는 `.env` 외 노출 금지
- 클라이언트 번들 내 secret 노출 금지
- DB 마이그레이션 시 파괴적 변경 금지
- RLS (Row Level Security) 무조건 활성화
- Rate limit 삭제 금지
- 개인정보(PII) 콘솔 출력 금지

---

## 4. Step Template (작업 단위)
모든 에이전트/개발자는 아래 구조로 작업한다.

**Goal**
한 문장으로 정의된 작업 목표

**Tasks**
- 세부 작업 1
- 세부 작업 2

**Rules**
- 반드시 Cursor Rules와 일치
- 금지 항목 위반 금지
- 변경 전후 DoD 기록

**DoD (Definition of Done)**
- npm run typecheck:ci
- npm run build
- npm run tree:ci
(SENTINEL 로그 3개 반드시 첨부)

---

## 5. Prohibited
- 라우트 구조 변경 (`/test`, `/r/[id]`, `/me` 유지)
- 하드코딩된 비밀키, 절대경로
- 대규모 포맷/패키지 업그레이드
- any / unknown 남용
- 파괴적 DB 변경
- AI 프롬프트 삭제
- Tailwind 색상 직코딩

---

## 6. Commit & Release
- Conventional Commits 규칙 적용:
  - feat: 새로운 기능  
  - fix: 버그 수정  
  - chore: 설정, 의존성 변경  
  - refactor: 리팩터링  
  - docs: 문서 수정  
  - test: 테스트 코드 추가  
- 버전 태그: `vX.Y.Z` (SemVer)
- 배포: Vercel → Promote to Production
- 롤백: `git revert <bad>..HEAD`

---

## 7. Verification & QA
- `npm run lint && npm run typecheck:ci`
- `npm run build`
- `npm run preview`
- e2e 테스트: Playwright / Cypress
- Lighthouse 접근성 점수 ≥ 90
- SEO 메타 자동 생성 확인

---

## 8. Data & AI
- 모든 AI 프롬프트는 `/lib/ai/`에 JSON 스키마로 관리  
- 예시:
```
lib/ai/prompts/
├─ blogine.json
├─ innermap.json
└─ bidwatch.json
```
- CrewAI / LangChain 설정 시 Agent별 역할 정의서 포함:
```
agents/
├─ WriterAgent.ts
├─ EditorAgent.ts
├─ ProofreaderAgent.ts
└─ ComplianceAgent.ts
```
- 프롬프트 버전은 `prompt_version` 컬럼으로 DB 기록

---

## 9. Documentation & Sync
- 모든 주요 변경사항은 Notion 자동 기록:
- Integration Token: `NTN_***`
- Database ID: `232f66bb196980e6953f000cc89f6fc8`
- Docs 저장 경로:
```
docs/
├─ rules/
├─ roadmap/
├─ changelog/
└─ release-notes/
```
- 매 커밋마다 "Change Summary" 자동 푸시
- 마이그레이션은 SQL + 문서 병행

---

## 10. Rollback & Recovery
| 상황 | 조치 |
|------|------|
| Vercel 오류 | Deployments → Ready → Promote |
| Git 오류 | `git revert` or `git reset --hard` |
| DB 오류 | `supabase migration:down` |
| Env 오염 | `.env` 백업 복원 |
| 프롬프트 오작동 | `/lib/ai/prompts` 버전 롤백 |

---

## 11. Success Metrics
| 항목 | 기준 |
|------|------|
| 빌드 성공률 | 100% |
| 접근성 점수 | ≥ 90 |
| AI 품질 점수 | ≥ 80/100 |
| 배포 시간 | ≤ 2분 |
| 오류 복구 | ≤ 5분 |
| 자동 기록 누락 | 0건 |

---

## 12. Eternal Rules (절대 원칙)
1. 목표 없는 코드 금지  
2. 주석보다 명확한 함수명  
3. 테스트 없는 배포 금지  
4. 가드레일은 귀찮을수록 필수  
5. 다롱이는 항상 문서부터 쓴다  

```
SENTINEL ✅ typecheck passed
SENTINEL ✅ build passed
SENTINEL ✅ project tree consistent
```

---

> ✨ 이 문서는 PromptCore, InnerMap, Blogine, BidWatch 등 모든 제품의 **개발憲法(헌법)**이다.
> 규칙이 모호할 때는 '안전성 > 생산성 > 속도' 순으로 판단한다.

---

# 🎯 InnerMap AI v2 — 프로젝트 특화 규칙

## 프로젝트 개요
- **Next.js 14 + TypeScript + Tailwind + NextAuth + Supabase**
- **AI 기반 심리 분석 플랫폼**
- **5분 만에 나만의 영웅 리포트 생성**

## ✅ DO  — 안전한 작업 원칙
- **Minimal diffs**: 작은 단위의 변경만 수행하고, 커밋 전 항상 검토할 것.
- **Reviewable commits**: 의미 있는 단위로 나누고, 커밋 메시지를 명확히 작성.
- **Ask before risky changes**: 프로젝트 구조·빌드·환경 변수 관련 변경 전 반드시 확인.
- **Charts**: `recharts@^2` 유지. 모든 차트는 `dynamic import`(`ssr:false`)로 클라이언트 전용 처리하며 고정 높이 컨테이너 사용.
- **PostCSS**: 최소 구성(`tailwindcss`, `autoprefixer`만 허용).
- **Routes**: `/analyze` 및 `/analyze/[mode]` 라우트 유지. “검사 시작” 시 `StartTestCTA` 다이얼로그 호출.
- **:ci scripts**: 빌드 시 SENTINEL 라인을 출력하고 올바른 코드로 종료(:ci 스크립트 형태 유지).
- **Env templates**: `.env.example` 은 항상 최신 상태로 유지, `NEXT_PUBLIC_` 접두 변수만 공개용.
- **Localization**: 모든 텍스트/레이블은 `ko-KR` 기준으로 관리.
- **Protected files**: `.cursorrules`, `.cursor/`, `.env.local`, `.env.example`, `.cursorrules.backup` 은 삭제/이동 금지.

---

## 🚫 DO NOT  — 금지 및 제한 항목
- ❌ **보안/환경 변수 변경 금지**
  - `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXTAUTH_SECRET` 등 핵심 키는 수정 금지.
  - `.env.local` 은 절대 커밋 금지.
- ❌ **npm audit fix --force 금지**
  - 종속성 자동 업그레이드는 잠재적 충돌을 유발하므로 사용 금지.
- ❌ **Recharts/Core Config 제거 금지**
  - `recharts` 또는 핵심 설정(`tailwind.config.js`, `next.config.mjs`, `postcss.config.js`) 삭제·교체 금지.
- ❌ **레이아웃·환경키·경로 이름 변경 금지**
  - `layout.tsx`, `config/*`, `.env*` 등의 파일명/키 이름 수정 금지.
- ❌ **장시간 서버 실행 금지**
  - 테스트 단계에서 `npm run dev` 등 장시간 서버를 CI 단계에서 실행하지 말 것.
- ❌ **자동 파일 삭제 금지**
  - `.cursorrules`, `.cursor/`, `.env.example`, `.env.local`, `.cursorrules.backup` 파일 삭제·이동 금지.
- ❌ **대규모 리팩터링 자동화 금지**
  - 자동 도구가 프로젝트 구조 전체를 재작성하거나 대량 수정하는 행위 금지.
- ❌ **TypeScript/ESLint 설정 임의 변경 금지**
  - `tsconfig.json`, `.eslintrc.*` 는 승인 없이 수정 금지.

---

## ⚙️ Notes
- 본 규칙은 InnerMap AI v2 환경 기준으로 작성되었으며,  
  Cursor·Copilot·Claude 등 AI 에디터가 **자동 수정 시 반드시 이 규칙을 준수해야 함**.
- 모든 핵심 설정 파일 삭제 시 **빌드 실패 트리거**가 작동하도록 CI에서 검증함.


## Conventions
- ko-KR primary, en-US secondary labels.
- Version flag (placeholder): ANALYSIS_VERSION=v1.0
- Folders: /scripts, /src/components, /app/analyze, /docs
- Definition of Done: build passes, :ci outputs SENTINEL, feature visible in UI.

## Logging/Completion
- For checks (typecheck/lint/tree), always run npm scripts ending with :ci.
- Print `<<<CURSOR_SENTINEL>>> {"ok":...}` on success/fail and exit with real code.

## ⚡ Performance tweak
- Limit input tokens to 2000 for code completion.
- Summarize long diffs before sending context.
- Skip file content > 5000 lines unless explicitly requested.

## Model selection policy
- Use `cheetah` for inline code suggestions (<20 lines)
- Use `gpt-5-codex` for refactors or architecture reasoning (>20 lines)
- Use `claude-4.5-sonnet` for documentation or translation tasks


## 🧠 모델 선택 정책 (지시)
- 실시간/짧은 수정(≤20줄): 속도형 모델 사용 (예: cheetah, 또는 동급)
- 파일·컴포넌트 리팩터링(20~200줄): 밸런스형 모델 사용 (예: claude-4.5-haiku, gpt-4.1, 또는 동급)
- 대규모 리팩터링·설계(>200줄) / 설명문 생성: 추론형·고성능 모델 사용 (예: gpt-5, claude-4.5-sonnet, gpt-5-codex, 또는 동급)
- 최대 문맥 필요 시에만 MAX MODE 사용 (크레딧 급소모 주의)
- API 키가 활성화돼 있으면 외부 API 우선 호출됨 → 충돌/오류 시 내부 모델로 폴백

