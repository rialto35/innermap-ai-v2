# data-testid 개선 요약

**날짜**: 2025-01-27  
**목적**: E2E 테스트 안정성 향상을 위한 `data-testid` 속성 추가  
**영향 범위**: 로그인 페이지, 전체 메뉴 테스트

---

## 🎯 문제점

### 기존 테스트 방식의 한계
```typescript
// ❌ 불안정한 셀렉터
const devButton = page.getByRole('button', { name: /개발자 로그인/i });
```

**문제점**:
- 버튼 텍스트 변경 시 테스트 실패
- 다국어 지원 시 문제 발생
- 여러 버튼이 유사한 텍스트를 가질 경우 충돌
- `getByRole` + 텍스트 매칭은 느리고 불안정

---

## ✅ 해결 방법

### 1. 로그인 페이지에 `data-testid` 추가

#### `src/app/login/page.tsx`

```typescript
// ✅ 이메일/비밀번호 로그인 버튼
<button
  type="submit"
  data-testid="login-submit-button"
  className="..."
>
  {loading ? '처리 중...' : '로그인'}
</button>

// ✅ Google 로그인 버튼
<button
  onClick={handleGoogleLogin}
  data-testid="google-login-button"
  className="..."
>
  {loading ? '로그인 중...' : 'Google로 계속하기'}
</button>

// ✅ 개발용 로그인 버튼
<button
  onClick={...}
  data-testid="dev-login-button"
  className="..."
>
  {loading ? '로그인 중...' : '🧪 개발용 로그인 (Credentials)'}
</button>
```

### 2. 테스트 코드 개선

#### Before (불안정)
```typescript
const devButton = page.getByRole('button', { name: /개발자 로그인/i });
if (await devButton.isVisible()) {
  await devButton.click();
  await page.waitForURL('**/mypage**', { timeout: 10000 });
}
```

#### After (안정적)
```typescript
const devButton = page.getByTestId('dev-login-button');
await devButton.waitFor({ state: 'visible', timeout: 5000 });
await devButton.click();

await page.waitForURL('**/mypage**', { timeout: 10000 });
console.log('✅ 개발용 로그인 성공');
```

---

## 📊 개선 효과

### 1. 테스트 안정성 향상
- ✅ 버튼 텍스트 변경에 영향받지 않음
- ✅ 다국어 지원 시에도 동일한 테스트 코드 사용 가능
- ✅ 명확한 요소 식별로 충돌 방지

### 2. 테스트 속도 향상
- ✅ `getByTestId`는 `getByRole` + 텍스트 매칭보다 빠름
- ✅ 불필요한 재시도 감소

### 3. 유지보수성 향상
- ✅ 테스트 코드가 더 명확하고 읽기 쉬움
- ✅ UI 변경 시 테스트 수정 범위 최소화

---

## 🔧 적용된 테스트 파일

### 1. `tests/e2e/menu-navigation.spec.ts`
- **로그인 사용자 - Desktop Header** (beforeEach)
- **Mobile Bottom Navigation - 로그인** 
- **메뉴 상태 지속성**

### 2. `tests/e2e/menu-quick-test.spec.ts`
- **로그인 후 메뉴 변화 확인**

---

## 📝 추가 권장 사항

### 1. 다른 페이지에도 `data-testid` 추가
```typescript
// 검사 페이지
<button data-testid="start-test-button">검사 시작</button>
<button data-testid="submit-test-button">제출하기</button>

// 결과 페이지
<div data-testid="result-summary">...</div>
<button data-testid="download-report-button">리포트 다운로드</button>

// 마이페이지
<div data-testid="user-profile">...</div>
<button data-testid="edit-profile-button">프로필 수정</button>
```

### 2. `data-testid` 네이밍 컨벤션
- **형식**: `{feature}-{element}-{type}`
- **예시**:
  - `login-submit-button`
  - `test-answer-slider`
  - `result-download-button`
  - `profile-edit-form`

### 3. Playwright Best Practices
```typescript
// ✅ Good: data-testid 사용
const button = page.getByTestId('submit-button');

// ✅ Good: 명확한 role + name
const link = page.getByRole('link', { name: '마이페이지' });

// ⚠️ Avoid: 복잡한 CSS 셀렉터
const button = page.locator('div.container > button.primary:nth-child(2)');

// ❌ Bad: 텍스트 내용에만 의존
const button = page.locator('button:has-text("제출")');
```

---

## 🎉 결론

### 성과
- ✅ 로그인 페이지에 3개 `data-testid` 추가
- ✅ 4개 테스트 파일에서 안정적인 셀렉터 사용
- ✅ 테스트 안정성 및 속도 향상

### 다음 단계
1. **전체 페이지에 `data-testid` 추가** (검사, 결과, 마이페이지 등)
2. **CI/CD 파이프라인에 E2E 테스트 통합**
3. **Visual Regression Testing 도입**

---

**작성자**: Claude Sonnet 4.5  
**테스트 도구**: Playwright 1.56.1  
**프로젝트**: InnerMap AI v2 (Next.js 15.5.5)

