#!/usr/bin/env node
/**
 * 전체 검사 플로우 테스트
 * - 개발용 로그인
 * - 55문항 답변
 * - 결과 확인
 */

import { chromium } from '@playwright/test';

async function main() {
  console.log('🚀 검사 플로우 테스트 시작...\n');
  
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 콘솔 로그 캡처
  page.on('console', msg => {
    const type = msg.type();
    if (type === 'error' || type === 'warning' || msg.text().includes('API') || msg.text().includes('TestProfile')) {
      console.log(`[Browser ${type.toUpperCase()}]`, msg.text());
    }
  });
  
  // 네트워크 요청 캡처
  page.on('request', request => {
    if (request.url().includes('/api/test/analyze')) {
      console.log(`[Network] → POST ${request.url()}`);
    }
  });
  
  page.on('response', async response => {
    if (response.url().includes('/api/test/analyze')) {
      const status = response.status();
      console.log(`[Network] ← ${status} ${response.url()}`);
      if (status !== 200) {
        try {
          const body = await response.text();
          console.log(`[Network] Response body:`, body);
        } catch (e) {
          console.log(`[Network] Could not read response body`);
        }
      }
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

    // 2. 검사 페이지로 이동
    console.log('2️⃣ 검사 페이지로 이동...');
    await page.goto('http://localhost:3000/test/questions');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    console.log('✅ 검사 페이지 로드 완료\n');

    // 3. 55개 문항 자동 답변
    console.log('3️⃣ 55개 문항 답변 중...');
    
    // Zustand persist 형식으로 localStorage에 저장
    await page.evaluate(() => {
      const answers = {};
      for (let i = 1; i <= 55; i++) {
        // Question ID 형식: q_001, q_002, ...
        const questionId = `q_${String(i).padStart(3, '0')}`;
        answers[questionId] = Math.floor(Math.random() * 7) + 1; // 1-7 랜덤
      }
      
      const stateData = {
        state: {
          index: 54, // 마지막 문항
          answers: answers,
          startedAt: Date.now() - 300000, // 5분 전 시작
        },
        version: 1
      };
      
      localStorage.setItem('innermap-analyze-state', JSON.stringify(stateData));
    });
    
    // 페이지 새로고침하여 답변 로드
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    console.log('✅ 답변 완료\n');

    // 4. 제출 버튼 찾기 및 클릭
    console.log('4️⃣ 검사 제출 중...');
    
    // 마지막 페이지로 이동
    for (let i = 0; i < 10; i++) {
      const nextButton = page.getByRole('button', { name: /다음/ });
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(500);
      }
    }
    
    // 제출 버튼 클릭 (검사 완료)
    const completeButton = page.getByRole('button', { name: /검사 완료/ });
    if (await completeButton.isVisible()) {
      await completeButton.click();
      console.log('✅ 검사 완료 버튼 클릭\n');
    }

    // 5. 프로필 페이지 대기
    console.log('5️⃣ 프로필 페이지 대기 중...');
    await page.waitForURL('**/test/profile**', { timeout: 10000 });
    await page.waitForTimeout(1000);
    
    // 6. 프로필 입력
    console.log('6️⃣ 프로필 입력 중...');
    
    // 성별 선택 (라디오 버튼)
    const maleRadio = page.locator('input[type="radio"][value="male"]');
    if (await maleRadio.isVisible()) {
      await maleRadio.click();
      console.log('  ✓ 성별 선택: 남성');
    }
    
    // 생년월일 입력
    const birthdateInput = page.locator('input[type="date"], input[placeholder*="년-월-일"]');
    if (await birthdateInput.isVisible()) {
      await birthdateInput.fill('1990-01-01');
      console.log('  ✓ 생년월일 입력: 1990-01-01');
    }
    
    // 이메일 입력
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('test@example.com');
      console.log('  ✓ 이메일 입력: test@example.com');
    }
    
    // 개인정보 동의 체크박스
    const consentCheckbox = page.locator('input[type="checkbox"]').first();
    if (await consentCheckbox.isVisible()) {
      await consentCheckbox.check();
      console.log('  ✓ 개인정보 동의 체크');
    }
    
    await page.waitForTimeout(500);
    
    // 제출 버튼 클릭
    const submitButton = page.getByRole('button', { name: /다음|제출|분석 시작/i });
    if (await submitButton.isVisible()) {
      await submitButton.click();
      console.log('✅ 프로필 제출 완료\n');
    }

    // 7. 결과 페이지 대기 (API 호출 시간 고려하여 60초로 증가)
    console.log('7️⃣ 결과 처리 대기 중...');
    await page.waitForURL('**/result/summary**', { timeout: 60000 });
    await page.waitForTimeout(3000);
    
    console.log('✅ 결과 페이지 도달\n');

    // 8. 결과 확인
    console.log('8️⃣ 결과 데이터 확인 중...');
    
    const hasHeroName = await page.getByText(/영웅|Hero/).first().isVisible().catch(() => false);
    const hasUnknownHero = await page.getByText('Unknown Hero').isVisible().catch(() => false);
    
    if (hasHeroName && !hasUnknownHero) {
      console.log('✅ 영웅 데이터 정상 로드');
    } else if (hasUnknownHero) {
      console.log('⚠️ Unknown Hero 표시됨 - 데이터 매칭 문제');
    } else {
      console.log('⚠️ 영웅 데이터 확인 불가');
    }

    // 7. 스크린샷 저장
    await page.screenshot({ path: 'logs/test-result-screenshot.png', fullPage: true });
    console.log('📸 스크린샷 저장: logs/test-result-screenshot.png\n');

    // 9. 내 결과 페이지 확인
    console.log('9️⃣ 내 결과 페이지 확인...');
    await page.goto('http://localhost:3000/results');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: 'logs/test-results-page.png', fullPage: true });
    console.log('📸 스크린샷 저장: logs/test-results-page.png\n');

    console.log('🎉 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 실패:', error.message);
    await page.screenshot({ path: 'logs/test-error-screenshot.png', fullPage: true });
    console.log('📸 에러 스크린샷 저장: logs/test-error-screenshot.png');
  } finally {
    await browser.close();
  }
}

main().catch(console.error);

