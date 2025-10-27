#!/usr/bin/env node
/**
 * Hero 매칭 로직 테스트 - 콘솔 로그 확인
 */

import { chromium } from '@playwright/test';

const TEST_URL = process.env.TEST_URL || 'http://localhost:3000';

async function main() {
  console.log('🔍 Hero 매칭 테스트 시작...\n');
  console.log(`📍 URL: ${TEST_URL}\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 콘솔 로그 캡처
  const consoleLogs = [];
  page.on('console', msg => {
    const text = msg.text();
    consoleLogs.push(text);
    
    // Hero 매칭 관련 로그만 출력
    if (text.includes('Hero matching') || text.includes('DB saved values') || text.includes('매칭')) {
      console.log(`📋 [Browser Console] ${text}`);
    }
  });

  try {
    // 1. 로그인 페이지로 이동
    console.log('1️⃣ 로그인 페이지 접속...');
    await page.goto(`${TEST_URL}/login`);
    await page.waitForLoadState('networkidle');
    console.log('✅ 로그인 페이지 로드 완료\n');

    // 2. 개발 로그인 버튼 확인
    const hasDevLogin = await page.locator('[data-testid="dev-login-button"]').isVisible().catch(() => false);
    
    if (hasDevLogin) {
      console.log('2️⃣ 개발 로그인 사용...');
      await page.click('[data-testid="dev-login-button"]');
      await page.waitForURL('**/mypage', { timeout: 10000 });
      console.log('✅ 로그인 완료\n');
    } else {
      console.log('2️⃣ Google 로그인 필요...');
      console.log('👉 브라우저에서 수동으로 로그인해주세요...\n');
      
      // 로그인 버튼 클릭
      const loginButton = page.locator('button:has-text("Google")').first();
      if (await loginButton.isVisible()) {
        await loginButton.click();
      }
      
      // 사용자가 로그인할 때까지 대기
      console.log('⏳ 로그인 완료까지 대기 중... (최대 2분)');
      await page.waitForURL('**/mypage', { timeout: 120000 });
      console.log('✅ 로그인 완료\n');
    }

    // 3. 마이페이지 로드 대기
    console.log('3️⃣ 마이페이지 데이터 로딩 중...');
    await page.waitForTimeout(3000); // API 호출 대기
    
    // 스크린샷 저장
    await page.screenshot({ path: 'logs/hero-matching-test.png', fullPage: true });
    console.log('📸 스크린샷 저장: logs/hero-matching-test.png\n');

    // 4. 페이지에 표시된 Hero 정보 확인
    console.log('4️⃣ 페이지에 표시된 Hero 정보 확인...');
    
    // Hero 이름 찾기
    const heroText = await page.locator('text=/영웅의 발화자|MBTI|RETI/i').first().textContent().catch(() => null);
    console.log(`   Hero 텍스트: ${heroText || '❌ 없음'}`);

    // MBTI 찾기
    const mbtiElements = await page.locator('text=/MBTI|ISTP|ENTP|INFP|INTJ/i').allTextContents();
    console.log(`   MBTI 요소들: ${mbtiElements.join(', ') || '❌ 없음'}`);

    // RETI 찾기
    const retiElements = await page.locator('text=/RETI|R[0-9]/i').allTextContents();
    console.log(`   RETI 요소들: ${retiElements.join(', ') || '❌ 없음'}`);

    console.log('\n');
    console.log('=' .repeat(60));
    console.log('📊 콘솔 로그 분석 결과:');
    console.log('=' .repeat(60));
    
    // Hero 매칭 관련 로그 필터링
    const heroMatchingLogs = consoleLogs.filter(log => 
      log.includes('Hero matching') || 
      log.includes('DB saved values') || 
      log.includes('매칭') ||
      log.includes('MBTI') ||
      log.includes('RETI')
    );
    
    if (heroMatchingLogs.length > 0) {
      console.log('\n🔍 Hero 매칭 관련 로그:');
      heroMatchingLogs.forEach(log => console.log(`   ${log}`));
    } else {
      console.log('\n⚠️ Hero 매칭 관련 로그를 찾을 수 없습니다.');
      console.log('   서버 콘솔을 직접 확인해주세요.');
    }

    console.log('\n');
    console.log('👀 브라우저를 열어두었습니다. 직접 확인해보세요!');
    console.log('   (종료하려면 Ctrl+C를 누르세요)');
    
    await page.waitForTimeout(60000); // 1분 대기

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    await page.screenshot({ path: 'logs/hero-matching-error.png', fullPage: true });
    console.log('📸 오류 스크린샷: logs/hero-matching-error.png');
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

