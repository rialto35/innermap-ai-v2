import { test, expect } from '@playwright/test';

test.describe('Inner9 모바일 레이아웃 테스트', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // E2E 테스트용 로그인
    await page.goto(`${baseURL}/api/test-login`);
    await page.waitForLoadState('networkidle');
    
    // 대시보드로 이동
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForLoadState('networkidle');
  });

  test('모바일(390x844)에서 Inner9 차트 레이아웃 확인', async ({ page }) => {
    // iPhone 13 크기로 설정
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Inner9 탭 클릭 (만약 탭으로 구성되어 있다면)
    await page.getByRole('tab', { name: /Inner9/i }).click();
    await page.waitForLoadState('networkidle');
    
    // Inner9 차트가 모바일에서도 잘 보이는지 확인
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
    
    // 차트 컨테이너가 모바일 화면에 맞게 조정되었는지 확인
    const chartElement = page.getByTestId('inner9-chart');
    const boundingBox = await chartElement.boundingBox();
    
    // 차트가 화면을 벗어나지 않는지 확인
    expect(boundingBox?.width).toBeLessThanOrEqual(390);
    expect(boundingBox?.x).toBeGreaterThanOrEqual(0);
  });

  test('모바일에서 Inner9 해석 텍스트 가독성 확인', async ({ page }) => {
    // iPhone 13 크기로 설정
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Inner9 탭 클릭
    await page.getByRole('tab', { name: /Inner9/i }).click();
    await page.waitForLoadState('networkidle');
    
    // 해석 텍스트가 모바일에서도 잘 보이는지 확인
    await expect(page.getByTestId('inner9-interpretation')).toBeVisible();
    
    // 텍스트가 화면을 벗어나지 않는지 확인
    const interpretationElement = page.getByTestId('inner9-interpretation');
    const boundingBox = await interpretationElement.boundingBox();
    
    expect(boundingBox?.width).toBeLessThanOrEqual(390);
    expect(boundingBox?.x).toBeGreaterThanOrEqual(0);
  });

  test('모바일에서 차원 카드 그리드 레이아웃 확인', async ({ page }) => {
    // iPhone 13 크기로 설정
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Inner9 탭 클릭
    await page.getByRole('tab', { name: /Inner9/i }).click();
    await page.waitForLoadState('networkidle');
    
    // 차원 카드들이 모바일에서 세로로 잘 배치되는지 확인
    const dimensionCards = page.getByTestId('inner9-dimension');
    const count = await dimensionCards.count();
    
    expect(count).toBeGreaterThan(0);
    
    // 각 카드가 화면을 벗어나지 않는지 확인
    for (let i = 0; i < count; i++) {
      const card = dimensionCards.nth(i);
      const boundingBox = await card.boundingBox();
      
      expect(boundingBox?.width).toBeLessThanOrEqual(390);
      expect(boundingBox?.x).toBeGreaterThanOrEqual(0);
    }
  });

  test('모바일에서 스크롤 동작 확인', async ({ page }) => {
    // iPhone 13 크기로 설정
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Inner9 탭 클릭
    await page.getByRole('tab', { name: /Inner9/i }).click();
    await page.waitForLoadState('networkidle');
    
    // 페이지 하단까지 스크롤
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // 스크롤 후에도 모든 요소가 잘 보이는지 확인
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
    await expect(page.getByTestId('inner9-interpretation')).toBeVisible();
  });
});
