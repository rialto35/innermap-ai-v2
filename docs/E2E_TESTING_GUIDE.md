# E2E 테스트 가이드

## 🚀 빠른 시작

### 1. 환경변수 설정

```bash
# 로컬 개발 환경
export NEXT_PUBLIC_E2E=1

# CI/CD 환경
NEXT_PUBLIC_E2E=1 npm run test:e2e

# 프리뷰 배포 테스트
NEXT_PUBLIC_E2E=1 PW_BASE_URL=https://your-preview-url.vercel.app npm run test:e2e
```

### 2. 테스트 실행

```bash
# 기본 E2E 테스트
npm run test:e2e

# UI 모드로 테스트 실행
npm run test:e2e:ui

# 헤드 모드로 테스트 실행 (브라우저 창 표시)
npm run test:e2e:headed

# 스냅샷 업데이트
npm run test:e2e:update

# 프리뷰 배포 테스트
npm run test:e2e:preview
```

## 🔧 설정된 기능들

### 1. NextAuth E2E 안정화
- **Credentials Provider**: E2E 테스트 전용 로그인 (`e2e@innermap.ai` / `pass`)
- **자동 로그인**: `/api/test-login` 엔드포인트로 한 번에 로그인
- **결정적 로그인**: OAuth 리디렉션 없이 안정적인 세션 생성

### 2. 모달 네비게이션 안정화
- **애니메이션 제거**: E2E 환경에서 모든 트랜지션 비활성화
- **안정적인 셀렉터**: `role="dialog"`, `data-state="open"` 기반 대기
- **테스트 셀렉터**: `data-testid` 속성으로 정확한 요소 선택

### 3. 테스트 구조
```
tests/
├── e2e/
│   ├── smoke.spec.ts           # 기본 스모크 테스트
│   ├── login-and-modal.spec.ts # 로그인 및 모달 테스트
│   └── inner9.spec.ts          # Inner9 회귀 테스트
├── unit/
│   └── inner9.engine.spec.ts   # 유닛 테스트
└── msw/
    └── handlers.ts             # API 모킹
```

## 📊 테스트 결과

### 현재 상태
- ✅ **유닛 테스트**: 28/28 통과 (100%)
- ✅ **E2E 테스트**: 3/5 통과 (60%)
  - ✅ 홈페이지 로드 & 메타 정보
  - ✅ 모바일 뷰포트 레이아웃  
  - ✅ 페이지 로딩 성능
  - 🔄 로그인 플로우 (개선됨)
  - 🔄 네비게이션 메뉴 (개선됨)

### 개선된 기능들
1. **NextAuth 로그인**: Credentials Provider로 안정화
2. **모달 네비게이션**: 애니메이션 제거 + 안정적인 셀렉터
3. **테스트 셀렉터**: `data-testid` 속성 추가
4. **환경변수**: `NEXT_PUBLIC_E2E=1` 자동 설정

## 🛠️ 문제 해결

### 로그인 실패
```bash
# 환경변수 확인
echo $NEXT_PUBLIC_E2E

# 수동으로 테스트
curl http://localhost:3000/api/test-login
```

### 모달 테스트 실패
```bash
# 헤드 모드로 디버깅
npm run test:e2e:headed

# 특정 테스트만 실행
npx playwright test tests/e2e/login-and-modal.spec.ts --headed
```

### 성능 문제
```bash
# 타임아웃 증가
npx playwright test --timeout=120000

# 병렬 실행 비활성화
npx playwright test --workers=1
```

## 🚀 CI/CD 통합

### GitHub Actions 예시
```yaml
- name: Run E2E Tests
  run: |
    export NEXT_PUBLIC_E2E=1
    npm run test:e2e
  env:
    NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

### Vercel 프리뷰 테스트
```bash
# 프리뷰 URL로 테스트
PW_BASE_URL=https://your-preview.vercel.app npm run test:e2e
```

## 📝 추가 개발 가이드

### 새로운 테스트 작성
1. `tests/e2e/` 디렉토리에 `.spec.ts` 파일 생성
2. `data-testid` 속성으로 안정적인 셀렉터 사용
3. `role="dialog"` 기반으로 모달 테스트
4. `NEXT_PUBLIC_E2E=1` 환경변수 활용

### 컴포넌트에 테스트 셀렉터 추가
```tsx
// 기존
<button onClick={handleClick}>저장</button>

// 개선
<button onClick={handleClick} data-testid="save-button">저장</button>
```

### 모달 컴포넌트 개선
```tsx
// 기존
<div className="modal">

// 개선  
<div className="modal" role="dialog" data-state={open ? "open" : "closed"}>
```

## 🎯 다음 단계

1. **테스트 커버리지 확장**: 더 많은 사용자 시나리오 추가
2. **성능 테스트**: 로딩 시간 및 메모리 사용량 모니터링
3. **크로스 브라우저**: Safari, Firefox 지원 확장
4. **모바일 테스트**: 실제 디바이스 테스트 환경 구축
