# InnerMap AI v2 - 결과 섹션 컴포넌트

v2 프롬프트의 [0]~[6] 섹션을 개별 컴포넌트로 분리한 구조입니다.

## 📁 컴포넌트 구조

```
src/components/result/
├── HeroReveal.tsx        # [0] 영웅 공개 - 대륙과 영웅 타입 임팩트 공개
├── ContinentSection.tsx  # [1] 대륙의 기운 - 태어난 대륙의 특성
├── IdentitySection.tsx   # [2] 영웅의 정체성 - 핵심 정체성 (800자)
├── StrengthsSection.tsx  # [3] 강점 - 3가지 주요 강점
├── ShadowSection.tsx     # [4] 그림자 영역 - 과잉 패턴 + 성장 팁
├── QuestsSection.tsx     # [5] 성장 퀘스트 - 실천 과제 + 장기 방향
└── DeclarationSection.tsx # [6] 영웅의 선언 - 최종 마무리
```

## 🎨 디자인 특징

### 공통 스타일
- ✅ **글래스모피즘** (glass-card)
- ✅ **네온 효과** (neon-button)
- ✅ **페이드인 애니메이션** (각 섹션 0.1s씩 delay)
- ✅ **우주 테마 색상** (v1 스타일 유지)

### 섹션별 색상 테마
| 섹션 | 주 색상 | 이모지 |
|------|---------|--------|
| [0] HeroReveal | Purple | ✧ |
| [1] Continent | Blue | 🌍 |
| [2] Identity | Purple | ⚔️ |
| [3] Strengths | Green | ✨ |
| [4] Shadow | Orange | 🌑 |
| [5] Quests | Yellow | 🎯 |
| [6] Declaration | Purple/Pink | ✧ |

## 🔧 사용 방법

### 1. API 응답 구조

```typescript
{
  success: true,
  analysis: {
    openai: {
      sections: {
        section0_revelation: "...",
        section1_continent: "...",
        section2_identity: "...",
        section3_strengths: "...",
        section4_shadows: "...",
        section5_quests: "...",
        section6_declaration: "..."
      }
    }
  }
}
```

### 2. 컴포넌트 사용 예시

```tsx
import HeroReveal from './result/HeroReveal';
import ContinentSection from './result/ContinentSection';
// ... 나머지 import

export default function AnalysisResult({ testResults }) {
  const [analysis, setAnalysis] = useState(null);
  
  // API 호출 후...
  const sections = analysis.openai?.sections || {};
  
  return (
    <div className="space-y-8">
      <HeroReveal content={sections.section0_revelation} />
      <ContinentSection content={sections.section1_continent} />
      <IdentitySection content={sections.section2_identity} />
      <StrengthsSection content={sections.section3_strengths} />
      <ShadowSection content={sections.section4_shadows} />
      <QuestsSection content={sections.section5_quests} />
      <DeclarationSection content={sections.section6_declaration} />
    </div>
  );
}
```

### 3. Props 인터페이스

모든 섹션 컴포넌트는 동일한 props를 받습니다:

```typescript
interface SectionProps {
  content: string; // 해당 섹션의 마크다운 텍스트
}
```

## 📝 컨텐츠 파싱 규칙

### HeroReveal
- `**텍스트**` → bold 강조
- 이모지 라인 자동 감지 (🏔️, ⚔️ 등)
- `"인용구"` → 이탤릭 + 큰 폰트

### IdentitySection
- `**핵심 키워드:**` 아래 `#해시태그` 추출
- `**대표 문장:**` 아래 인용구 추출
- 메인 컨텐츠 별도 표시

### StrengthsSection
- `**1. 강점명 이모지**` 패턴 파싱
- 3개 항목을 그리드로 표시
- 호버 효과 (scale + border glow)

### ShadowSection
- `⚠️ **경고 패턴**` + `💡 **성장 팁:**` 쌍 파싱
- 경고는 오렌지, 팁은 블루 테마

### QuestsSection
- `**Quest N: 제목**` + `→ 행동 지침` 파싱
- `📚 **장기 방향**` 아래 커리어/도서/핵심과제 파싱

### DeclarationSection
- `**"영웅 타입"**` 추출
- 나머지 메시지 줄바꿈 기준 분리

## 🎯 파싱 실패 시 Fallback

각 컴포넌트는 파싱 실패 시 원본 텍스트를 표시합니다:

```tsx
{parsedData.length === 0 && (
  <div 
    className="prose prose-invert prose-lg max-w-none"
    dangerouslySetInnerHTML={{ __html: content }}
  />
)}
```

## ✨ 애니메이션

### 페이드인 타이밍
```css
[0] HeroReveal:      0.0s delay
[1] Continent:       0.1s delay
[2] Identity:        0.2s delay
[3] Strengths:       0.3s delay
[4] Shadow:          0.4s delay
[5] Quests:          0.5s delay
[6] Declaration:     0.6s delay
```

### 커스텀 애니메이션
- `fade-in-up`: 위로 떠오르는 효과
- `slideInUp`: 카드 개별 등장
- `fadeInLeft`: 왼쪽에서 등장
- `slideInRight`: 오른쪽에서 등장
- `twinkle`: 별 반짝임 효과

## 🔄 기존 코드와의 호환성

### v1 → v2 마이그레이션

**Before (v1):**
```jsx
<AnalysisResult testResults={data} />
// → 단일 컴포넌트에서 모든 것 처리
```

**After (v2):**
```tsx
<AnalysisResult testResults={data} />
// → 내부적으로 7개 섹션 컴포넌트 사용
// → API는 동일하게 유지 (props 변경 없음)
```

### 기존 기능 유지
- ✅ PDF 다운로드
- ✅ 프린트
- ✅ 텍스트 다운로드
- ✅ HeroCard 표시
- ✅ 테스트 결과 요약

## 🧪 테스트 방법

```bash
# 개발 서버 실행
npm run dev

# psychology 페이지에서 테스트 완료 후 AI 분석 실행
http://localhost:3000/psychology
```

## 📦 필요한 파일

### 1. API 엔드포인트
- `src/app/api/analyze/route.js` (v2 프롬프트 사용)

### 2. System Prompt
- `src/lib/prompts/systemPrompt.ts`

### 3. 스타일
- `src/app/globals.css` (글래스모피즘, 네온 효과)

### 4. 유틸리티
- `src/utils/pdfGenerator.js` (PDF 생성)

## 🎨 CSS 클래스 참조

### globals.css에 정의된 클래스
- `.glass-card` - 글래스모피즘 배경
- `.neon-button` - 네온 효과 버튼
- `.holographic-text` - 홀로그램 텍스트
- `.prose-invert` - 다크모드 prose

## 🐛 트러블슈팅

### 1. 섹션이 표시되지 않음
```typescript
// API 응답 구조 확인
console.log(analysis.openai?.sections);

// Fallback 확인
console.log(analysis.combined?.fullReport);
```

### 2. 파싱이 제대로 안됨
- AI 응답이 정확히 프롬프트 구조를 따르는지 확인
- 각 섹션에 `### [0]`, `### [1]` 등 헤더가 있는지 확인

### 3. 스타일이 적용 안됨
- `globals.css`에 글래스모피즘 클래스가 정의되어 있는지 확인
- Tailwind 설정 확인

## 📚 참고 문서

- [v2 System Prompt](../../lib/prompts/systemPrompt.ts)
- [API Route](../../app/api/analyze/route.js)
- [메인 컴포넌트](../AnalysisResult.tsx)

