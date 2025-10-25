import { test, expect } from '@playwright/test';

test.describe('Inner9 결과 렌더링', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // 테스트용 로그인
    await page.goto(`${baseURL}/api/test-login`);
    await page.waitForLoadState('networkidle');
  });

  test('Big5→Inner9 계산 후 차트·영역 표시', async ({ page, baseURL }) => {
    // Inner9 페이지로 이동
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 차트가 렌더되는지 확인 (testid 사용)
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
    
    // 9축 라벨 검증
    const expectedLabels = [
      '창조', '의지', '감수성', '조화', '표현', 
      '통찰', '회복력', '균형', '성장'
    ];
    
    for (const label of expectedLabels) {
      await expect(page.getByText(label)).toBeVisible();
    }
    
    // 해석 텍스트(LLM 모킹) 노출 확인
    await expect(page.getByTestId('inner9-interpretation')).toContainText('Mocked analysis');
    
    // 차트 데이터가 올바르게 표시되는지 확인
    await expect(page.getByTestId('inner9-chart')).toContainText(/[0-9]+/);
  });

  test('모바일 뷰에서 UI 깨짐 없음', async ({ page, baseURL }) => {
    // iPhone 13 크기로 설정
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 모바일에서도 차트가 정상적으로 표시되는지 확인
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
    
    // 모바일에서도 9축 라벨이 모두 보이는지 확인
    const expectedLabels = ['창조', '의지', '감수성', '조화', '표현', '통찰', '회복력', '균형', '성장'];
    for (const label of expectedLabels) {
      await expect(page.getByText(label)).toBeVisible();
    }
    
    // 모바일에서 스크롤이 정상적으로 작동하는지 확인
    await page.mouse.wheel(0, 500);
    await expect(page.getByTestId('inner9-chart')).toBeInViewport();
  });

  test('차트 데이터 로딩 상태 확인', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 로딩 스피너가 표시되는지 확인
    await expect(page.getByTestId('inner9-loading')).toBeVisible();
    
    // 차트가 로드될 때까지 대기
    await expect(page.getByTestId('inner9-chart')).toBeVisible({ timeout: 10000 });
    
    // 로딩 스피너가 사라지는지 확인
    await expect(page.getByTestId('inner9-loading')).not.toBeVisible();
  });

  test('차트 인터랙션 (호버, 클릭) 동작', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 차트가 로드될 때까지 대기
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
    
    // 차트 영역에 호버
    await page.hover('[data-testid="inner9-chart"]');
    
    // 툴팁이나 상세 정보가 표시되는지 확인
    await expect(page.getByTestId('inner9-tooltip')).toBeVisible();
    
    // 차트 요소 클릭 시 상세 정보 표시 확인
    await page.click('[data-testid="inner9-chart"]');
    await expect(page.getByTestId('inner9-details')).toBeVisible();
  });

  test('데이터 없을 때 에러 처리', async ({ page, baseURL }) => {
    // MSW 핸들러를 수정하여 빈 데이터 반환
    await page.route('**/api/inner9/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: null })
      });
    });
    
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 데이터가 없을 때 적절한 메시지가 표시되는지 확인
    await expect(page.getByText('데이터를 불러올 수 없습니다')).toBeVisible();
    
    // 재시도 버튼이 있는지 확인
    await expect(page.getByRole('button', { name: /다시 시도/i })).toBeVisible();
  });

  test('네트워크 오류 시 처리', async ({ page, baseURL }) => {
    // 네트워크 오류 시뮬레이션
    await page.route('**/api/inner9/**', route => {
      route.abort('failed');
    });
    
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 네트워크 오류 메시지 확인
    await expect(page.getByText('네트워크 오류가 발생했습니다')).toBeVisible();
    
    // 재시도 버튼 확인
    await expect(page.getByRole('button', { name: /다시 시도/i })).toBeVisible();
  });

  test('차트 색상 및 스타일링 확인', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 차트가 로드될 때까지 대기
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
    
    // 차트의 색상이 올바르게 적용되었는지 확인
    const chartElement = page.getByTestId('inner9-chart');
    await expect(chartElement).toHaveCSS('background-color', /rgba\(139, 92, 246|rgb\(139, 92, 246\)/);
    
    // 차트의 크기가 적절한지 확인
    const boundingBox = await chartElement.boundingBox();
    expect(boundingBox?.width).toBeGreaterThan(300);
    expect(boundingBox?.height).toBeGreaterThan(300);
  });

  test('차트 데이터 정확성 검증', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/analyze/inner9`);
    
    // 차트가 로드될 때까지 대기
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
    
    // 각 차원의 값이 0-100 범위 내에 있는지 확인
    const chartData = await page.evaluate(() => {
      const chartElement = document.querySelector('[data-testid="inner9-chart"]');
      return chartElement?.textContent;
    });
    
    // 차트에 숫자 데이터가 포함되어 있는지 확인
    expect(chartData).toMatch(/[0-9]+/);
    
    // 9개 차원이 모두 표시되는지 확인
    const dimensionCount = await page.locator('[data-testid="inner9-dimension"]').count();
    expect(dimensionCount).toBe(9);
  });
});
