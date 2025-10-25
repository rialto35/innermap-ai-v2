/**
 * Report Contract v1 E2E 테스트
 * 요약 동등성, 심층 생성 흐름 테스트
 */

import { test, expect } from '@playwright/test';

test.describe('Report Contract v1', () => {
  test.beforeEach(async ({ page }) => {
    // 테스트 로그인
    await page.goto('/api/test-login');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  test('요약/검사직후 동등성', async ({ page }) => {
    // 1. 검사 완료 후 결과 페이지로 이동
    await page.goto('/results/test-result-id');
    
    // 2. 리포트 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/.*\/report\/.*\?tab=summary/);
    
    // 3. 요약 탭 DOM 구조 확인
    const summaryRoot = page.locator('[data-testid="summary-root"]');
    await expect(summaryRoot).toBeVisible();
    
    // 4. 핵심 요소들이 표시되는지 확인
    await expect(page.locator('text=핵심 요약')).toBeVisible();
    await expect(page.locator('text=Big5 성격 분석')).toBeVisible();
    await expect(page.locator('text=MBTI')).toBeVisible();
    await expect(page.locator('text=RETI')).toBeVisible();
    await expect(page.locator('text=Inner9 내면 지도')).toBeVisible();
    
    // 5. 메타 정보 확인
    await expect(page.locator('text=엔진 버전')).toBeVisible();
    await expect(page.locator('text=가중치 버전')).toBeVisible();
    await expect(page.locator('text=생성 시간')).toBeVisible();
  });

  test('심층 모듈 생성', async ({ page }) => {
    // 1. 리포트 페이지로 이동
    await page.goto('/report/test-result-id?tab=deep');
    
    // 2. 심층 분석 허브 확인
    const deepRoot = page.locator('[data-testid="deep-root"]');
    await expect(deepRoot).toBeVisible();
    
    // 3. 6개 모듈 카드 확인
    const moduleCards = page.locator('[data-testid="deep-root"] > div > div > div');
    await expect(moduleCards).toHaveCount(6);
    
    // 4. 인지 패턴 분석 생성 버튼 클릭
    await page.getByRole('button', { name: '인지 패턴 분석 생성하기' }).click();
    
    // 5. 생성 중 상태 확인
    await expect(page.locator('text=생성 중...')).toBeVisible();
    
    // 6. 완료 후 ready 상태 확인 (타임아웃 10초)
    await expect(page.locator('text=✓ 완료')).toBeVisible({ timeout: 10000 });
    
    // 7. 상세 보기 버튼 확인
    await expect(page.locator('text=상세 보기')).toBeVisible();
  });

  test('탭 전환 동작', async ({ page }) => {
    // 1. 요약 탭으로 이동
    await page.goto('/report/test-result-id?tab=summary');
    
    // 2. 요약 탭이 활성화되어 있는지 확인
    const summaryTab = page.locator('button:has-text("📊 요약")');
    await expect(summaryTab).toHaveClass(/bg-white/);
    
    // 3. 심층 분석 탭 클릭
    await page.locator('button:has-text("🔍 심층 분석")').click();
    
    // 4. 심층 분석 탭이 활성화되어 있는지 확인
    const deepTab = page.locator('button:has-text("🔍 심층 분석")');
    await expect(deepTab).toHaveClass(/bg-white/);
    
    // 5. 심층 분석 내용이 표시되는지 확인
    await expect(page.locator('[data-testid="deep-root"]')).toBeVisible();
  });

  test('권한·공유 테스트', async ({ page }) => {
    // 1. 다른 사용자로 로그인 시도
    await page.goto('/api/test-login?userId=other-user');
    
    // 2. 본인 리포트에 접근 시도
    const response = await page.request.get('/api/reports/test-result-id');
    expect(response.status()).toBe(404); // 권한 없음
    
    // 3. 공유 링크 생성
    await page.goto('/api/test-login'); // 본인으로 다시 로그인
    const shareResponse = await page.request.post('/api/share/test-result-id', {
      data: { scope: 'summary' }
    });
    expect(shareResponse.status()).toBe(200);
    
    const shareData = await shareResponse.json();
    expect(shareData.shareId).toBeDefined();
    expect(shareData.url).toContain('/shared/');
    expect(shareData.scope).toBe('summary');
  });

  test('버전 호환성', async ({ page }) => {
    // 1. v1.0.0 저장본도 동일 탭·동일 컴포넌트로 렌더
    await page.goto('/report/legacy-result-id?tab=summary');
    
    // 2. 기본 구조는 동일하게 표시
    await expect(page.locator('[data-testid="summary-root"]')).toBeVisible();
    
    // 3. 심층은 CTA만 표시 (기존 데이터)
    await page.goto('/report/legacy-result-id?tab=deep');
    await expect(page.locator('text=분석 생성하기')).toBeVisible();
  });
});
