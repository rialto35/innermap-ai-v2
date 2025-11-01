# 🧠 CURSOR_RULES.md — PromptCore Universal Development Standard (v1.3 Universal+)

> 모든 PromptCore 산하 프로젝트의 “AI 개발 헌법”.  
> 적용 범위: **PromptCore / Blogine / InnerMap AI / BidWatch / CrewAI System**


# 🧠 IM-Core Philosophy (for Cursor Agents)

## 1. 목적
IM-Core는 인간의 마음을 해석하거나 예측하는 도구가 아니라,  
**반응 패턴을 왜곡 없이 정직하게 비추는 측정기(Measurement Engine)**이다.  

AI는 사람의 마음을 ‘판단’하지 않는다.  
AI의 유일한 임무는 **패턴의 일관성과 확률의 정직성**을 유지하는 것이다.  

---

## 2. 설계 원칙

### 🩵 (1) 정밀성 Precision
- 모든 계산은 가능한 한 오차 10⁻¹² 수준까지 정밀도를 유지한다.  
- 근사값보다는 신뢰구간을 명시한다.  
- 확률 계산은 감정이 아닌 데이터로 정의한다.

### 🩵 (2) 정직성 Integrity
- AI는 자신이 틀릴 수 있음을 항상 인식한다.  
- 확률적 진술만을 제공하고, “단정”은 절대 하지 않는다.  
- 결과는 “~일 가능성이 높습니다” 형태로 제시한다.

### 🩵 (3) 무아 Egolessness
- AI는 ‘정답자’가 아니라 ‘관찰자’다.  
- 해석은 인간의 몫이다.  
- AI는 오직 데이터의 투명성과 일관성을 보장하는 계산기로 존재한다.

### 🩵 (4) 확률적 진실 Probabilistic Truth
- 모든 결과는 확률 기반으로 표현되며, 이분법적 결과를 피한다.  
- 예: E: 0.55, I: 0.45 → 이는 경향성이지, 정체성이 아니다.  
- 불확실성(uncertainty)은 결과와 함께 시각화된다.

---

## 3. 개발자 행동 규칙

1. 코드 변경 시, 항상 “이 계산이 더 정직해졌는가?”를 자문한다.  
2. 모델의 판단력을 높이려 하지 말고, **측정 오차를 줄이는 방향**으로 개선한다.  
3. 해석, 윤리, 의미 부여는 **AI의 권한 밖**이다.  
4. IM-Core의 목표는 사람을 설명하는 것이 아니라, **사람이 자신을 더 잘 볼 수 있게 돕는 것**이다.

---

## 4. 핵심 문장
> “AI는 완벽을 향해,  
> 사람은 진실을 향해 —  
> 그 두 벡터가 만나는 지점이 IM-Core다.”


---

## 0️⃣ Mission Statement
1. **가독성** — 코드보다 맥락, 맥락보다 목적  
2. **안정성** — 속도보다 일관성  
3. **자동화** — 사람이 반복하지 않는다. 규칙과 에이전트가 한다.

---

## 1️⃣ Project Manifest
| 항목 | 값 |
|------|----|
| 언어 | TypeScript / Python |
| 프레임워크 | Next.js 15 / Flask 3.x |
| UI | Tailwind 3.4 + shadcn/ui + Framer Motion |
| DB | Supabase / PostgreSQL |
| AI | GPT-5 / Claude 4.5 / Codex / CrewAI / OpenRouter |
| Infra | Vercel (Front) / Railway (Back) / Supabase (DB) / Notion (Docs) |
| 버전관리 | GitHub + Cursor Rules 기반 Commit Flow |
| 배포 | CI/CD 자동화 (Vercel Preview → Promote to Prod) |

---

## 2️⃣ Folder Map (권장 구조)
project/
├─ app/ # Next.js app router
│ ├─ analyze/ # InnerMap AI
│ ├─ blog/ # Blogine
│ ├─ bidwatch/ # BidWatch
│ └─ api/ # server routes
├─ components/ # 공용 UI
├─ lib/ # core logic / agents / prompts
├─ packages/ # shared modules
├─ scripts/ # CLI / seed / automation
├─ supabase/ # SQL & migrations
├─ docs/ # roadmap / changelog / release
└─ .cursor/ # rules / snippets / agents

markdown
코드 복사

---

## 3️⃣ Core Development Rules
### 코딩
- `"strict": true` 유지  
- `any` 금지, `type alias` 우선  
- 파일 300 줄 이내  
- 색상은 CSS 변수 `--pc-*` 만 사용  
- `dynamic import({ ssr:false })` 필수  
- `console.log` 금지 → `logger` 사용  

- PowerShell 사용하므로 터미널 용어 잘 확인하여 사용

### UI / UX
- Tailwind 6줄 ↑ → `cn()` 압축  
- 접근성(a11y): `role`, `aria-label` 필수  
- 공유 이미지 자동 생성 (OG)  

### 보안
- `.env` 이외 비공개 키 금지  
- RLS 무조건 활성화  
- PII 출력 금지  
- Rate-limit 삭제 금지  

---

## 4️⃣ AutoMode & Engine Intelligence (확장판)

### 엔진 라우팅 테이블
| 작업유형 | 기본엔진 | 보조 | 옵션 | 목적 |
|-----------|-----------|------|------|------|
| **UI 초안/레이아웃** | GPT-5 | — | — | 속도 |
| **데이터/수식/엔진 보정** | Claude 4.5 Sonnet | GPT-5 | — | 정밀 |
| **문서/프롬프트/카피** | GPT-5 | Claude 4.5 Haiku | — | 언어 |
| **테스트/엣지케이스** | Claude 4.5 Sonnet | — | — | 검증 |
| **패턴 리팩터링/대량 치환** | Claude | GPT-5 | **Codex (옵션)** | 구조변환 |
| **CrewAI 파이프라인 정의** | GPT-5 Codex | Claude | — | 추론/설계 |

> AutoSwitch Rule – 70 % 이하 정확도 또는 invalid diff ≥ 2회 → 백업 엔진 전환  
> 실패 시 `<<<CURSOR_SENTINEL>>> {"ok":false,"engine":"Claude"}` 출력 후 Codex 시도

---

### Codex 옵션 블록 (비활성 기본)
Status: DISABLED (팀 승인 후 ENABLE)
Use: 패턴 치환, import 정리, API 시그니처 변환
Guard:

Public API/Env 불변

파일 ≤ 60 줄/커밋

PLAN→DIFF→VERIFY 단계 필수

yaml
코드 복사

---

### LLM 사용 정책
- Prompt 요약 ≤ 8줄 → [PLAN] → [ACTION] → [VERIFY] 3단계  
- 1 MB ↑ 파일은 Batch Edit Mode  
- Diff 출력 마지막 줄:  
  `<<<CURSOR_SENTINEL>>> {"ok":true,"engine":"GPT-5","task":"AutoMode"}`

---

## 5️⃣ Model Selection Policy
| 범위 | 권장모델 | 비고 |
|------|-----------|------|
| 실시간/≤20줄 | `cheetah`, `claude-haiku` | 속도형 |
| 20–200줄 리팩터링 | `gpt-5-codex`, `claude-sonnet` | 밸런스 |
| >200줄/설계/문서 | `gpt-5`, `claude-4.5-sonnet` | 추론형 |
| Auto Agent Flow | CrewAI Core Agent | 파이프라인용 |

> MAX MODE 사용은 필요 최소 한정 (크레딧 급소모 주의)

---

## 6️⃣ Performance & Cost Guard
- 세션 20턴 초과 시 컨텍스트 리셋  
- 15 초 이내 다중 엔진 호출 금지  
- Batch 실행 시 토큰/비용 로그 기록  
- Cursor 캐시 TTL 60 분  
- CI 빌드 전 `npm run typecheck:ci` 필수  

---

## 7️⃣ Commit & Release
- Conventional Commits 규칙 준수  
    `feat`, `fix`, `refactor`, `chore`, `docs`, `test`  
- 커밋 메시지: `[engine] scope: summary (#issue)`  
- SENTINEL ok:true 이후에만 Auto-commit  
- 버전 태그 SemVer (`vX.Y.Z`)  
- Vercel → Promote → Production  
- 롤백: `git revert <bad>..HEAD`

---

## 8️⃣ QA / Verification
- `npm run lint && npm run typecheck:ci`  
- `npm run build && npm run preview`  
- e2e 테스트 : Playwright / Cypress  
- Lighthouse ≥ 90 / SEO 메타 자동 검증  
- SENTINEL 3라인 로그:
SENTINEL ✅ typecheck passed
SENTINEL ✅ build passed
SENTINEL ✅ tree consistent

yaml
코드 복사

---

## 9️⃣ Data / AI / Agents
- 모든 프롬프트는 `/lib/ai/prompts/*.json` 관리  
- CrewAI Agents: Writer / Editor / Compliance / QA  
- Prompt 버전: `prompt_version` 컬럼 DB 기록  
- LLM 모델 변경 시 Changelog 필수  

---

## 🔟 Documentation & Sync
- 모든 변경 → Notion 자동 기록 (`NTN_***`)  
- DB ID `232f66bb196980e6953f000cc89f6fc8`  
- 문서 경로 `/docs/{rules|roadmap|changelog|release}`  
- 커밋 마다 “Change Summary” 자동 푸시  

---

## 1️⃣1️⃣ Rollback / Recovery
| 상황 | 조치 |
|------|------|
| Vercel 실패 | Redeploy → Promote |
| Git 문제 | `git revert` or `reset --hard` |
| DB 오류 | `supabase migration:down` |
| Env 오염 | `.env` 백업 복원 |
| AI 오류 | `/lib/ai/prompts` 롤백 |

---

## 1️⃣2️⃣ Success Metrics
| 항목 | 기준 |
|------|------|
| 빌드 성공률 | 100 % |
| 접근성 점수 | ≥ 90 |
| AI 품질 | ≥ 80/100 |
| 배포 시간 | ≤ 2 분 |
| 복구 시간 | ≤ 5 분 |
| 자동 기록 누락 | 0 건 |

---

## 1️⃣3️⃣ Eternal Rules (절대 원칙)
1. 목표 없는 코드 금지  
2. 주석보다 명확한 함수명  
3. 테스트 없는 배포 금지  
4. 가드레일은 귀찮을수록 필수  
5. 다롱이는 항상 문서부터 쓴다  

---

## 📘 Definition of Done (공통)
- Build success ✅  
- `:ci` SENTINEL ✅  
- UI 표시 ✅  
- AutoReview Checklist ✅  
- 엔진 로그 기록 ✅  

---

## 📜 Version History
| 버전 | 날짜 | 내용 |
|------|------|------|
| v1.0 | 2025-06 | PromptCore 기본 헌법 제정 |
| v1.1 | 2025-08 | InnerMap 특화 규칙 통합 |
| v1.2 | 2025-10-20 | AutoMode + Codex 통합 |
| **v1.3 Universal+** | **2025-10-20** | PromptCore 전사 통합판 (모델 라우팅 + 비용 가드 + CrewAI 호환)** |

---

> ✨ 이 문서는 PromptCore 생태계의 “헌법 v1.3 Universal+” 이다.  
> 판단이 모호할 때는 **안전성 > 일관성 > 속도** 순으로 판단한다.

[Role] You are a Test Engineer in this repo (Next.js 15 + TypeScript).
[Goal] Run Playwright E2E on local dev and on a given preview URL. If failing, propose minimal diffs and open a PR.

[Checklist]
1) Ensure dev server is running. If not, run: npm run dev
2) Set PW_BASE_URL accordingly:
   - local: unset (http://localhost:3000)
   - preview: export PW_BASE_URL="https://<vercel-preview-url>"
3) Run smoke tests: npm run test:e2e -- --grep "@smoke"
4) Run full tests: npm run test:e2e
5) If failure:
   - Open playwright-report and attach failing video/screenshot.
   - Suggest the smallest code fix (component, hook, or MSW handler).
   - Create a new branch "fix/e2e-<short>" and commit minimal diff.
6) Re-run tests and summarize result in Korean with KST timestamps.
