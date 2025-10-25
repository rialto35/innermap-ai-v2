/**
 * 골든 데이터 업데이트 스크립트
 * 실제 엔진 결과를 기반으로 골든 데이터를 업데이트
 */

import { runAll } from '../src/lib/engine/orchestrator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateGoldenData() {
  console.log('🔄 골든 데이터 업데이트 시작...');
  
  const goldenDir = path.join(__dirname, '../tests/fixtures/golden');
  const goldenFiles = fs.readdirSync(goldenDir).filter(f => f.endsWith('.json'));
  
  for (const file of goldenFiles) {
    const filePath = path.join(goldenDir, file);
    const golden = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    console.log(`\n📊 ${golden.name} 업데이트 중...`);
    
    // 실제 엔진으로 결과 생성
    const result = runAll(golden.responses, { 
      weights: { big5: 1, mbti: 0.5, reti: 0.5 } 
    });
    
    // 기대값 업데이트
    golden.expect = {
      big5: result.big5,
      mbti: result.mbti,
      reti: result.reti,
      inner9: result.inner9
    };
    
    // 파일 저장
    fs.writeFileSync(filePath, JSON.stringify(golden, null, 2));
    
    console.log(`✅ ${golden.name} 업데이트 완료`);
    console.log(`   Big5: O${result.big5.o} C${result.big5.c} E${result.big5.e} A${result.big5.a} N${result.big5.n}`);
    console.log(`   MBTI: ${result.mbti}`);
    console.log(`   RETI: ${result.reti}`);
  }
  
  console.log('\n🎉 모든 골든 데이터 업데이트 완료!');
}

// 스크립트 실행
updateGoldenData().catch(console.error);

export { updateGoldenData };
