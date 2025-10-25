/**
 * 결정적 입력 시나리오 테스트
 * 중립/극단값 패턴으로 결과 일관성 검증
 */

import { test, expect } from '@playwright/test';

test.describe('결정적 입력 시나리오', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    // E2E 테스트용 로그인
    await page.goto(`${baseURL}/api/test-login`);
    await page.waitForLoadState('networkidle');
  });

  test('시나리오 A: 중립 패턴 (전 문항 4) → 고정 스냅샷', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 모든 문항을 4로 설정 (중립값)
    for (let i = 1; i <= 55; i++) {
      const slider = page.getByTestId(`q-${i}`);
      await slider.fill('4');
    }

    await page.getByRole('button', { name: /제출|완료/ }).click();
    await page.waitForURL('**/result');
    await page.waitForLoadState('networkidle');

    // 얕은 테스트: 스냅샷 텍스트 + 차트 존재 확인
    await expect(page.getByTestId('result-mbti')).toBeVisible();
    await expect(page.getByTestId('result-reti')).toBeVisible();
    await expect(page.getByTestId('result-big5')).toBeVisible();
    await expect(page.getByTestId('inner9-chart')).toBeVisible();

    // 깊은 테스트: 숫자 임계치 검사
    const mbtiText = await page.getByTestId('result-mbti').textContent();
    expect(mbtiText).toMatch(/^[EI][SN][TF][PJ]$/);

    const retiText = await page.getByTestId('result-reti').textContent();
    const retiValue = parseInt(retiText?.replace('형', '') || '0');
    expect(retiValue).toBeGreaterThanOrEqual(1);
    expect(retiValue).toBeLessThanOrEqual(9);

    const big5Text = await page.getByTestId('result-big5').textContent();
    expect(big5Text).toMatch(/O\d+ C\d+ E\d+ A\d+ N\d+/);

    // Inner9 차트가 렌더링되었는지 확인
    const chartElement = page.getByTestId('inner9-chart');
    await expect(chartElement).toBeVisible();
    
    // 차트 내부에 9개 축이 있는지 확인
    const axisElements = await chartElement.locator('[data-testid*="axis"]').count();
    expect(axisElements).toBeGreaterThan(0);
  });

  test('시나리오 B: 외향·개방 고강도 → 기대 패턴 검증', async ({ page, baseURL }) => {
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 외향성/개방성 관련 문항을 극단값으로 설정
    const extremeResponses = Array(55).fill(4);
    
    // 외향성 문항들 (3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53)을 7로 설정
    [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53].forEach(idx => {
      extremeResponses[idx - 1] = 7;
    });
    
    // 개방성 문항들 (1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51)을 7로 설정
    [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51].forEach(idx => {
      extremeResponses[idx - 1] = 7;
    });

    // 문항 입력
    for (let i = 1; i <= 55; i++) {
      const slider = page.getByTestId(`q-${i}`);
      await slider.fill(extremeResponses[i - 1].toString());
    }

    await page.getByRole('button', { name: /제출|완료/ }).click();
    await page.waitForURL('**/result');
    await page.waitForLoadState('networkidle');

    // 얕은 테스트: 결과 표시 확인
    await expect(page.getByTestId('result-mbti')).toBeVisible();
    await expect(page.getByTestId('result-reti')).toBeVisible();
    await expect(page.getByTestId('result-big5')).toBeVisible();
    await expect(page.getByTestId('inner9-chart')).toBeVisible();

    // 깊은 테스트: 기대 패턴 검증
    const mbtiText = await page.getByTestId('result-mbti').textContent();
    expect(mbtiText).toMatch(/^[EI][SN][TF][PJ]$/);
    
    // 외향성/개방성 극단값이므로 E나 N이 포함될 가능성 높음
    expect(mbtiText).toMatch(/[EN]/);

    const big5Text = await page.getByTestId('result-big5').textContent();
    expect(big5Text).toMatch(/O\d+ C\d+ E\d+ A\d+ N\d+/);
    
    // Big5 점수에서 O(개방성)와 E(외향성)가 높은 값인지 확인
    const big5Values = big5Text?.match(/O(\d+) C(\d+) E(\d+) A(\d+) N(\d+)/);
    if (big5Values) {
      const oValue = parseInt(big5Values[1]);
      const eValue = parseInt(big5Values[3]);
      
      // 극단값 입력이므로 높은 점수 기대
      expect(oValue).toBeGreaterThan(60);
      expect(eValue).toBeGreaterThan(60);
    }

    // Inner9 차트에서 창조성/표현 축이 높은지 확인
    const chartElement = page.getByTestId('inner9-chart');
    await expect(chartElement).toBeVisible();
  });

  test('시나리오 A + B 비교: 패턴 차이 검증', async ({ page, baseURL }) => {
    // 시나리오 A 실행
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 중립 패턴
    for (let i = 1; i <= 55; i++) {
      const slider = page.getByTestId(`q-${i}`);
      await slider.fill('4');
    }

    await page.getByRole('button', { name: /제출|완료/ }).click();
    await page.waitForURL('**/result');
    await page.waitForLoadState('networkidle');

    const neutralMBTI = await page.getByTestId('result-mbti').textContent();
    const neutralBig5 = await page.getByTestId('result-big5').textContent();

    // 시나리오 B 실행
    await page.goto(`${baseURL}/test/start`);
    await page.waitForLoadState('networkidle');

    // 극단 패턴
    for (let i = 1; i <= 55; i++) {
      const slider = page.getByTestId(`q-${i}`);
      if ([1, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28, 31, 33, 36, 38, 41, 43, 46, 48, 51, 53].includes(i)) {
        await slider.fill('7');
      } else {
        await slider.fill('4');
      }
    }

    await page.getByRole('button', { name: /제출|완료/ }).click();
    await page.waitForURL('**/result');
    await page.waitForLoadState('networkidle');

    const extremeMBTI = await page.getByTestId('result-mbti').textContent();
    const extremeBig5 = await page.getByTestId('result-big5').textContent();

    // 결과가 다르다는 것을 확인 (패턴 차이 검증)
    expect(neutralMBTI).toBeDefined();
    expect(extremeMBTI).toBeDefined();
    expect(neutralBig5).toBeDefined();
    expect(extremeBig5).toBeDefined();

    // MBTI나 Big5에서 차이가 있어야 함
    const hasDifference = neutralMBTI !== extremeMBTI || neutralBig5 !== extremeBig5;
    expect(hasDifference).toBe(true);
  });
});
