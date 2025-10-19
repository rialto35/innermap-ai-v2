# Asset Management System - 사용 가이드

## 📦 개요

InnerMap AI v2의 에셋 관리 시스템은 287개 영웅, 13개 부족, 13개 결정석 이미지를 효율적으로 관리하고 제공합니다.

---

## 🚀 빠른 시작

### 1. 에셋 매니페스트 생성

```bash
npm run build:assets
```

**출력:**
```
✓ wrote public/manifest/assets.json
  heroes=287, tribes=13, stones=13
```

### 2. 컴포넌트에서 사용

```tsx
import HeroImage from '@/components/assets/HeroImage';
import { TribeBadge } from '@/components/assets/TribeBadge';
import { StoneBadge } from '@/components/assets/StoneBadge';

export default function MyPage() {
  return (
    <div>
      {/* 영웅 이미지 */}
      <HeroImage 
        heroCode="ENFJ-TYPE1-M" 
        width={512} 
        height={512}
        priority
      />

      {/* 부족 배지 */}
      <TribeBadge 
        tribe="balance" 
        size={96}
        showLabel
      />

      {/* 결정석 배지 */}
      <StoneBadge 
        stone="arche" 
        size={96}
        variant="natal"
        showLabel
      />
    </div>
  );
}
```

---

## 📁 디렉토리 구조

```
public/
  heroes/                    # 영웅 이미지 (현재 위치)
    male/                    # 남성 영웅 144개
      ENFJ_TYPE1.png
      ENFJ_TYPE2.png
      ...
    female/                  # 여성 영웅 143개
      ENFJ_TYPE1.png
      ENFJ_TYPE2.png
      ...
  assets/
    tribes/                  # 부족 아이콘 13개
      balance.png
      creation.png
      ...
    stones/                  # 결정석 이미지 13개
      arche.png
      kairos.png
      ...
  manifest/
    assets.json             # 자동 생성된 매니페스트
```

---

## 🔧 API 레퍼런스

### `HeroImage` 컴포넌트

영웅 이미지를 표시하는 컴포넌트입니다.

**Props:**
```typescript
interface HeroImageProps {
  heroCode: string;        // 예: "ENFJ-TYPE1-M"
  alt?: string;            // 대체 텍스트 (기본: heroCode)
  width?: number;          // 너비 (기본: 512)
  height?: number;         // 높이 (기본: 512)
  className?: string;      // 추가 CSS 클래스
  priority?: boolean;      // Next.js 우선 로딩 (기본: false)
}
```

**사용 예:**
```tsx
<HeroImage 
  heroCode="INTJ-TYPE5-F" 
  width={400}
  height={400}
  className="rounded-xl shadow-lg"
  priority
/>
```

---

### `TribeBadge` 컴포넌트

부족 아이콘 배지를 표시하는 컴포넌트입니다.

**Props:**
```typescript
interface TribeBadgeProps {
  tribe: string;           // 부족 키 (예: "balance")
  size?: number;           // 크기 (기본: 96)
  className?: string;      // 추가 CSS 클래스
  showLabel?: boolean;     // 라벨 표시 여부 (기본: false)
}
```

**사용 예:**
```tsx
<TribeBadge 
  tribe="harmony" 
  size={128}
  showLabel
  className="hover:scale-110 transition"
/>
```

---

### `StoneBadge` 컴포넌트

결정석 배지를 표시하는 컴포넌트입니다.

**Props:**
```typescript
interface StoneBadgeProps {
  stone: string;           // 결정석 키 (예: "arche")
  size?: number;           // 크기 (기본: 96)
  className?: string;      // 추가 CSS 클래스
  showLabel?: boolean;     // 라벨 표시 여부 (기본: false)
  variant?: "natal" | "growth"; // 선천석/성장석 구분
}
```

**사용 예:**
```tsx
<div className="flex gap-4">
  <StoneBadge 
    stone="arche" 
    variant="natal"
    showLabel
  />
  <StoneBadge 
    stone="kairos" 
    variant="growth"
    showLabel
  />
</div>
```

---

## 🔍 헬퍼 함수

### `getManifest()`

에셋 매니페스트를 가져옵니다 (캐싱됨).

```typescript
import { getManifest } from '@/lib/assets';

const manifest = await getManifest();
console.log(manifest.counts); // { heroes: 287, tribes: 13, stones: 13 }
```

---

### `getHeroImagePath(heroCode: string)`

영웅 코드로 이미지 경로를 조회합니다.

```typescript
import { getHeroImagePath } from '@/lib/assets';

const path = await getHeroImagePath("ENFJ-TYPE1-M");
// "/heroes/male/ENFJ_TYPE1.png"
```

---

### `findHeroByProfile(mbti, reti?, index?, gender?)`

프로필 정보로 영웅 이미지를 검색합니다.

```typescript
import { findHeroByProfile } from '@/lib/assets';

const path = await findHeroByProfile("INTJ", "5", undefined, "female");
// "/heroes/female/INTJ_TYPE5.png"
```

---

### `getTribeImagePath(key: string)`

부족 키로 이미지 경로를 조회합니다.

```typescript
import { getTribeImagePath } from '@/lib/assets';

const path = await getTribeImagePath("balance");
// "/assets/tribes/balance.png"
```

---

### `getStoneImagePath(key: string)`

결정석 키로 이미지 경로를 조회합니다.

```typescript
import { getStoneImagePath } from '@/lib/assets';

const path = await getStoneImagePath("arche");
// "/assets/stones/arche.png"
```

---

## 🎨 스타일링 예제

### 영웅 카드

```tsx
<div className="relative group">
  <HeroImage 
    heroCode={heroCode}
    width={300}
    height={300}
    className="rounded-2xl shadow-2xl group-hover:scale-105 transition-transform"
  />
  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 rounded-b-2xl">
    <h3 className="text-white font-bold">{heroTitle}</h3>
    <p className="text-white/70 text-sm">{heroCode}</p>
  </div>
</div>
```

---

### 부족 & 결정석 그리드

```tsx
<div className="grid grid-cols-2 gap-4">
  <div className="flex flex-col items-center gap-2">
    <TribeBadge tribe={tribeKey} size={120} />
    <span className="text-sm text-white/70">부족</span>
  </div>
  
  <div className="flex flex-col items-center gap-2">
    <StoneBadge stone={stoneKey} size={120} variant="natal" />
    <span className="text-sm text-white/70">선천석</span>
  </div>
</div>
```

---

## 🧪 테스트

### 매니페스트 검증

```bash
npx vitest run
```

**예상 출력:**
```
✓ src/lib/assets.test.ts (3)
  ✓ Asset Manifest (3)
    ✓ manifest file exists
    ✓ manifest has correct structure
    ✓ asset counts are reasonable

📊 Asset counts: heroes=287, tribes=13, stones=13
```

---

## 📊 성능 최적화

### 캐싱 전략

**정적 에셋 (영웅/부족/결정석 이미지):**
- `Cache-Control: public, max-age=31536000, immutable`
- 1년 장기 캐싱

**매니페스트 (assets.json):**
- `Cache-Control: public, max-age=3600, stale-while-revalidate=86400`
- 1시간 캐싱, 24시간 stale-while-revalidate

### 로딩 최적화

1. **우선순위 로딩**: 첫 화면 영웅 이미지에 `priority` 사용
2. **Lazy Loading**: 스크롤 하단 이미지는 자동 lazy load
3. **Fallback 이미지**: 누락된 이미지 자동 대체

---

## 🔄 파일명 규칙

### 현재 지원 (v1)

```
MBTI_TYPEN.png
예: ENFJ_TYPE1.png, INTJ_TYPE5.png
```

**코드 형식:** `MBTI-TYPEN-G`
- 예: `ENFJ-TYPE1-M`, `INTJ-TYPE5-F`

### 미래 지원 (v2)

```
mbti_reti_index_gender.png
예: intj_5_023_female.png
```

**코드 형식:** `MBTI-RETI-INDEX-G`
- 예: `INTJ-5-023-F`

---

## 🐛 트러블슈팅

### 매니페스트가 생성되지 않음

```bash
# 수동 생성
npm run build:assets

# 빌드 시 자동 생성 (postbuild hook)
npm run build
```

---

### 이미지가 표시되지 않음

1. **매니페스트 확인:**
   ```bash
   cat public/manifest/assets.json
   ```

2. **heroCode 형식 확인:**
   ```typescript
   // ✅ 올바른 형식
   "ENFJ-TYPE1-M"
   
   // ❌ 잘못된 형식
   "enfj-type1-m"  // 대문자 필요
   "ENFJ_TYPE1_M"  // 언더스코어 대신 하이픈
   ```

3. **Fallback 이미지 준비:**
   ```
   public/assets/heroes/_fallback.png
   public/assets/tribes/_fallback.png
   public/assets/stones/_fallback.png
   ```

---

### 빌드 시 에러

```bash
# 타입 체크
npm run typecheck

# 린트
npm run lint

# 전체 검증
npm run verify
```

---

## 📝 체크리스트

### 배포 전 확인사항

- [ ] `npm run build:assets` 실행 완료
- [ ] `public/manifest/assets.json` 생성 확인
- [ ] 에셋 카운트 확인 (heroes: 287, tribes: 13, stones: 13)
- [ ] `npx vitest run` 테스트 통과
- [ ] `npm run typecheck` 통과
- [ ] `npm run build` 성공

---

## 🎯 다음 단계

### Phase 2: 이미지 최적화

- [ ] WebP 변환 자동화
- [ ] 썸네일 생성 (128x128, 256x256)
- [ ] CDN 업로드 스크립트

### Phase 3: 동적 생성

- [ ] AI 기반 영웅 이미지 생성
- [ ] 사용자 커스터마이징 지원
- [ ] 실시간 이미지 합성

---

**작성일:** 2025-10-19  
**버전:** Asset System v1.0.0  
**엔진:** GPT-5 🤖

