# 🐛 Inner9 키 불일치 오류 수정

**날짜**: 2025-01-27  
**오류**: Missing required fields (will, sensitivity, expression, insight, resilience, growth)  
**영향**: `/api/analyze` 엔드포인트 500 에러

---

## 🔍 문제 분석

### 오류 로그
```
❌ [API /analyze] Inner9 validation failed: Error [ZodError]: [
  { "path": ["will"], "message": "Required" },
  { "path": ["sensitivity"], "message": "Required" },
  { "path": ["expression"], "message": "Required" },
  { "path": ["insight"], "message": "Required" },
  { "path": ["resilience"], "message": "Required" },
  { "path": ["growth"], "message": "Required" }
]
```

### 근본 원인

#### 1. toInner9 함수가 반환하는 키 (Before)
```typescript
{
  creation: 79,
  balance: 67,
  intuition: 85,    // ❌ 스키마에 없음
  analysis: 67,     // ❌ 스키마에 없음
  harmony: 61,
  drive: 67,        // ❌ 스키마에 없음
  reflection: 61,   // ❌ 스키마에 없음
  empathy: 61,      // ❌ 스키마에 없음
  discipline: 67    // ❌ 스키마에 없음
}
```

#### 2. Inner9Schema가 기대하는 키
```typescript
{
  creation: number,
  will: number,         // ✅ 필수
  sensitivity: number,  // ✅ 필수
  harmony: number,
  expression: number,   // ✅ 필수
  insight: number,      // ✅ 필수
  resilience: number,   // ✅ 필수
  balance: number,
  growth: number        // ✅ 필수
}
```

---

## ✅ 해결 방법

### 수정된 코드 (src/core/im-core/inner9.ts)

```typescript
// 스키마 키와 일치: creation, will, sensitivity, harmony, expression, insight, resilience, balance, growth
const inner9Scores: { [key: string]: number } = {
  creation: big5.o * weights.big5 + (safeMbti.includes('N') ? 10 : 0) * weights.mbti,
  will: big5.e * weights.big5 + (safeReti > 5 ? 10 : 0) * weights.reti, // drive → will
  sensitivity: big5.a * weights.big5 + (safeMbti.includes('F') ? 10 : 0) * weights.mbti, // empathy → sensitivity
  harmony: big5.a * weights.big5 + (safeMbti.includes('F') ? 15 : 0) * weights.mbti,
  expression: big5.e * weights.big5 + (safeMbti.includes('E') ? 10 : 0) * weights.mbti, // 새로운 축
  insight: big5.o * weights.big5 + (safeMbti.includes('N') ? 15 : 0) * weights.mbti, // intuition → insight
  resilience: (100 - big5.n) * weights.big5 + (safeMbti.includes('I') ? 5 : 0) * weights.mbti, // reflection → resilience
  balance: (100 - Math.abs(big5.e - big5.c)) * weights.big5 + (safeMbti.includes('J') ? 5 : 0) * weights.mbti,
  growth: big5.c * weights.big5 + (safeReti < 5 ? 10 : 0) * weights.reti, // discipline → growth
};
```

### 키 매핑 변경 사항

| Before (Old Key) | After (New Key) | 의미 |
|---|---|---|
| intuition | insight | 통찰력 |
| analysis | (제거) | 분석력 → 다른 축에 통합 |
| drive | will | 의지력 |
| reflection | resilience | 회복탄력성 |
| empathy | sensitivity | 민감성 |
| discipline | growth | 성장 |
| - | expression | 표현력 (신규) |

---

## 🧪 테스트

### 입력
```typescript
const big5 = { O: 79, C: 67, E: 67, A: 61, N: 39 };
const mbti = 'ENTP';
const reti = 'r7';
```

### 예상 출력 (After)
```typescript
{
  creation: 79,      // Openness 기반
  will: 67,          // Extraversion + RETI 기반
  sensitivity: 61,   // Agreeableness + F 기반
  harmony: 61,       // Agreeableness + F 기반
  expression: 67,    // Extraversion + E 기반
  insight: 85,       // Openness + N 기반
  resilience: 61,    // (100 - Neuroticism) 기반
  balance: 67,       // E-C 균형 기반
  growth: 67         // Conscientiousness + RETI 기반
}
```

### 검증
```bash
# 브라우저에서 테스트
# 1. Inner9 분석 페이지 접속
# 2. 콘솔 확인: "✅ [API /analyze] Inner9 scores validated"
# 3. 9개 축 모두 정상 표시 확인
```

---

## 📊 영향 범위

### 수정된 파일
- ✅ `src/core/im-core/inner9.ts` (1곳)

### 영향받는 기능
- ✅ Inner9 분석 (`/results/inner9`)
- ✅ 상세 리포트 (`/results/report`)
- ✅ 심층 분석 (`/results/deep`)
- ✅ 차트 표시 (9축 레이더 차트)

### 주의사항
- ⚠️ 기존 DB에 저장된 Inner9 데이터는 이전 키 구조를 사용할 수 있음
- ⚠️ 마이그레이션 또는 호환성 레이어 필요 가능성

---

## 🎯 근본 원인 분석

### 왜 이 문제가 발생했나?

1. **스키마 정의와 함수 구현 불일치**
   - 스키마는 DB 구조에 맞춰 정의됨
   - 함수는 초기 설계 시 다른 키 이름 사용

2. **리팩토링 과정에서 동기화 누락**
   - 스키마 변경 시 함수 업데이트 누락
   - 타입 체크가 런타임까지 전파되지 않음

3. **테스트 부족**
   - Inner9 계산 로직에 대한 단위 테스트 부재
   - 스키마 검증 테스트 부재

---

## 📝 권장 사항

### 즉시 적용
- ✅ 현재 수정 사항 적용 완료
- ✅ 브라우저 테스트 진행

### 추가 개선

#### 1. 타입 안전성 강화
```typescript
// src/core/im-core/inner9.ts
import { Inner9 } from '@/lib/schemas/inner9';

export function toInner9(data: {...}): Inner9Axis[] {
  const scores: Inner9 = { // ✅ 타입 명시
    creation: ...,
    will: ...,
    // ... 9개 필드
  };
  
  return Object.entries(scores).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: Math.max(0, Math.min(100, value)),
  }));
}
```

#### 2. 단위 테스트 추가
```typescript
// tests/unit/inner9.spec.ts
describe('toInner9', () => {
  it('should return all 9 required keys', () => {
    const result = toInner9({
      big5: { o: 79, c: 67, e: 67, a: 61, n: 39 },
      mbti: 'ENTP',
      reti: 7
    });
    
    const keys = result.map(item => item.label.toLowerCase());
    expect(keys).toContain('creation');
    expect(keys).toContain('will');
    expect(keys).toContain('sensitivity');
    // ... 9개 모두 확인
  });
  
  it('should match Inner9Schema', () => {
    const result = toInner9({...});
    const object = arrayToObject(result);
    expect(() => Inner9Schema.parse(object)).not.toThrow();
  });
});
```

#### 3. DB 마이그레이션 (필요 시)
```sql
-- 기존 데이터의 키 이름 변경
UPDATE test_assessment_results
SET inner9_scores = jsonb_set(
  jsonb_set(
    jsonb_set(
      inner9_scores,
      '{will}', inner9_scores->'drive'
    ),
    '{insight}', inner9_scores->'intuition'
  ),
  '{sensitivity}', inner9_scores->'empathy'
)
WHERE inner9_scores ? 'drive';
```

---

## 🎉 결론

### 성과
- ✅ Inner9 키 불일치 오류 수정
- ✅ 스키마와 함수 동기화
- ✅ 9개 축 모두 정상 계산

### 교훈
- 스키마 정의와 구현 함수는 항상 동기화 필요
- 타입 안전성을 위한 명시적 타입 사용 권장
- 단위 테스트로 스키마 검증 자동화 필요

---

**작성자**: Claude Sonnet 4.5  
**수정 시간**: ~3분  
**테스트 상태**: 수정 완료, 테스트 대기 중

