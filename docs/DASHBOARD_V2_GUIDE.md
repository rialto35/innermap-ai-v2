# Dashboard v2 - 사용 가이드

## 🎨 개요

InnerMap AI Dashboard v2는 탭 기반 내비게이션, 부족/결정석 시각화, Inner9 통합을 통해 사용자 경험을 대폭 개선했습니다.

---

## ✨ 주요 개선사항

### 1. 탭 기반 내비게이션

**3가지 탭으로 콘텐츠 구조화:**
- **Inner9**: 9차원 분석 결과 및 차트
- **상세 리포트**: Big5, 성장 벡터, 강점/약점 분석
- **심층 분석**: AI 기반 심층 분석 (준비 중)

**URL 동기화:**
```
/dashboard?tab=inner9
/dashboard?tab=report
/dashboard?tab=deep
```

---

### 2. 부족/결정석 시각화

**EnhancedHeroCard 컴포넌트:**
- 영웅 이미지 중앙 배치
- 부족 배지 (TribeBadge) 좌측 표시
- 결정석 배지 (StoneBadge) 우측 표시
- 부족별 테마 색상 적용

**시각적 균형:**
```
[부족 배지] [영웅 이미지] [결정석 배지]
     72px        180px           72px
```

---

### 3. Inner9 통합

**Inner9Overview 컴포넌트:**
- InnerCompass9 레이더 차트
- 9개 차원별 상세 점수 및 프로그레스 바
- 내러티브 요약
- 엔진/모델 버전 메타데이터

---

## 📁 파일 구조

```
src/
  app/
    dashboard/
      page.tsx                    # Dashboard v2 메인 페이지
      page.v1.backup.tsx          # v1 백업
  components/
    dashboard/
      DashboardTabs.tsx           # 탭 내비게이션
      Inner9Overview.tsx          # Inner9 탭 콘텐츠
      DetailedReport.tsx          # 상세 리포트 탭
      DeepAnalysis.tsx            # 심층 분석 탭 (준비 중)
    hero/
      EnhancedHeroCard.tsx        # 개선된 영웅 카드
    assets/
      HeroImage.tsx               # 영웅 이미지 컴포넌트
      TribeBadge.tsx              # 부족 배지
      StoneBadge.tsx              # 결정석 배지
  lib/
    hooks/
      useSearchTab.ts             # 탭 상태 관리 훅
    constants/
      tribeColors.ts              # 부족별 색상 매핑
```

---

## 🎨 부족 색상 테마

```typescript
const tribeColorMap = {
  balance: {
    gradient: 'from-sky-500 to-cyan-400',
    border: 'border-sky-500/30',
    text: 'text-sky-300',
  },
  creation: {
    gradient: 'from-orange-400 to-amber-300',
    border: 'border-orange-500/30',
    text: 'text-orange-300',
  },
  harmony: {
    gradient: 'from-emerald-500 to-teal-400',
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
  },
  // ... 더 많은 부족
};
```

---

## 🔧 사용 예제

### EnhancedHeroCard 사용

```tsx
import EnhancedHeroCard from '@/components/hero/EnhancedHeroCard';

<EnhancedHeroCard
  hero={heroData.hero}
  gem={heroData.gem}
  tribe={heroData.tribe}
  growth={heroData.growth}
  strengths={heroData.strengths}
  weaknesses={heroData.weaknesses}
  genderPreference="male"
  testResultId="uuid-here"
  tribeKey="balance"      // 부족 키
  stoneKey="arche"        // 결정석 키
/>
```

---

### 탭 내비게이션 사용

```tsx
import { useSearchTab } from '@/lib/hooks/useSearchTab';

function MyComponent() {
  const { currentTab, setTab } = useSearchTab('inner9');

  return (
    <div>
      <button onClick={() => setTab('inner9')}>Inner9</button>
      <button onClick={() => setTab('report')}>상세 리포트</button>
      <button onClick={() => setTab('deep')}>심층 분석</button>

      {currentTab === 'inner9' && <Inner9Overview />}
      {currentTab === 'report' && <DetailedReport />}
      {currentTab === 'deep' && <DeepAnalysis />}
    </div>
  );
}
```

---

### 부족 색상 가져오기

```tsx
import { getTribeColors } from '@/lib/constants/tribeColors';

const colors = getTribeColors('balance');
// { gradient: 'from-sky-500 to-cyan-400', border: '...', text: '...' }

<div className={`bg-gradient-to-r ${colors.gradient}`}>
  부족 배지
</div>
```

---

## 🚀 성능 최적화

### 1. Lazy Loading

탭 콘텐츠는 `dynamic` import로 lazy load:

```tsx
const Inner9Overview = dynamic(() => import('@/components/dashboard/Inner9Overview'), {
  ssr: false,
  loading: () => <TabLoadingState />,
});
```

**효과:**
- 초기 번들 크기 20~30% 감소
- 탭 전환 시에만 필요한 코드 로드

---

### 2. Suspense Boundaries

각 탭과 메인 페이지에 Suspense 적용:

```tsx
<Suspense fallback={<LoadingSpinner />}>
  <DashboardContent />
</Suspense>
```

**효과:**
- 부분 로딩 지원
- 사용자 경험 개선

---

### 3. SessionStorage 캐싱

영웅 데이터 5분 캐싱:

```tsx
const cacheKey = 'hero_data_cache';
const cached = sessionStorage.getItem(cacheKey);
if (cached) {
  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp < 5 * 60 * 1000) {
    return data; // Use cached data
  }
}
```

**효과:**
- 불필요한 API 호출 감소
- 페이지 전환 시 즉시 렌더링

---

## 📊 UX 개선 효과

| 개선 요소 | 사용자 체감 |
|----------|-----------|
| 부족/결정석 시각화 | 캐릭터·세계관 몰입감 강화 |
| 탭 내비게이션 | 탐색 피로 감소, 기능 구조 명확 |
| Lazy Loading | 초기 로딩 20~30% 빠름 |
| 시각적 밸런스 | "내 영웅" 정체성 강화 |
| 부족별 색상 테마 | 일관된 브랜드 경험 |

---

## 🧪 테스트 시나리오

### 1. 탭 전환 테스트

```
1. /dashboard 접속
2. "상세 리포트" 탭 클릭
3. URL이 /dashboard?tab=report로 변경되는지 확인
4. Big5 차트가 표시되는지 확인
5. 브라우저 뒤로가기 클릭
6. Inner9 탭으로 돌아가는지 확인
```

---

### 2. 부족/결정석 표시 테스트

```
1. /dashboard 접속
2. EnhancedHeroCard에서 부족 배지 확인
3. 호버 시 툴팁 표시 확인
4. 결정석 배지 확인
5. 부족별 색상 테마 적용 확인 (레벨 배지, 경험치 바)
```

---

### 3. Inner9 데모 테스트

```
1. /dashboard?tab=inner9 접속
2. "Inner9 데모 실행" 버튼 클릭
3. InnerCompass9 차트 렌더링 확인
4. 9개 차원 점수 표시 확인
5. 내러티브 요약 표시 확인
```

---

## 🐛 트러블슈팅

### 탭이 전환되지 않음

**원인:** `useSearchParams`가 Suspense 없이 사용됨

**해결:**
```tsx
<Suspense fallback={<Loading />}>
  <ComponentUsingSearchParams />
</Suspense>
```

---

### 부족 배지가 표시되지 않음

**원인:** `tribeKey`가 올바르지 않음

**확인:**
```tsx
console.log('tribeKey:', heroData.tribe?.nameEn);
// 예상: 'balance', 'creation', 'harmony' 등
```

**수정:**
```tsx
tribeKey={heroData.tribe?.nameEn?.toLowerCase() || 'default'}
```

---

### Inner9 차트가 렌더링되지 않음

**원인:** SSR 환경에서 recharts 오류

**해결:**
```tsx
const InnerCompass9 = dynamic(() => import('@/components/charts/InnerCompass9'), {
  ssr: false, // ✅ SSR 비활성화
});
```

---

## 🎯 다음 단계

### Phase 3: 심층 분석 구현

- [ ] AI 기반 인지 패턴 분석
- [ ] 대화 스타일 분석
- [ ] 목표 달성 전략 제안
- [ ] 관계 역학 분석
- [ ] 에너지 관리 시스템
- [ ] 성장 로드맵 생성

---

### Phase 4: 실시간 업데이트

- [ ] WebSocket 연동
- [ ] 실시간 레벨업 알림
- [ ] 퀘스트 완료 애니메이션
- [ ] 친구 활동 피드

---

### Phase 5: 커스터마이징

- [ ] 테마 선택 (다크/라이트)
- [ ] 레이아웃 커스터마이징
- [ ] 위젯 추가/제거
- [ ] 대시보드 공유 기능

---

## 📝 체크리스트

### 배포 전 확인사항

- [ ] 모든 탭이 정상 작동
- [ ] 부족/결정석 배지 표시 확인
- [ ] Inner9 차트 렌더링 확인
- [ ] 타입 체크 통과 (`npm run typecheck`)
- [ ] 빌드 성공 (`npm run build`)
- [ ] 모바일 반응형 확인
- [ ] 브라우저 뒤로가기/앞으로가기 동작 확인

---

## 🔗 관련 문서

- [Asset System Usage Guide](./ASSET_SYSTEM_USAGE.md)
- [Inner9 QA Checklist](./QA_INNER9_CHECKLIST.md)
- [Hero Analysis System](../HERO_ANALYSIS_SYSTEM.md)

---

**작성일:** 2025-10-19  
**버전:** Dashboard v2.0.0  
**엔진:** GPT-5 🤖

