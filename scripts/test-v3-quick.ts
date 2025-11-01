/**
 * IM-Core v3.0 빠른 테스트 (144×5)
 */

import { runCompleteBenchmark } from '../src/core/im-core-v3/benchmark/index';

console.log('\n🚀 IM-Core v3.0 빠른 테스트 (144×5)');
console.log('⏱️  예상 소요 시간: ~1-2분\n');

const startTime = Date.now();

const report = runCompleteBenchmark({
  repeats: 5,
  calibrations: {
    mbti: 'isotonic',
    ennea: { type: 'temp-sweep', grid: [1.3, 1.4, 1.5, 1.6] }
  }
});

const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

console.log('\n\n' + '='.repeat(80));
console.log('🎉 테스트 완료!');
console.log('='.repeat(80));
console.log(`⏱️  소요 시간: ${elapsed}초\n`);

console.log('📊 Phase 2 결과 (After Calibration):');
console.log(`  MBTI 정확도: ${(report.phase2.mbti.accuracy * 100).toFixed(1)}%`);
console.log(`  MBTI AUROC: ${report.phase2.mbti.auroc.toFixed(3)}, ECE: ${report.phase2.mbti.ece.toFixed(3)}`);
console.log(`  Enneagram Top-3: ${(report.phase2.enneagram.top3 * 100).toFixed(1)}%, ECE: ${report.phase2.enneagram.ece.toFixed(3)}`);

console.log('\n✅ 성공 임계치 체크:');
console.log(`  MBTI AUROC ≥ 0.70: ${report.phase2.mbti.auroc.toFixed(3)} ${report.phase2.mbti.auroc >= 0.70 ? '✅' : '❌'}`);
console.log(`  MBTI ECE ≤ 0.15: ${report.phase2.mbti.ece.toFixed(3)} ${report.phase2.mbti.ece <= 0.15 ? '✅' : '❌'}`);
console.log(`  Enneagram Top-3 ≥ 0.56: ${(report.phase2.enneagram.top3 * 100).toFixed(1)}% ${report.phase2.enneagram.top3 >= 0.56 ? '✅' : '❌'}`);
console.log(`  Enneagram ECE ≤ 0.12: ${report.phase2.enneagram.ece.toFixed(3)} ${report.phase2.enneagram.ece <= 0.12 ? '✅' : '❌'}`);

console.log('\n' + '='.repeat(80));

