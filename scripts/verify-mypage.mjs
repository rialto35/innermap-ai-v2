#!/usr/bin/env node
/**
 * 마이페이지 영웅 데이터 확인
 */

import { chromium } from '@playwright/test';

async function main() {
  console.log('🔍 마이페이지 영웅 데이터 확인 시작...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 콘솔 로그 캡처
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || msg.text().includes('API') || msg.text().includes('Hero')) {
      console.log(`[Browser ${type.toUpperCase()}]`, msg.text());
    }
  });

  try {
    // 1. 로그인
    console.log('1️⃣ 개발용 로그인...');
    await page.goto('http://localhost:3000/login');
    await page.waitForLoadState('networkidle');
    
    const devButton = page.getByTestId('dev-login-button');
    await devButton.waitFor({ state: 'visible', timeout: 5000 });
    await devButton.click();
    
    await page.waitForURL('**/mypage**', { timeout: 10000 });
    console.log('✅ 로그인 성공\n');

    // 2. 마이페이지 데이터 로드 대기
    console.log('2️⃣ 마이페이지 데이터 로드 중...');
    await page.waitForTimeout(5000); // 데이터 로드 대기

    // 3. 영웅 이름 확인
    const hasUnknownHero = await page.getByText('Unknown Hero').isVisible().catch(() => false);
    const hasUnknownTribe = await page.getByText('Unknown Tribe').isVisible().catch(() => false);
    
    if (hasUnknownHero || hasUnknownTribe) {
      console.log('❌ Unknown Hero/Tribe 표시됨 - 데이터 매칭 실패\n');
    } else {
      console.log('✅ 영웅 데이터 정상 표시\n');
    }

    // 4. 스크린샷 저장
    await page.screenshot({ path: 'logs/mypage-screenshot.png', fullPage: true });
    console.log('📸 스크린샷 저장: logs/mypage-screenshot.png\n');

    // 5. Inner9 분석 페이지 확인
    console.log('3️⃣ Inner9 분석 페이지 확인...');
    await page.goto('http://localhost:3000/results/inner9');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'logs/inner9-screenshot.png', fullPage: true });
    console.log('📸 스크린샷 저장: logs/inner9-screenshot.png\n');

    // 6. 상세 리포트 페이지 확인
    console.log('4️⃣ 상세 리포트 페이지 확인...');
    await page.goto('http://localhost:3000/results/report');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    await page.screenshot({ path: 'logs/report-screenshot.png', fullPage: true });
    console.log('📸 스크린샷 저장: logs/report-screenshot.png\n');

    console.log('🎉 검증 완료!');
    
  } catch (error) {
    console.error('❌ 검증 실패:', error.message);
    await page.screenshot({ path: 'logs/verify-error-screenshot.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

