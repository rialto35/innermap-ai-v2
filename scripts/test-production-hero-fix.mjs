#!/usr/bin/env node
/**
 * 프로덕션 Hero 매칭 수정 검증
 */

import { chromium } from '@playwright/test';

const PROD_URL = 'https://innermap-ai-v2.vercel.app';

async function main() {
  console.log('🔍 프로덕션 Hero 매칭 테스트 시작...\n');
  console.log(`📍 URL: ${PROD_URL}\n`);

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 네트워크 로그 캡처
  const apiCalls = [];
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/imcore/me')) {
      try {
        const data = await response.json();
        apiCalls.push({ url, status: response.status(), data });
        console.log('\n📡 API Response: /api/imcore/me');
        console.log('   Status:', response.status());
        console.log('   Hero:', data.hero?.name, `(${data.hero?.mbti}-${data.hero?.reti})`);
        console.log('   MBTI:', data.mbti?.type);
        console.log('   RETI:', data.reti?.top1?.[0]);
      } catch (e) {
        // JSON 파싱 실패 무시
      }
    }
  });

  try {
    // 1. 홈페이지 접속
    console.log('1️⃣ 홈페이지 접속...');
    await page.goto(PROD_URL);
    await page.waitForLoadState('networkidle');
    console.log('✅ 홈페이지 로드 완료\n');

    // 2. 로그인 확인
    console.log('2️⃣ 로그인 상태 확인...');
    const isLoggedIn = await page.locator('[data-testid="user-menu-button"]').isVisible().catch(() => false);
    
    if (!isLoggedIn) {
      console.log('⚠️ 로그인되지 않음. Google 로그인 필요합니다.');
      console.log('👉 브라우저에서 수동으로 로그인해주세요...\n');
      
      // 로그인 페이지로 이동
      await page.goto(`${PROD_URL}/login`);
      await page.waitForLoadState('networkidle');
      
      // 사용자가 로그인할 때까지 대기
      console.log('⏳ 로그인 완료까지 대기 중... (최대 2분)');
      await page.waitForSelector('[data-testid="user-menu-button"]', { timeout: 120000 });
      console.log('✅ 로그인 완료!\n');
    } else {
      console.log('✅ 이미 로그인됨\n');
    }

    // 3. 마이페이지 접속
    console.log('3️⃣ 마이페이지 접속...');
    await page.goto(`${PROD_URL}/mypage`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // API 호출 대기
    console.log('✅ 마이페이지 로드 완료\n');

    // 스크린샷 저장
    await page.screenshot({ path: 'logs/production-hero-test.png', fullPage: true });

    // 4. 페이지에 표시된 Hero 정보 확인
    console.log('4️⃣ 페이지에 표시된 Hero 정보 확인...');
    
    // Hero 이름 찾기
    const heroElements = await page.locator('text=/영웅의 발화자|MBTI|ISTP|ENTP|INFP/i').allTextContents();
    console.log(`   Hero 요소들: ${heroElements.join(', ') || '❌ 없음'}`);

    // MBTI 찾기
    const mbtiText = await page.locator('text=/MBTI\\s+(ISTP|ENTP|INFP|INTJ|ENFP)/i').first().textContent().catch(() => null);
    console.log(`   MBTI 표시: ${mbtiText || '❌ 없음'}`);

    // RETI 찾기
    const retiText = await page.locator('text=/RETI\\s+R[0-9]/i').first().textContent().catch(() => null);
    console.log(`   RETI 표시: ${retiText || '❌ 없음'}`);

    // 검사 시작 버튼 확인
    const hasTestButton = await page.locator('button:has-text("검사 시작"), button:has-text("테스트 시작")').isVisible().catch(() => false);
    console.log(`   검사 시작 버튼: ${hasTestButton ? '⚠️ 보임 (결과 없음)' : '✅ 안보임 (결과 있음)'}`);

    console.log('\n');
    console.log('=' .repeat(60));
    console.log('📊 테스트 결과 요약');
    console.log('=' .repeat(60));

    // API 응답 분석
    if (apiCalls.length > 0) {
      const latestCall = apiCalls[apiCalls.length - 1];
      console.log('\n✅ API 호출 성공:');
      console.log(`   Hero: ${latestCall.data.hero?.name || 'Unknown'}`);
      console.log(`   MBTI: ${latestCall.data.mbti?.type || 'Unknown'}`);
      console.log(`   RETI: ${latestCall.data.reti?.top1?.[0] || 'Unknown'}`);
      console.log(`   Hero Code: ${latestCall.data.hero?.mbti}-${latestCall.data.hero?.reti}`);
      
      // 매칭 확인
      const expectedMBTI = latestCall.data.mbti?.type;
      const displayedMBTI = mbtiText?.match(/(ISTP|ENTP|INFP|INTJ|ENFP)/)?.[1];
      
      if (expectedMBTI && displayedMBTI) {
        if (expectedMBTI === displayedMBTI) {
          console.log('\n✅ SUCCESS: Hero 매칭이 정확합니다!');
          console.log(`   DB MBTI (${expectedMBTI}) === 표시 MBTI (${displayedMBTI})`);
        } else {
          console.log('\n❌ FAIL: Hero 매칭이 여전히 틀립니다!');
          console.log(`   DB MBTI (${expectedMBTI}) !== 표시 MBTI (${displayedMBTI})`);
        }
      }
    } else {
      console.log('\n⚠️ API 호출을 캡처하지 못했습니다.');
    }

    console.log('\n📸 스크린샷: logs/production-hero-test.png');
    console.log('\n👀 브라우저를 열어두었습니다. 직접 확인해보세요!');
    console.log('   (종료하려면 Ctrl+C를 누르세요)');
    
    await page.waitForTimeout(60000); // 1분 대기

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    await page.screenshot({ path: 'logs/production-hero-error.png', fullPage: true });
    console.log('📸 오류 스크린샷: logs/production-hero-error.png');
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

