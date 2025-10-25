/**
 * E2E 55문항 UI 플로우 테스트
 * 실제 브라우저에서 55문항을 입력 → 결과 페이지에서 모든 분석 결과 확인
 */

import { test, expect } from '@playwright/test';

test.describe('55문항 입력→결과 플로우', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // E2E 테스트용 로그인
    await page.goto(`${baseURL}/api/test-login`);
    await page.waitForLoadState('networkidle');
  });

  test('55문항 입력→결과에서 MBTI/RETI/Big5/Inner9 동시 노출', async ({ page, baseURL }) => {
    // 테스트 시작 페이지로 이동
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 55개 문항에 응답 (data-testid="q-1" ... "q-55" 가 있다고 가정)
    for (let i = 1; i <= 55; i++) {
      const slider = page.getByTestId(`q-${i}`);
      await expect(slider).toBeVisible();
      
      // 슬라이더 값을 4로 설정 (중립값)
      await slider.fill('4');
      
      // 문항이 제대로 입력되었는지 확인
      await expect(slider).toHaveValue('4');
    }

    // 제출 버튼 클릭
    await page.getByRole('button', { name: /제출|완료/ }).click();

    // 결과 페이지로 이동 확인
    await page.waitForURL('**/result');
    await page.waitForLoadState('networkidle');

    // 모든 분석 결과가 동시에 노출되는지 확인
    await expect(page.getByTestId('result-mbti')).toBeVisible();
    await expect(page.getByTestId('result-reti')).toBeVisible();
    await expect(page.getByTestId('result-big5')).toBeVisible();
    await expect(page.getByTestId('inner9-chart')).toBeVisible();

    // 내용 검증
    await expect(page.getByTestId('result-mbti')).toHaveText(/^[E|I][S|N][T|F][P|J]$/i);
    await expect(page.getByTestId('result-reti')).toHaveText(/[1-9]/);
    
    // Big5 점수 형식 확인 (예: "O50 C50 E50 A50 N50")
    const big5Text = await page.getByTestId('result-big5').textContent();
    expect(big5Text).toMatch(/O\d+ C\d+ E\d+ A\d+ N\d+/);
    
    // Inner9 차트가 렌더링되었는지 확인
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
  });

  test('55문항 미완성 시 제출 차단', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 일부 문항만 입력 (예: 10개만)
    for (let i = 1; i <= 10; i++) {
      const slider = page.getByTestId(`q-${i}`);
      await slider.fill('4');
    }

    // 제출 버튼 클릭 시도
    await page.getByRole('button', { name: /제출|완료/ }).click();

    // 에러 메시지 또는 제출 차단 확인
    await expect(page.getByText(/모든 문항에 응답해주세요|미완성/)).toBeVisible();
    
    // 결과 페이지로 이동하지 않았는지 확인
    expect(page.url()).not.toContain('/result');
  });

  test('55문항 완료 후 결과 동시성 확인', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 모든 문항 입력
    for (let i = 1; i <= 55; i++) {
      const slider = page.getByTestId(`q-${i}`);
      await slider.fill('4');
    }

    await page.getByRole('button', { name: /제출|완료/ }).click();
    await page.waitForURL('**/result');

    // 모든 결과가 동시에 생성되었는지 확인 (같은 타임스탬프)
    const timestamps = await page.locator('[data-testid*="timestamp"]').allTextContents();
    
    if (timestamps.length > 0) {
      // 모든 타임스탬프가 동일한지 확인
      const firstTimestamp = timestamps[0];
      timestamps.forEach(timestamp => {
        expect(timestamp).toBe(firstTimestamp);
      });
    }

    // 결과 카드들이 모두 표시되는지 확인
    await expect(page.getByTestId('result-mbti')).toBeVisible();
    await expect(page.getByTestId('result-reti')).toBeVisible();
    await expect(page.getByTestId('result-big5')).toBeVisible();
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
  });

  test('모바일에서 55문항 입력 가능', async ({ page, baseURL }) => {
    // iPhone 13 크기로 설정
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 모바일에서도 모든 문항이 보이고 조작 가능한지 확인
    for (let i = 1; i <= 55; i++) {
      const slider = page.getByTestId(`q-${i}`);
      await expect(slider).toBeVisible();
      await slider.fill('4');
    }

    // 하단바가 버튼을 가리지 않는지 확인
    const submitButton = page.getByRole('button', { name: /제출|완료/ });
    await expect(submitButton).toBeVisible();
    
    const buttonBox = await submitButton.boundingBox();
    expect(buttonBox?.y).toBeLessThan(800); // 화면 하단에 가려지지 않음

    await submitButton.click();
    await page.waitForURL('**/result');

    // 모바일에서도 모든 결과가 잘 보이는지 확인
    await expect(page.getByTestId('result-mbti')).toBeVisible();
    await expect(page.getByTestId('result-reti')).toBeVisible();
    await expect(page.getByTestId('result-big5')).toBeVisible();
    await expect(page.getByTestId('inner9-chart')).toBeVisible();
  });
});
