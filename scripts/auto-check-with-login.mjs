#!/usr/bin/env node
/**
 * 자동 로그인 유지 및 API 확인
 */

import { chromium } from '@playwright/test';
import { writeFileSync } from 'fs';

const PROD_URL = 'https://innermap-ai-v2.vercel.app';

async function main() {
  console.log('🔍 자동 API 확인 시작...\n');

  const browser = await chromium.launch({ 
    headless: false,
    slowMo: 100 
  });
  
  const context = await browser.newContext({
    // 쿠키 저장을 위한 설정
    storageState: 'logs/auth-state.json'
  }).catch(() => browser.newContext());
  
  const page = await context.newPage();

  const apiResponses = [];

  // API 응답 캡처
  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('/api/imcore/me')) {
      try {
        const data = await response.json();
        apiResponses.push({
          url,
          status: response.status(),
          data
        });
        
        console.log('\n📡 API Response Captured!');
        console.log('   Status:', response.status());
        console.log('   URL:', url);
      } catch (e) {
        console.log('   ⚠️ Failed to parse JSON');
      }
    }
  });

  try {
    // 1. 마이페이지 직접 접속
    console.log('1️⃣ 마이페이지 접속...');
    await page.goto(`${PROD_URL}/mypage`, { waitUntil: 'networkidle' });
    
    // 2. 로그인 필요 여부 확인
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    console.log('   현재 URL:', currentUrl);
    
    if (currentUrl.includes('/login')) {
      console.log('\n⚠️ 로그인 필요 - 자동으로 처리합니다...');
      console.log('👉 브라우저 창을 보시고 로그인해주세요 (2분 대기)');
      
      // 로그인 완료 대기
      await page.waitForURL('**/mypage', { timeout: 120000 });
      console.log('✅ 로그인 완료!');
      
      // 인증 상태 저장
      await context.storageState({ path: 'logs/auth-state.json' });
      console.log('✅ 로그인 상태 저장됨\n');
    } else {
      console.log('✅ 이미 로그인됨\n');
    }

    // 3. 페이지 로드 대기
    console.log('2️⃣ 데이터 로딩 대기...');
    await page.waitForTimeout(3000);
    
    // 4. 페이지 내용 확인
    console.log('\n3️⃣ 페이지 내용 확인...');
    
    const pageText = await page.textContent('body');
    
    // MBTI 찾기
    const mbtiMatch = pageText.match(/MBTI\s+(ISTP|ENTP|INFP|INTJ|ENFP|ISTJ|ISFP|ISFJ|ESTP|ESFP|ESFJ|ESTJ|INTP|INFJ|ENTJ|ENFJ)/i);
    console.log('   페이지 MBTI:', mbtiMatch ? mbtiMatch[1] : '❌ 없음');
    
    // RETI 찾기
    const retiMatch = pageText.match(/RETI\s+R?(\d)/i);
    console.log('   페이지 RETI:', retiMatch ? `R${retiMatch[1]}` : '❌ 없음');
    
    // 에러 메시지 확인
    const hasError = pageText.includes('불러올 수 없습니다') || pageText.includes('Failed');
    console.log('   에러 상태:', hasError ? '⚠️ 에러 있음' : '✅ 정상');

    // 5. API 응답 분석
    console.log('\n4️⃣ API 응답 분석...');
    
    if (apiResponses.length > 0) {
      const latest = apiResponses[apiResponses.length - 1];
      const data = latest.data;
      
      console.log('\n📊 API 데이터:');
      console.log('   Status:', latest.status);
      console.log('   Has Test Result:', data.hasTestResult);
      
      if (data.hero) {
        console.log('\n🦸 Hero:');
        console.log('   Name:', data.hero.name);
        console.log('   MBTI:', data.hero.mbti);
        console.log('   RETI:', data.hero.reti);
        console.log('   Code:', `${data.hero.mbti}-${data.hero.reti}`);
      }
      
      if (data.mbti) {
        console.log('\n📈 Test Results:');
        console.log('   MBTI Type:', data.mbti.type);
        console.log('   RETI Top1:', data.reti?.top1?.[0]);
      }
      
      // 매칭 확인
      if (data.hero && data.mbti) {
        const match = data.hero.mbti === data.mbti.type;
        console.log('\n' + '='.repeat(60));
        console.log(match ? '✅ SUCCESS: Hero 매칭 성공!' : '❌ FAIL: Hero 매칭 실패!');
        console.log('='.repeat(60));
        console.log(`   DB MBTI: ${data.mbti.type}`);
        console.log(`   Hero MBTI: ${data.hero.mbti}`);
        console.log(`   페이지 표시: ${mbtiMatch ? mbtiMatch[1] : 'N/A'}`);
        console.log('='.repeat(60));
      }
      
      // JSON 파일로 저장
      writeFileSync('logs/api-response.json', JSON.stringify(latest, null, 2));
      console.log('\n💾 API 응답 저장: logs/api-response.json');
      
    } else {
      console.log('   ⚠️ API 응답을 캡처하지 못했습니다.');
      console.log('   페이지를 새로고침하여 다시 시도합니다...');
      
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      
      if (apiResponses.length > 0) {
        console.log('   ✅ 새로고침 후 API 응답 캡처됨!');
      }
    }

    // 스크린샷 저장
    await page.screenshot({ path: 'logs/final-check.png', fullPage: true });
    console.log('\n📸 스크린샷 저장: logs/final-check.png');
    
    console.log('\n👀 브라우저를 30초간 열어둡니다. 직접 확인해보세요!');
    await page.waitForTimeout(30000);

  } catch (error) {
    console.error('\n❌ 오류 발생:', error.message);
    await page.screenshot({ path: 'logs/error-final.png', fullPage: true });
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

