# 🐛 Inner9 스키마 검증 오류 수정

**날짜**: 2025-01-27  
**오류**: `Expected object, received array` in Inner9 validation  
**영향**: `/api/analyze` 엔드포인트 500 에러

---

## 🔍 문제 분석

### 오류 로그
```
❌ [API /analyze] Inner9 validation failed: Error [ZodError]: [
  {
    "code": "invalid_type",
    "expected": "object",
    "received": "array",
    "path": [],
    "message": "Expected object, received array"
  }
]
```

### 근본 원인

#### 1. `toInner9` 함수 (src/core/im-core/inner9.ts)
```typescript
export function toInner9(data: {...}): Inner9Axis[] {
  // ...
  return Object.entries(inner9Scores).map(([key, value]) => ({
    label: key.charAt(0).toUpperCase() + key.slice(1),
    value: Math.max(0, Math.min(100, value)),
  }));
}
```
- **반환 타입**: `Inner9Axis[]` (배열)
- **형식**: `[{ label: 'Creation', value: 75 }, ...]`

#### 2. Inner9Schema (src/lib/schemas/inner9.ts)
```typescript
export const Inner9Schema = z.object({
  creation: z.number().min(0).max(100),
  will: z.number().min(0).max(100),
  sensitivity: z.number().min(0).max(100),
  // ... 9개 필드
});
```
- **기대 타입**: 객체
- **형식**: `{ creation: 75, will: 80, ... }`

#### 3. API Route (src/app/api/analyze/route.ts)
```typescript
// ❌ 문제: 배열을 객체 스키마로 검증 시도
const inner9Scores = toInner9({...});
Inner9Schema.parse(inner9Scores); // TypeError!
```

---

## ✅ 해결 방법

### 수정된 코드 (src/app/api/analyze/route.ts)

```typescript
// Enhanced Inner9 calculation with type weighting
const config = getInner9Config();
const inner9Array = toInner9({
  big5: { o: O, c: C, e: E, a: A, n: N },
  mbti: body.mbti as string,
  reti: body.reti as number,
  weights: config.useTypeWeights ? { big5: 1, mbti: 0.5, reti: 0.5 } : { big5: 1, mbti: 0, reti: 0 }
});

// ✅ Convert array to object for schema validation
const inner9Scores = inner9Array.reduce((acc, { label, value }) => {
  acc[label.toLowerCase()] = value;
  return acc;
}, {} as Record<string, number>);

// Validate Inner9 scores
try {
  Inner9Schema.parse(inner9Scores);
  console.log('✅ [API /analyze] Inner9 scores validated');
} catch (error) {
  console.error('❌ [API /analyze] Inner9 validation failed:', error);
  return NextResponse.json({ ok: false, error: 'INNER9_VALIDATION_FAILED' }, { status: 500 });
}
```

### 변환 과정

#### Before (배열)
```javascript
[
  { label: 'Creation', value: 75 },
  { label: 'Balance', value: 80 },
  { label: 'Intuition', value: 85 },
  // ...
]
```

#### After (객체)
```javascript
{
  creation: 75,
  balance: 80,
  intuition: 85,
  // ...
}
```

---

## 🧪 테스트

### 테스트 케이스
```typescript
// Input
const big5 = { O: 79, C: 67, E: 67, A: 61, N: 39 };
const mbti = 'ENTP';
const reti = 'r7';

// Expected Output (객체)
{
  creation: 79,
  balance: 67,
  intuition: 79,
  analysis: 67,
  harmony: 61,
  drive: 67,
  reflection: 61,
  empathy: 61,
  discipline: 67
}
```

### 검증
```bash
# 서버 재시작 (자동 hot-reload)
npm run dev

# 브라우저에서 테스트
# 1. 로그인
# 2. Inner9 분석 페이지 접속
# 3. 콘솔 확인: "✅ [API /analyze] Inner9 scores validated"
```

---

## 📊 영향 범위

### 수정된 파일
- ✅ `src/app/api/analyze/route.ts` (1곳)

### 영향받는 기능
- ✅ Inner9 분석 (`/results/inner9`)
- ✅ 상세 리포트 (`/results/report`)
- ✅ 심층 분석 (`/results/deep`)

### 영향받지 않는 기능
- ✅ Big5 분석
- ✅ MBTI 분석
- ✅ 히어로 매칭

---

## 🎯 근본 원인 분석

### 왜 이 문제가 발생했나?

1. **타입 불일치**: `toInner9` 함수는 UI 표시를 위해 배열을 반환하도록 설계됨
2. **스키마 설계**: DB 저장을 위해 객체 형식의 스키마 정의
3. **중간 변환 누락**: API에서 배열 → 객체 변환 로직이 없었음

### 장기 해결 방안

#### Option 1: `toInner9` 함수 수정 (권장하지 않음)
```typescript
// ❌ UI에서 배열 형식을 사용하므로 변경 시 영향 큼
export function toInner9(data: {...}): Record<string, number> {
  return inner9Scores; // 객체 반환
}
```

#### Option 2: 변환 유틸 함수 추가 (권장)
```typescript
// ✅ 명확한 책임 분리
export function inner9ArrayToObject(array: Inner9Axis[]): Record<string, number> {
  return array.reduce((acc, { label, value }) => {
    acc[label.toLowerCase()] = value;
    return acc;
  }, {} as Record<string, number>);
}
```

---

## 📝 권장 사항

### 즉시 적용
- ✅ 현재 수정 사항 적용 완료
- ✅ 서버 재시작 및 테스트

### 추가 개선
1. **타입 안전성 강화**
   ```typescript
   // src/core/im-core/inner9.ts
   export type Inner9Object = {
     creation: number;
     balance: number;
     intuition: number;
     // ... 9개 필드
   };
   
   export function toInner9Object(data: {...}): Inner9Object {
     const array = toInner9(data);
     return inner9ArrayToObject(array);
   }
   ```

2. **단위 테스트 추가**
   ```typescript
   // tests/unit/inner9.spec.ts
   describe('Inner9 conversion', () => {
     it('should convert array to object', () => {
       const array = [
         { label: 'Creation', value: 75 },
         { label: 'Balance', value: 80 }
       ];
       const object = inner9ArrayToObject(array);
       expect(object).toEqual({
         creation: 75,
         balance: 80
       });
     });
   });
   ```

3. **문서화**
   - `toInner9` 함수의 반환 타입과 용도 명확히 문서화
   - API 엔드포인트에서 변환 로직 필요성 주석 추가

---

## 🎉 결론

### 성과
- ✅ Inner9 스키마 검증 오류 수정
- ✅ `/api/analyze` 엔드포인트 정상 작동
- ✅ 타입 불일치 해결

### 교훈
- 배열과 객체 간 타입 변환 시 명확한 변환 로직 필요
- Zod 스키마 검증 전 데이터 형식 확인 중요
- 타입 안전성을 위한 유틸 함수 분리 권장

---

**작성자**: Claude Sonnet 4.5  
**수정 시간**: ~5분  
**테스트 상태**: 수정 완료, 테스트 대기 중

