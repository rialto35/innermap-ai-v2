# im-core 엔진 아키텍처

## 개요

`im-core`는 InnerMap AI의 핵심 분석 엔진으로, Big5 성격 데이터를 Inner9 차원으로 변환하고, 영웅 원형 매칭, 색상 매핑, 내러티브 생성을 수행합니다.

## 버전 2.0 주요 개선사항

### 1. 모듈화된 구조

```
src/core/im-core/
├── index.ts              # 메인 파이프라인 오케스트레이터
├── types.ts              # 타입 정의
├── scoreBig5.ts          # Big5 스코어링 및 백분위수 계산
├── scoreMBTI.ts          # MBTI 스코어링 및 신뢰도 계산
├── scoreRETI.ts          # RETI 스코어링
├── tieBreaker.ts         # 동점 해결 로직
├── normsLoader.ts        # 규준 데이터 로더
├── hero-match.ts         # 영웅 매칭 로직
├── color-map.ts          # 색상 매핑 로직
├── narrative.ts          # 내러티브 생성
└── luck.ts               # 일일 운세 계산
```

### 2. 규준 기반 백분위수 계산

#### 규준 데이터 구조

```json
{
  "version": "1.0.0",
  "big5": {
    "O": { "mean": 0.65, "sd": 0.15 },
    "C": { "mean": 0.60, "sd": 0.16 },
    "E": { "mean": 0.55, "sd": 0.18 },
    "A": { "mean": 0.70, "sd": 0.14 },
    "N": { "mean": 0.45, "sd": 0.17 }
  },
  "ageGroups": { ... },
  "genderGroups": { ... }
}
```

#### 백분위수 계산 알고리즘

```typescript
function toPercentile(rawScore: number, mean: number, sd: number): number {
  const z = (rawScore - mean) / sd;
  const percentile = 50 * (1 + erf(z / Math.sqrt(2)));
  return Math.round(percentile);
}
```

- **정규분포 가정**: Big5 점수는 정규분포를 따른다고 가정
- **Z-score 변환**: 원점수를 표준점수로 변환
- **백분위수 계산**: 누적분포함수(CDF)를 사용하여 백분위수 도출

### 3. Tie-Breaking 로직

Inner9 차원 간 점수가 비슷할 때(기본 임계값: 5점) 동점을 해결하는 로직:

1. **보조 요인 사용**: 제공된 경우 보조 점수 활용
2. **상보적 차원 비교**: 각 차원의 상보적 차원 점수 비교
3. **알파벳 순서**: 최종 폴백으로 결정론적 정렬 사용

```typescript
const resolved = resolveAllTies(inner9, { threshold: 5 });
```

### 4. 분석 파이프라인

```typescript
export async function runAnalysis(input: AnalyzeInput): Promise<AnalyzeOutput> {
  // 1. Big5 → Inner9 변환
  const { scores: rawInner9, modelVersion } = mapBig5ToInner9(input.big5);
  
  // 2. 동점 해결
  const inner9 = resolveAllTies(rawInner9, { threshold: 5 });
  
  // 3. 백분위수 계산
  const norms = getCombinedNorms(input.age, input.gender);
  const big5Percentiles = big5ToPercentiles(input.big5, norms);
  
  // 4. 영웅 매칭
  const hero = matchHero(inner9);
  
  // 5. 색상 매핑
  const color = mapColors(inner9);
  
  // 6. 내러티브 생성
  const narrative = buildNarrative(inner9);
  
  return { inner9, hero, color, narrative, big5Percentiles, ... };
}
```

## 사용 예시

### 기본 사용

```typescript
import { runAnalysis } from '@/core/im-core';

const result = await runAnalysis({
  big5: { O: 0.75, C: 0.60, E: 0.55, A: 0.70, N: 0.45 },
  mbti: 'INFP',
  age: 28,
  gender: 'female',
});

console.log(result.inner9);
console.log(result.big5Percentiles); // { O: 73, C: 50, E: 50, A: 50, N: 50 }
console.log(result.hero);
```

### 규준 데이터 커스터마이징

```typescript
import { big5ToPercentiles } from '@/core/im-core/scoreBig5';

const customNorms = {
  O: { mean: 0.70, sd: 0.12 },
  C: { mean: 0.65, sd: 0.14 },
  // ...
};

const percentiles = big5ToPercentiles(big5Scores, customNorms);
```

## 테스트

```bash
# 전체 테스트
npm test

# 특정 모듈 테스트
npm test scoreBig5
npm test tieBreaker

# 커버리지
npm test -- --coverage
```

## 성능 고려사항

- **동기 처리**: 현재 파이프라인은 동기적으로 실행 (평균 < 50ms)
- **캐싱**: 규준 데이터는 메모리에 캐싱됨
- **확장성**: 각 모듈은 독립적으로 최적화 가능

## 향후 계획

- [ ] 실시간 규준 데이터 업데이트
- [ ] 다국어 내러티브 지원
- [ ] 고급 tie-breaking 전략
- [ ] 성능 프로파일링 및 최적화

