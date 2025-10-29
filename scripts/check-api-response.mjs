#!/usr/bin/env node
/**
 * API 응답 직접 확인
 */

import { chromium } from '@playwright/test';

const PROD_URL = 'https://innermap-ai-v2.vercel.app';

async function main() {
  console.log('🔍 API 응답 확인 시작...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // 모든 네트워크 요청/응답 로깅
  page.on('request', request => {
    if (request.url().includes('/api/')) {
      console.log('📤 Request:', request.method(), request.url());
    }
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/api/imcore/me')) {
      console.log('\n📥 Response: /api/imcore/me');
      console.log('   Status:', response.status());
      console.log('   Headers:', response.headers());
      
      try {
        const text = await response.text();
        console.log('   Body:', text.substring(0, 500));
        
        try {
          const json = JSON.parse(text);
          console.log('\n   Parsed JSON:');
          console.log('   - hasTestResult:', json.hasTestResult);
          console.log('   - hero:', json.hero);
          console.log('   - mbti:', json.mbti);
          console.log('   - reti:', json.reti);
          console.log('   - error:', json.error);
        } catch (e) {
          console.log('   ⚠️ JSON 파싱 실패');
        }
      } catch (e) {
        console.log('   ⚠️ Response body 읽기 실패:', e.message);
      }
    }
  });

  // 콘솔 로그 캡처
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Error') || text.includes('error') || text.includes('Failed')) {
      console.log('🔴 Browser Console Error:', text);
    }
  });

  try {
    console.log('1️⃣ 마이페이지 접속...');
    await page.goto(`${PROD_URL}/mypage`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(5000);

    console.log('\n2️⃣ 페이지 상태 확인...');
    const errorMessage = await page.locator('text=/불러올 수 없습니다|Failed|Error/i').textContent().catch(() => null);
    if (errorMessage) {
      console.log('   ⚠️ 에러 메시지:', errorMessage);
    }

    const hasData = await page.locator('text=/MBTI|RETI|영웅/i').isVisible().catch(() => false);
    console.log('   데이터 표시:', hasData ? '✅ 있음' : '❌ 없음');

    await page.screenshot({ path: 'logs/api-check.png', fullPage: true });
    console.log('\n📸 스크린샷: logs/api-check.png');

    console.log('\n👀 브라우저를 30초간 열어둡니다...');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ 오류:', error.message);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

