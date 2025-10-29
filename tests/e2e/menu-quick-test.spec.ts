import { test, expect } from '@playwright/test';

test.describe('메뉴 Quick Test', () => {
  test('홈페이지 로드 및 기본 메뉴 확인', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 로고 확인
    const logo = page.locator('header').getByRole('link', { name: /InnerMap AI/i });
    await expect(logo).toBeVisible();
    console.log('✅ 로고 표시 확인');
    
    // Primary 메뉴 링크 확인
    const menuLinks = ['검사하기', '영웅 도감', '세계관', '빠른 추천', '인사이트'];
    
    for (const linkText of menuLinks) {
      const link = page.locator('header').getByRole('link', { name: linkText });
      await expect(link).toBeVisible();
      console.log(`✅ "${linkText}" 메뉴 표시 확인`);
    }
    
    // Secondary 메뉴 링크 확인
    const secondaryLinks = ['요금제', '소개'];
    
    for (const linkText of secondaryLinks) {
      const link = page.locator('header').getByRole('link', { name: linkText });
      await expect(link).toBeVisible();
      console.log(`✅ "${linkText}" 메뉴 표시 확인`);
    }
    
    // 로그인 버튼 확인
    const loginButton = page.locator('header').getByRole('link', { name: '로그인' });
    await expect(loginButton).toBeVisible();
    console.log('✅ 로그인 버튼 표시 확인');
    
    console.log('\n✅ 모든 기본 메뉴 표시 확인 완료');
  });

  test('로그인 후 메뉴 변화 확인', async ({ page }) => {
    // 로그인 (data-testid 활용)
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    const devButton = page.getByTestId('dev-login-button');
    await devButton.waitFor({ state: 'visible', timeout: 5000 });
    await devButton.click();
    
    await page.waitForURL('**/mypage**', { timeout: 10000 });
    console.log('✅ 개발용 로그인 성공');
    
    // 홈으로 이동
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // 로그인 후 메뉴 확인
    const mypageLink = page.locator('header').getByRole('link', { name: /마이페이지/i });
    await expect(mypageLink).toBeVisible();
    console.log('✅ 마이페이지 링크 표시 확인');
    
    const resultsLink = page.locator('header').getByRole('link', { name: /내 결과/ });
    await expect(resultsLink).toBeVisible();
    console.log('✅ 내 결과 링크 표시 확인');
    
    const logoutButton = page.locator('header').getByRole('button', { name: /로그아웃/i });
    await expect(logoutButton).toBeVisible();
    console.log('✅ 로그아웃 버튼 표시 확인');
    
    console.log('\n✅ 로그인 후 메뉴 변화 확인 완료');
  });
});

