#!/usr/bin/env node
/**
 * 프로덕션 테스트 서버에서 결과 페이지 확인
 */

import { chromium } from '@playwright/test';

const TEST_URL = process.env.TEST_URL || 'https://innermap-ai-v2.vercel.app';

async function main() {
  console.log('🔍 테스트 서버 결과 확인 시작...\n');
  console.log(`📍 URL: ${TEST_URL}\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1. 홈페이지 접속
    console.log('1️⃣ 홈페이지 접속...');
    await page.goto(TEST_URL);
    await page.waitForLoadState('networkidle');
    console.log('✅ 홈페이지 로드 완료\n');

    // 2. 로그인 상태 확인
    console.log('2️⃣ 로그인 상태 확인...');
    const isLoggedIn = await page.locator('[data-testid="user-menu-button"]').isVisible().catch(() => false);
    
    if (!isLoggedIn) {
      console.log('⚠️ 로그인되지 않음. Google 로그인 필요합니다.');
      console.log('👉 브라우저에서 수동으로 로그인해주세요...\n');
      
      // 로그인 버튼 클릭
      const loginButton = page.locator('button:has-text("로그인")').first();
      if (await loginButton.isVisible()) {
        await loginButton.click();
        console.log('로그인 페이지로 이동 중...');
      }
      
      // 사용자가 로그인할 때까지 대기 (최대 2분)
      console.log('⏳ 로그인 완료까지 대기 중... (최대 2분)');
      await page.waitForSelector('[data-testid="user-menu-button"]', { timeout: 120000 });
      console.log('✅ 로그인 완료!\n');
    } else {
      console.log('✅ 이미 로그인됨\n');
    }

    // 3. 마이페이지 접속
    console.log('3️⃣ 마이페이지 접속...');
    await page.goto(`${TEST_URL}/mypage`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✅ 마이페이지 로드 완료\n');

    // 스크린샷 저장
    await page.screenshot({ path: 'logs/mypage-test.png', fullPage: true });

    // 4. 결과 데이터 확인
    console.log('4️⃣ 결과 데이터 확인...');
    
    // Hero 이름 확인
    const heroName = await page.locator('text=/영웅|Hero|ENFP|INFP|INTJ|ENTP/i').first().textContent().catch(() => null);
    console.log(`   Hero: ${heroName || '❌ 없음'}`);

    // MBTI 확인
    const mbti = await page.locator('text=/MBTI|ENFP|INFP|INTJ|ENTP/i').first().textContent().catch(() => null);
    console.log(`   MBTI: ${mbti || '❌ 없음'}`);

    // Big5 차트 확인
    const hasBig5Chart = await page.locator('.recharts-wrapper, [class*="recharts"]').isVisible().catch(() => false);
    console.log(`   Big5 차트: ${hasBig5Chart ? '✅ 있음' : '❌ 없음'}`);

    // "검사 시작" 버튼 확인 (결과가 없으면 이 버튼이 보임)
    const hasTestButton = await page.locator('button:has-text("검사 시작"), button:has-text("테스트 시작")').isVisible().catch(() => false);
    console.log(`   검사 시작 버튼: ${hasTestButton ? '⚠️ 보임 (결과 없음)' : '✅ 안보임 (결과 있음)'}`);

    console.log('\n');

    // 5. Inner9 페이지 확인
    console.log('5️⃣ Inner9 페이지 확인...');
    await page.goto(`${TEST_URL}/results/inner9`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'logs/inner9-test.png', fullPage: true });
    
    const hasInner9Chart = await page.locator('.recharts-wrapper, [class*="recharts"]').isVisible().catch(() => false);
    console.log(`   Inner9 차트: ${hasInner9Chart ? '✅ 있음' : '❌ 없음'}`);

    // 6. 상세 리포트 페이지 확인
    console.log('\n6️⃣ 상세 리포트 페이지 확인...');
    await page.goto(`${TEST_URL}/results/report`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'logs/report-test.png', fullPage: true });
    
    const hasReportContent = await page.locator('text=/성격 분석|심리 분석|강점|약점/i').isVisible().catch(() => false);
    console.log(`   리포트 내용: ${hasReportContent ? '✅ 있음' : '❌ 없음'}`);

    console.log('\n');
    console.log('=' .repeat(60));
    
    if (heroName && !hasTestButton) {
      console.log('✅ 결과가 정상적으로 표시되고 있습니다!');
    } else {
      console.log('⚠️ 결과가 표시되지 않거나 "검사 시작" 버튼이 보입니다.');
      console.log('   - 로그인한 계정으로 검사를 완료했는지 확인해주세요.');
    }
    
    console.log('\n📸 스크린샷이 logs/ 폴더에 저장되었습니다.');
    console.log('   - logs/mypage-test.png');
    console.log('   - logs/inner9-test.png');
    console.log('   - logs/report-test.png');

    // 브라우저를 닫지 않고 유지 (사용자가 직접 확인 가능)
    console.log('\n👀 브라우저를 열어두었습니다. 직접 확인해보세요!');
    console.log('   (종료하려면 Ctrl+C를 누르세요)');
    
    await page.waitForTimeout(300000); // 5분 대기

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    await page.screenshot({ path: 'logs/error-test.png', fullPage: true });
    console.log('📸 오류 스크린샷: logs/error-test.png');
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

