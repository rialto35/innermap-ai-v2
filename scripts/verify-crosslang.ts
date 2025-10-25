/**
 * Cross-Language Validator
 * JS ↔ Python 결과 비교
 */

import { runAll } from '../src/core/im-core/orchestrator';
import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ComparisonResult {
  identical: boolean;
  differences: string[];
  jsResult: any;
  pythonResult: any;
}

/**
 * Python 엔진 실행
 */
function runPythonEngine(responses: number[]): any {
  try {
    const pythonScript = path.join(__dirname, 'verify-engine.py');
    const responsesJson = JSON.stringify(responses);
    const output = execSync(`python "${pythonScript}" "${responsesJson}"`, { 
      encoding: 'utf-8',
      timeout: 10000 
    });
    return JSON.parse(output);
  } catch (error) {
    console.error('Python 엔진 실행 실패:', error);
    throw error;
  }
}

/**
 * JS 엔진 실행
 */
function runJSEngine(responses: number[]): any {
  return runAll(responses, { 
    weights: { big5: 1, mbti: 0.5, reti: 0.5 } 
  });
}

/**
 * 결과 비교
 */
function compareResults(jsResult: any, pythonResult: any): ComparisonResult {
  const differences: string[] = [];
  
  // Big5 비교 (허용오차 ±10)
  for (const key of ['o', 'c', 'e', 'a', 'n']) {
    const jsVal = jsResult.big5[key];
    const pyVal = pythonResult.big5[key];
    if (Math.abs(jsVal - pyVal) > 10) {
      differences.push(`Big5 ${key}: JS=${jsVal}, Python=${pyVal}`);
    }
  }
  
  // MBTI 비교
  if (jsResult.mbti !== pythonResult.mbti) {
    differences.push(`MBTI: JS=${jsResult.mbti}, Python=${pythonResult.mbti}`);
  }
  
  // RETI 비교 (허용오차 ±1)
  if (Math.abs(jsResult.reti - pythonResult.reti) > 1) {
    differences.push(`RETI: JS=${jsResult.reti}, Python=${pythonResult.reti}`);
  }
  
  // Inner9 비교 (허용오차 ±15)
  for (let i = 0; i < jsResult.inner9.length; i++) {
    const jsVal = jsResult.inner9[i].value;
    const pyVal = pythonResult.inner9[i].value;
    if (Math.abs(jsVal - pyVal) > 15) {
      differences.push(`Inner9 ${i}: JS=${jsVal}, Python=${pyVal}`);
    }
  }
  
  return {
    identical: differences.length === 0,
    differences,
    jsResult,
    pythonResult
  };
}

/**
 * 교차검증 실행
 */
async function runCrossValidation(): Promise<void> {
  console.log('🔄 Cross-Language Validation 시작...');
  
  // 테스트 케이스들
  const testCases = [
    Array(55).fill(4), // 중립
    Array(55).fill(1), // 최저
    Array(55).fill(7), // 최고
    Array.from({ length: 55 }, (_, i) => (i % 7) + 1), // 패턴
  ];
  
  let allPassed = true;
  
  for (let i = 0; i < testCases.length; i++) {
    const responses = testCases[i];
    console.log(`\n📊 테스트 케이스 ${i + 1}: ${responses.slice(0, 5).join(',')}...`);
    
    try {
      const jsResult = runJSEngine(responses);
      const pythonResult = runPythonEngine(responses);
      const comparison = compareResults(jsResult, pythonResult);
      
      if (comparison.identical) {
        console.log('✅ JS ↔ Python 결과 일치');
      } else {
        console.log('❌ JS ↔ Python 결과 불일치:');
        comparison.differences.forEach(diff => console.log(`  - ${diff}`));
        allPassed = false;
      }
    } catch (error) {
      console.error(`❌ 테스트 케이스 ${i + 1} 실패:`, error);
      allPassed = false;
    }
  }
  
  if (allPassed) {
    console.log('\n🎉 모든 교차검증 통과!');
  } else {
    console.log('\n💥 교차검증 실패!');
    process.exit(1);
  }
}

// 스크립트 실행
runCrossValidation().catch(console.error);

export { runCrossValidation };
