import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'parallel' });

test.describe('로그인 및 모달 테스트', () => {
  test('로그인 후 대시보드 접근', async ({ page, baseURL }) => {
    // E2E 테스트용 로그인
    await page.goto(`${baseURL}/api/test-login`);
    
    // 로그인 처리 완료까지 대기
    await page.waitForLoadState('networkidle');
    
    // 로그인 성공 후 대시보드로 수동 이동
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // 대시보드 페이지 로드 확인
    await expect(page).toHaveTitle(/InnerMap AI/i);
    
    // URL이 대시보드를 포함하는지 확인
    expect(page.url()).toContain('/dashboard');
  });

  test('설정 모달 열기/저장/닫기 안정화', async ({ page, baseURL }) => {
    // 홈페이지로 이동
    await page.goto(baseURL!);
    
    // 검사 시작 버튼 클릭 (모달 열기)
    await page.getByRole('button', { name: /검사 시작/i }).click();
    
    // 모달이 열렸는지 확인 (role="dialog" 기반)
    await page.waitForSelector('[role="dialog"][data-state="open"]');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // 모달 내용 확인
    await expect(page.getByText('분석 모드를 선택하세요')).toBeVisible();
    
    // QuickMap 버튼 클릭
    await page.getByTestId('quickmap-button').click();
    
    // 페이지 이동 확인
    await expect(page).toHaveURL(/.*\/analyze\/quick/, { timeout: 10000 });
  });

  test('DeepMap 모달 네비게이션', async ({ page, baseURL }) => {
    // 홈페이지로 이동
    await page.goto(baseURL!);
    
    // 검사 시작 버튼 클릭 (모달 열기)
    await page.getByRole('button', { name: /검사 시작/i }).click();
    
    // 모달이 열렸는지 확인
    await page.waitForSelector('[role="dialog"][data-state="open"]');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // DeepMap 버튼 클릭
    await page.getByTestId('deepmap-button').click();
    
    // 페이지 이동 확인
    await expect(page).toHaveURL(/.*\/analyze\/deep/, { timeout: 10000 });
  });

  test('모달 닫기 기능', async ({ page, baseURL }) => {
    // 홈페이지로 이동
    await page.goto(baseURL!);
    
    // 검사 시작 버튼 클릭 (모달 열기)
    await page.getByRole('button', { name: /검사 시작/i }).click();
    
    // 모달이 열렸는지 확인
    await page.waitForSelector('[role="dialog"][data-state="open"]');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // 닫기 버튼 클릭 (더 안정적인 셀렉터 사용)
    await page.getByTestId('close-modal-button').click();
    
    // 모달이 닫혔는지 확인
    await page.waitForSelector('[role="dialog"][data-state="open"]', { state: 'detached' });
    await expect(page.getByRole('dialog')).toBeHidden();
  });

  test('모달 외부 클릭으로 닫기', async ({ page, baseURL }) => {
    // 홈페이지로 이동
    await page.goto(baseURL!);
    
    // 검사 시작 버튼 클릭 (모달 열기)
    await page.getByRole('button', { name: /검사 시작/i }).click();
    
    // 모달이 열렸는지 확인
    await page.waitForSelector('[role="dialog"][data-state="open"]');
    await expect(page.getByRole('dialog')).toBeVisible();
    
    // 모달 외부(오버레이) 클릭 - 더 안정적인 방법
    await page.locator('[data-testid="test-mode-modal"]').click({ 
      position: { x: 10, y: 10 },
      force: true 
    });
    
    // 모달이 닫혔는지 확인
    await page.waitForSelector('[role="dialog"][data-state="open"]', { state: 'detached' });
    await expect(page.getByRole('dialog')).toBeHidden();
  });
});
