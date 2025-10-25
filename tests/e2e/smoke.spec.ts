import { test, expect } from '@playwright/test';

test.describe('스모크 테스트', () => {
  test('홈페이지 로드 & 메타 정보 확인', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    // 페이지 제목 확인
    await expect(page).toHaveTitle(/InnerMap AI/i);
    
    // 메인 헤딩 확인
    await expect(page.getByRole('heading', { name: /당신의 내면은 어떤 영웅의 이야기인가요\?/i })).toBeVisible();
    
    // Hero 섹션의 주요 요소들 확인 (더 구체적인 셀렉터 사용)
    await expect(page.getByText('AI 기반 통합 성격 분석')).toBeVisible();
    await expect(page.getByText('영웅 세계관 리포트')).toBeVisible();
    // 중복 텍스트 문제 해결: 첫 번째 요소만 선택
    await expect(page.locator('span:has-text("144명의 영웅 데이터")').first()).toBeVisible();
    
    // 검사 시작 버튼 확인
    await expect(page.getByRole('button', { name: /검사 시작/i })).toBeVisible();
    
    // 세계관 살펴보기 링크 확인
    await expect(page.getByRole('link', { name: /세계관 살펴보기/i })).toBeVisible();
  });

  test('로그인 플로우(테스트용 API) → 대시보드 진입', async ({ page, baseURL }) => {
    // E2E 테스트용 로그인 API 호출
    await page.goto(`${baseURL}/api/test-login`);
    
    // 로그인 완료 후 대시보드로 리다이렉트 확인
    await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    
    // 대시보드 페이지 로드 확인
    await page.waitForLoadState('networkidle');
    
    // 페이지가 로드되었는지 기본 확인
    await expect(page).toHaveTitle(/InnerMap AI/i);
    
    // 로그인 상태 확인 (간단한 방법)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/dashboard');
    
    // 페이지 내용이 로드되었는지 확인
    await expect(page.locator('body')).toBeVisible();
  });

  test('네비게이션 메뉴 동작 확인', async ({ page, baseURL }) => {
    await page.goto(baseURL!);
    
    // 검사 시작 버튼 클릭 (모달 열기)
    await page.getByRole('button', { name: /검사 시작/i }).click();
    
    // 모달이 열렸는지 확인 (role="dialog" 기반)
    await page.waitForSelector('[role="dialog"][data-state="open"]');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // 모달 내용 확인
    await expect(page.getByText('분석 모드를 선택하세요')).toBeVisible();
    
    // QuickMap 버튼 클릭 (안정적인 셀렉터 사용)
    await page.getByTestId('quickmap-button').click();
    
    // 페이지 이동 확인 (더 긴 대기 시간)
    await expect(page).toHaveURL(/.*\/analyze\/quick/, { timeout: 10000 });
  });

  test('모바일 뷰포트에서 레이아웃 확인', async ({ page, baseURL }) => {
    // iPhone 13 크기로 설정
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto(baseURL!);
    
    // 모바일에서도 메인 헤딩이 보이는지 확인
    await expect(page.getByRole('heading', { name: /당신의 내면은 어떤 영웅의 이야기인가요\?/i })).toBeVisible();
    
    // 검사 시작 버튼이 모바일에서도 접근 가능한지 확인
    await expect(page.getByRole('button', { name: /검사 시작/i })).toBeVisible();
  });

  test('페이지 로딩 성능 확인', async ({ page, baseURL }) => {
    const startTime = Date.now();
    
    await page.goto(baseURL!);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 페이지 로딩이 20초 이내에 완료되는지 확인 (개발 환경 고려)
    expect(loadTime).toBeLessThan(20000);
    
    // 메인 콘텐츠가 렌더링되었는지 확인
    await expect(page.getByRole('heading', { name: /당신의 내면은 어떤 영웅의 이야기인가요\?/i })).toBeVisible();
  });
});
