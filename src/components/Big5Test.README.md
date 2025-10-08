# 🧬 Big5 성격 검사 컴포넌트

## 📋 개요

Big5 (5요인 성격 모델) 검사를 구현한 TypeScript React 컴포넌트입니다.
MBTITest.jsx의 UI/UX 스타일을 계승하면서 더 현대적인 TypeScript로 작성되었습니다.

## 🎯 Big5 성격 5요인

1. **개방성 (Openness)** - 새로운 경험과 아이디어에 대한 개방성
2. **성실성 (Conscientiousness)** - 목표 지향적이고 조직적인 성향
3. **외향성 (Extraversion)** - 사회적 상호작용과 활동성
4. **친화성 (Agreeableness)** - 타인에 대한 배려와 협조성
5. **신경성 (Neuroticism)** - 정서적 안정성과 스트레스 대처

## 📁 파일 구조

```
src/
├── components/
│   ├── Big5Test.tsx              # 메인 컴포넌트
│   ├── Big5Test.example.tsx      # 사용 예시
│   └── Big5Test.README.md        # 이 문서
├── data/
│   └── big5.json                 # 검사 문항 및 특성 데이터
└── lib/
    └── calculateBig5.ts          # 점수 계산 로직
```

## 🚀 사용법

### 기본 사용

```tsx
import Big5Test from '@/components/Big5Test';
import type { Big5Scores } from '@/lib/calculateBig5';

function MyPage() {
  const handleComplete = (scores: Big5Scores) => {
    console.log(scores);
    // {
    //   openness: 75,
    //   conscientiousness: 60,
    //   extraversion: 45,
    //   agreeableness: 80,
    //   neuroticism: 30
    // }
  };

  return <Big5Test onComplete={handleComplete} />;
}
```

## 📊 데이터 구조

### Big5Scores 타입

```typescript
interface Big5Scores {
  openness: number;          // 0-100
  conscientiousness: number; // 0-100
  extraversion: number;      // 0-100
  agreeableness: number;     // 0-100
  neuroticism: number;       // 0-100
}
```

### 질문 데이터 (big5.json)

```json
{
  "traits": {
    "openness": {
      "name": "개방성",
      "nameEn": "Openness",
      "description": "새로운 경험과 아이디어에 대한 개방성",
      "high": "창의적이고 호기심 많으며 새로운 경험을 즐깁니다",
      "low": "전통적이고 실용적이며 익숙한 것을 선호합니다"
    },
    ...
  },
  "questions": [
    {
      "id": 1,
      "question": "새로운 아이디어와 창의적인 활동을 즐긴다",
      "trait": "openness",
      "reverse": false
    },
    ...
  ]
}
```

## 🎨 UI 특징

### 우주 테마 디자인
- MBTITest.jsx의 스타일 계승
- 그라데이션 버튼 (5점 척도별 다른 색상)
- 진행률 표시 바
- 부드러운 애니메이션

### 5점 척도 버튼

| 점수 | 라벨 | 색상 |
|------|------|------|
| 5 | 매우 그렇다 | 초록 (Green) |
| 4 | 그렇다 | 파랑 (Blue) |
| 3 | 보통이다 | 회색 (Gray) |
| 2 | 아니다 | 주황 (Orange) |
| 1 | 전혀 아니다 | 빨강 (Red) |

## ⚙️ 점수 계산 로직

### 역문항 처리
```typescript
// 역문항 (reverse: true)일 경우
const score = reverse ? 6 - answer : answer;
// 1 → 5, 2 → 4, 3 → 3, 4 → 2, 5 → 1
```

### 0-100 스케일 변환
```typescript
// 1-5 점수를 0-100으로 변환
const normalizedScore = ((average - 1) / 4) * 100;
```

### 레벨 분류

| 점수 범위 | 레벨 |
|-----------|------|
| 0-19 | 매우 낮음 |
| 20-39 | 낮음 |
| 40-59 | 보통 |
| 60-79 | 높음 |
| 80-100 | 매우 높음 |

## 🧪 테스트

### 수동 테스트 방법

1. 새 페이지 생성: `src/app/test-big5/page.tsx`
```tsx
import Big5Test from '@/components/Big5Test';

export default function TestPage() {
  return (
    <div className="min-h-screen py-8 bg-gray-900">
      <Big5Test onComplete={(scores) => console.log(scores)} />
    </div>
  );
}
```

2. 브라우저에서 접속: `http://localhost:3000/test-big5`

3. 10개 문항 모두 답변 후 콘솔에서 점수 확인

## 🔄 psychology/page.tsx 통합

### 1. Import 추가
```tsx
import Big5Test from '@/components/Big5Test';
import type { Big5Scores } from '@/lib/calculateBig5';
```

### 2. 타입 확장
```tsx
type TestResults = {
  mindCard: any;
  colors: string[] | null;
  mbti: string | null;
  enneagram: string | null;
  birthDate: string | null;
  big5: Big5Scores | null;  // 추가
};
```

### 3. 초기 상태 업데이트
```tsx
const [testResults, setTestResults] = useState<TestResults>({
  mindCard: null,
  colors: null,
  mbti: null,
  enneagram: null,
  birthDate: null,
  big5: null,  // 추가
});
```

### 4. 컴포넌트 추가 (상세 테스트 탭)
```tsx
<div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
  <Big5Test onComplete={(result) => updateTestResult('big5', result)} />
</div>
```

### 5. 진행 상황에 추가
```tsx
{
  key: 'big5',
  icon: '🧬',
  title: 'Big5',
  completed: testResults.big5,
  value: testResults.big5 ? '완료' : ''
}
```

## 📈 향후 개선 사항

### v2 개선 계획
- [ ] 문항 수 확장 (10개 → 50개)
- [ ] 애니메이션 효과 강화
- [ ] 결과 그래프 차트 (Radar Chart)
- [ ] 상세 해석 텍스트 추가
- [ ] 다국어 지원 (i18n)
- [ ] 결과 공유 기능 (이미지 다운로드)
- [ ] 이전 결과와 비교 기능

### 데이터 저장
```tsx
// API 엔드포인트 추가
POST /api/big5/save
Body: { userId, scores, timestamp }

// 결과 조회
GET /api/big5/history?userId=xxx
```

## 🐛 문제 해결

### 타입 에러
```bash
# 타입 정의 확인
npm run type-check
```

### import 에러
```tsx
// ❌ 잘못된 경로
import big5Data from '../data/big5.json';

// ✅ 올바른 경로 (tsconfig paths 설정)
import big5Data from '@/data/big5.json';
```

### 점수가 0으로 나옴
- 모든 질문에 답변했는지 확인
- `answers` 객체가 제대로 업데이트되는지 확인
- 역문항 처리가 올바른지 확인

## 📚 참고 자료

- [Big Five personality traits (Wikipedia)](https://en.wikipedia.org/wiki/Big_Five_personality_traits)
- [IPIP-NEO (Public Domain Big5 Test)](https://ipip.ori.org/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

## 📄 라이선스

InnerMap AI v1 프로젝트의 일부로, 프로젝트 라이선스를 따릅니다.

---

**Created by:** PromptCore  
**Date:** 2025-10-08  
**Version:** 1.0.0

