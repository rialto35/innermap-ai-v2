# 🧬 Hero Analysis System - 완성 가이드

## 📋 개요

InnerMap AI v2의 핵심 기능인 **영웅 세계관 기반 성격 분석 시스템**이 완성되었습니다!

### 주요 기능
- ✅ **GPT-4o 기반 AI 분석** - 영웅 세계관 프롬프트
- ✅ **Big5 성격 검사 통합** - TypeScript로 새로 작성
- ✅ **섹션별 리포트** - 7단계 구조화된 분석
- ✅ **Fallback 시스템** - API 키 없어도 동작
- ✅ **Markdown 다운로드** - 결과 저장 기능

---

## 📁 파일 구조

```
src/
├── lib/
│   ├── prompts/
│   │   └── systemPrompt.ts           # 영웅 분석 시스템 프롬프트
│   ├── ai/
│   │   └── heroAnalysis.ts           # AI 분석 핵심 로직
│   └── calculateBig5.ts              # Big5 점수 계산
├── app/
│   ├── api/
│   │   └── hero-analysis/
│   │       └── route.ts              # Hero Analysis API
│   └── test-hero-analysis/
│       └── page.tsx                  # 테스트 페이지
├── components/
│   ├── Big5Test.tsx                  # Big5 검사 컴포넌트
│   └── HeroAnalysisReport.tsx        # 분석 결과 표시
├── hooks/
│   └── useHeroAnalysis.ts            # React Hook
└── data/
    └── big5.json                     # Big5 문항 데이터
```

---

## 🚀 빠른 시작

### 1. 환경 변수 설정

`.env.local` 파일에 OpenAI API 키 추가:

```bash
OPENAI_API_KEY=sk-your-api-key-here
```

### 2. 개발 서버 실행

```bash
npm run dev
```

### 3. 테스트 페이지 접속

```
http://localhost:3000/test-hero-analysis
```

---

## 💡 사용 방법

### API 직접 호출

```typescript
// POST /api/hero-analysis
const response = await fetch('/api/hero-analysis', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    mbti: 'ENTP',
    enneagram: 7,
    big5: {
      openness: 85,
      conscientiousness: 45,
      extraversion: 70,
      agreeableness: 60,
      neuroticism: 35
    },
    colors: ['터콰이즈', '퍼플', '오렌지'],
    birthDate: '1990-05-15'
  })
});

const data = await response.json();
console.log(data.data); // HeroAnalysisResult
```

### React Hook 사용

```tsx
import { useHeroAnalysis } from '@/hooks/useHeroAnalysis';

function MyComponent() {
  const { analyze, result, loading, error } = useHeroAnalysis();

  const handleAnalyze = async () => {
    await analyze({
      mbti: 'INFJ',
      enneagram: 4,
      colors: ['인디고', '퍼플']
    });
  };

  return (
    <div>
      {loading && <p>분석 중...</p>}
      {error && <p>에러: {error}</p>}
      {result && <HeroAnalysisReport result={result} />}
    </div>
  );
}
```

---

## 📊 데이터 구조

### 입력 (HeroAnalysisInput)

```typescript
interface HeroAnalysisInput {
  mbti: string;           // 필수: "ENTP"
  enneagram: number;      // 필수: 1-9
  big5?: {                // 선택
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  colors: string[];       // 필수: ["터콰이즈", "퍼플"]
  birthDate?: string;     // 선택: "1990-05-15"
}
```

### 출력 (HeroAnalysisResult)

```typescript
interface HeroAnalysisResult {
  section0_revelation: string;    // [0] 영웅 공개
  section1_continent: string;     // [1] 대륙의 기운
  section2_identity: string;      // [2] 영웅의 정체성
  section3_strengths: string;     // [3] 영웅의 강점
  section4_shadows: string;       // [4] 그림자 영역
  section5_quests: string;        // [5] 성장 퀘스트
  section6_declaration: string;   // [6] 영웅의 선언
  fullReport: string;             // 전체 리포트 (Markdown)
}
```

---

## 🎨 세계관 요소

### 대륙 (12가지 컬러)

| 컬러 | 이모지 | 상징 | 고유 능력 |
|------|--------|------|----------|
| 터콰이즈 | 🏔️ | 물/샘 | 독립력 |
| 옐로우그린 | 🌸 | 꽃 | 관찰력 |
| 오렌지 | 🍃 | 바람 | 표현력 |
| 레드오렌지 | 🍎 | 과실 | 개혁력 |
| 옐로우 | ☀️ | 하늘 | 선견력 |
| 인디고 | 🌊 | 바다 | 이해력 |
| 마젠타 | 🌍 | 대지 | 포용력 |
| 블루 | 🌙 | 달 | 소통력 |
| 블루그린 | 🌏 | 지구 | 균형력 |
| 레드 | ☀️ | 태양 | 행동력 |
| 그린 | 🌲 | 숲 | 안정력 |
| 퍼플 | 🌌 | 우주 | 직관력 |

### 영웅 타입 (144가지)

- **MBTI 16가지** × **에니어그램 9가지** = 144 조합
- Big5 점수로 미세 조정
- 예시:
  - `ENTP × 타입7 × 개방성 高` → "전략적 탐험가"
  - `INFJ × 타입4 × 친화성 高` → "신비로운 예술가"

---

## 🔧 API 엔드포인트

### POST /api/hero-analysis

#### Request
```json
{
  "mbti": "ENTP",
  "enneagram": 7,
  "big5": {
    "openness": 85,
    "conscientiousness": 45,
    "extraversion": 70,
    "agreeableness": 60,
    "neuroticism": 35
  },
  "colors": ["터콰이즈", "퍼플", "오렌지"],
  "birthDate": "1990-05-15"
}
```

#### Response (성공)
```json
{
  "success": true,
  "data": {
    "section0_revelation": "...",
    "section1_continent": "...",
    "section2_identity": "...",
    "section3_strengths": "...",
    "section4_shadows": "...",
    "section5_quests": "...",
    "section6_declaration": "...",
    "fullReport": "..."
  },
  "metadata": {
    "usedFallback": false,
    "timestamp": "2025-10-08T12:00:00.000Z",
    "inputData": {...}
  }
}
```

#### Response (에러)
```json
{
  "success": false,
  "error": "에러 메시지",
  "details": "상세 정보"
}
```

### GET /api/hero-analysis

#### Response
```json
{
  "status": "online",
  "service": "Hero Analysis API",
  "version": "2.0",
  "features": {
    "aiAnalysis": true,
    "fallbackMode": false
  },
  "endpoints": {
    "analyze": "POST /api/hero-analysis"
  }
}
```

---

## 📈 프롬프트 구조

### System Prompt 핵심 요소

1. **역할 정의** - AI가 영웅 해석 엔진임을 명시
2. **세계관 설정** - 대륙과 영웅의 관계
3. **출력 구조** - [0]~[6] 섹션 강제
4. **톤앤매너** - 2인칭, 긍정 프레이밍, 구체성
5. **금지 사항** - 의료 용어, 단정적 표현 금지

### 7단계 리포트 구조

```
[0] 영웅 공개 (100자)
  → 대륙 + 영웅 타입 + 핵심 정의

[1] 대륙의 기운 (300자)
  → 대륙의 특성과 선천적 기질

[2] 영웅의 정체성 (800자)
  → MBTI + 에니어그램 + Big5 통합 분석

[3] 영웅의 강점 (250자)
  → 3가지 핵심 강점 + 실생활 예시

[4] 그림자 영역 (250자)
  → 2가지 약점 + 성장 팁

[5] 성장 퀘스트 (250자)
  → 단기 과제 3개 + 장기 방향

[6] 영웅의 선언 (100자)
  → 마무리 메시지
```

---

## 🧪 테스트 시나리오

### 1. 기본 테스트
```bash
# 1. 서버 실행
npm run dev

# 2. 테스트 페이지 접속
http://localhost:3000/test-hero-analysis

# 3. 기본값으로 "영웅 분석 시작" 클릭

# 4. 결과 확인
- 비주얼 보기: 섹션별로 나누어진 화면
- 전체 리포트: Markdown 전체 텍스트
```

### 2. API 테스트 (cURL)
```bash
curl -X POST http://localhost:3000/api/hero-analysis \
  -H "Content-Type: application/json" \
  -d '{
    "mbti": "INTJ",
    "enneagram": 5,
    "colors": ["인디고", "퍼플"]
  }'
```

### 3. Fallback 테스트
```bash
# .env.local에서 OPENAI_API_KEY 주석 처리
# OPENAI_API_KEY=

# 서버 재시작 후 분석 실행
# → Fallback 분석 결과 확인
```

---

## 🔄 psychology/page.tsx 통합

### Step 1: Big5 통합 (이미 완료)
```tsx
// Big5Test 컴포넌트 추가
import Big5Test from '@/components/Big5Test';

// testResults에 big5 추가
const [testResults, setTestResults] = useState({
  ...
  big5: null
});
```

### Step 2: Hero Analysis 추가

```tsx
import { useHeroAnalysis } from '@/hooks/useHeroAnalysis';
import HeroAnalysisReport from '@/components/HeroAnalysisReport';

// 컴포넌트 내부
const { analyze, result: heroResult, loading: heroLoading } = useHeroAnalysis();

// 분석 트리거
const handleAnalyze = async () => {
  if (testResults.mbti && testResults.enneagram) {
    await analyze({
      mbti: testResults.mbti,
      enneagram: testResults.enneagram,
      big5: testResults.big5 || undefined,
      colors: testResults.colors?.map(c => c.name) || [],
      birthDate: testResults.birthDate || undefined
    });
  }
};

// 결과 표시
{heroResult && <HeroAnalysisReport result={heroResult} />}
```

---

## 📝 ToDo (향후 개선)

### Phase 1: 기능 확장
- [ ] 결과 DB 저장 (Supabase/Firebase)
- [ ] 이전 결과 조회 기능
- [ ] 결과 공유 (이미지/링크)
- [ ] PDF 다운로드 (jsPDF)

### Phase 2: UX 개선
- [ ] 로딩 애니메이션 강화
- [ ] 결과 차트/그래프 추가
- [ ] 모바일 최적화
- [ ] 다크모드 토글

### Phase 3: AI 고도화
- [ ] Claude 2차 검증 추가
- [ ] 프롬프트 A/B 테스트
- [ ] 사용자 피드백 학습
- [ ] 다국어 지원 (i18n)

---

## 🐛 트러블슈팅

### OpenAI API 에러
```
Error: API key not found
```
**해결:** `.env.local`에 `OPENAI_API_KEY` 추가

### 섹션 파싱 실패
```
Error: section0_revelation is empty
```
**해결:** `parseAnalysisReport` 함수의 정규식 확인

### CORS 에러 (프로덕션)
```
Access-Control-Allow-Origin missing
```
**해결:** `next.config.ts`에 CORS 설정 추가

---

## 📚 참고 자료

- [OpenAI GPT-4o API](https://platform.openai.com/docs/models/gpt-4o)
- [Big Five personality traits](https://en.wikipedia.org/wiki/Big_Five_personality_traits)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## 📄 라이선스

InnerMap AI v2 프로젝트의 일부로, 프로젝트 라이선스를 따릅니다.

**Created by:** PromptCore  
**Date:** 2025-10-08  
**Version:** 2.0.0

---

## ✅ 완성 체크리스트

- [x] System Prompt 작성
- [x] AI 분석 로직 구현
- [x] API 엔드포인트 생성
- [x] React Hook 작성
- [x] 결과 표시 컴포넌트
- [x] Big5 검사 통합
- [x] Fallback 시스템
- [x] 테스트 페이지
- [x] 문서 작성

**🎉 Hero Analysis System 완성!**

