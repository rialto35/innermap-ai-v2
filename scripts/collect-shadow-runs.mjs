#!/usr/bin/env node
/**
 * 섀도런 로그 수집 스크립트
 * ENGINE_V2 플래그 활성화 상태에서 분석 API 호출 → 콘솔 로그 수집
 */

import fs from 'fs/promises';
import path from 'path';

const SAMPLE_REQUESTS = [
  {
    name: 'INTJ_high_O',
    body: {
      answers: Array(55).fill(5).map((v, i) => {
        if ([1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51].includes(i + 1)) return 7; // O 높음
        if ([3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53].includes(i + 1)) return 6; // E 중간
        return v;
      }),
      mbti: 'INTJ',
      reti: 5,
      birthYear: 1990,
      gender: 'male'
    }
  },
  {
    name: 'ENFP_high_E',
    body: {
      answers: Array(55).fill(5).map((v, i) => {
        if ([3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53].includes(i + 1)) return 7; // E 높음
        if ([4, 9, 14, 19, 24, 29, 34, 39, 44, 49, 54].includes(i + 1)) return 6; // A 높음
        return v;
      }),
      mbti: 'ENFP',
      reti: 7,
      birthYear: 1995,
      gender: 'female'
    }
  },
  {
    name: 'ISTJ_high_C',
    body: {
      answers: Array(55).fill(5).map((v, i) => {
        if ([2, 7, 12, 17, 22, 27, 32, 37, 42, 47, 52].includes(i + 1)) return 7; // C 높음
        if ([5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].includes(i + 1)) return 3; // N 낮음
        return v;
      }),
      mbti: 'ISTJ',
      reti: 1,
      birthYear: 1985,
      gender: 'male'
    }
  }
];

async function collectShadowRuns() {
  console.log('🔍 섀도런 수집 시작...\n');
  
  const results = [];
  
  const port = process.env.PORT || process.env.NEXT_PORT || 3000;
  for (const sample of SAMPLE_REQUESTS) {
    console.log(`📊 테스트: ${sample.name}`);
    
    try {
      const response = await fetch(`http://localhost:${port}/api/test/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: sample.body.answers,
          profile: { birthdate: `${sample.body.birthYear}-01-01`, gender: sample.body.gender },
          engineVersion: 'imcore-1.0.0'
        })
      });
      
      if (!response.ok) {
        console.error(`  ❌ 실패: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      // 서버 로그에서 섀도런 정보 추출 (실제로는 서버 로그 파일 파싱 필요)
      // 여기서는 응답 데이터만 저장
      results.push({
        name: sample.name,
        mbti: data?.summary?.mbti,
        reti: data?.summary?.world?.reti ?? sample.body.reti,
        inner9: data?.premium?.inner9 ?? null,
        big5: data?.summary?.big5 ?? null,
        timestamp: new Date().toISOString()
      });
      
      console.log(`  ✅ 완료`);
      
    } catch (error) {
      console.error(`  ❌ 오류:`, error.message);
    }
    
    // Rate limit 방지
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // 결과 저장
  const outputPath = path.join(process.cwd(), 'logs', 'shadow-runs.json');
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✅ 수집 완료: ${results.length}개 샘플`);
  console.log(`📁 저장 위치: ${outputPath}`);
}

collectShadowRuns().catch(console.error);

