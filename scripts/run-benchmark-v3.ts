#!/usr/bin/env tsx
/**
 * IM-Core v3.0 벤치마크 실행 스크립트
 */

import { runCompleteBenchmark } from '../src/core/im-core-v3/benchmark/index';

console.log('\n🚀 IM-Core v3.0 벤치마크 시작');
console.log('📋 옵션: repeats=30, mbti=isotonic, ennea=temp-sweep');
console.log('⏱️  예상 소요 시간: ~5-10분\n');

const startTime = Date.now();

try {
  const report = runCompleteBenchmark({
    repeats: 30,
    calibrations: {
      mbti: 'isotonic',
      ennea: { type: 'temp-sweep', grid: [1.3, 1.4, 1.5, 1.6] }
    }
  });
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log('\n\n' + '='.repeat(80));
  console.log('🎉 벤치마크 완료!');
  console.log('='.repeat(80));
  console.log(`⏱️  소요 시간: ${elapsed}초`);
  console.log('\n📊 최종 결과:');
  console.log('─'.repeat(80));
  
  // Phase 1
  console.log('\n📍 Phase 1: 결정론적 극단 케이스');
  console.log(`  MBTI: ${report.phase1.mbti_correct}/4 (${(report.phase1.mbti_correct / 4 * 100).toFixed(0)}%)`);
  console.log(`  Enneagram: ${report.phase1.ennea_correct}/4 (${(report.phase1.ennea_correct / 4 * 100).toFixed(0)}%)`);
  
  // Phase 2 - Before
  console.log('\n📍 Phase 2: 확률적 전수 테스트 (Before Calibration)');
  console.log(`  MBTI 정확도: ${(report.phase2_before.mbti.accuracy * 100).toFixed(1)}%`);
  console.log(`  MBTI AUROC: ${report.phase2_before.mbti.auroc.toFixed(3)}, Brier: ${report.phase2_before.mbti.brier.toFixed(3)}, ECE: ${report.phase2_before.mbti.ece.toFixed(3)}`);
  console.log(`  Enneagram Top-1: ${(report.phase2_before.enneagram.top1 * 100).toFixed(1)}%, Top-3: ${(report.phase2_before.enneagram.top3 * 100).toFixed(1)}%`);
  console.log(`  Enneagram NLL: ${report.phase2_before.enneagram.nll.toFixed(3)}, Brier: ${report.phase2_before.enneagram.brier.toFixed(3)}, ECE: ${report.phase2_before.enneagram.ece.toFixed(3)}`);
  
  // Phase 2 - After
  console.log('\n📍 Phase 2: 확률적 전수 테스트 (After Calibration)');
  console.log(`  MBTI 정확도: ${(report.phase2.mbti.accuracy * 100).toFixed(1)}%`);
  console.log(`  MBTI AUROC: ${report.phase2.mbti.auroc.toFixed(3)}, Brier: ${report.phase2.mbti.brier.toFixed(3)}, ECE: ${report.phase2.mbti.ece.toFixed(3)}`);
  console.log(`  Enneagram Top-1: ${(report.phase2.enneagram.top1 * 100).toFixed(1)}%, Top-3: ${(report.phase2.enneagram.top3 * 100).toFixed(1)}%`);
  console.log(`  Enneagram NLL: ${report.phase2.enneagram.nll.toFixed(3)}, Brier: ${report.phase2.enneagram.brier.toFixed(3)}, ECE: ${report.phase2.enneagram.ece.toFixed(3)}`);
  
  // Calibration 개선도
  console.log('\n📊 Calibration 개선도:');
  const mbtiEceDelta = ((report.phase2.mbti.ece - report.phase2_before.mbti.ece) / report.phase2_before.mbti.ece * 100).toFixed(1);
  const enneaEceDelta = ((report.phase2.enneagram.ece - report.phase2_before.enneagram.ece) / report.phase2_before.enneagram.ece * 100).toFixed(1);
  console.log(`  MBTI ECE: ${report.phase2_before.mbti.ece.toFixed(3)} → ${report.phase2.mbti.ece.toFixed(3)} (${mbtiEceDelta > 0 ? '+' : ''}${mbtiEceDelta}%)`);
  console.log(`  Enneagram ECE: ${report.phase2_before.enneagram.ece.toFixed(3)} → ${report.phase2.enneagram.ece.toFixed(3)} (${enneaEceDelta > 0 ? '+' : ''}${enneaEceDelta}%)`);
  
  // 성공 임계치 체크
  console.log('\n✅ 성공 임계치 체크:');
  const mbtiAurocPass = report.phase2.mbti.auroc >= 0.70;
  const mbtiEcePass = report.phase2.mbti.ece <= 0.15;
  const enneaTop3Pass = report.phase2.enneagram.top3 >= 0.56;
  const enneaEcePass = report.phase2.enneagram.ece <= 0.12;
  
  console.log(`  MBTI AUROC ≥ 0.70: ${report.phase2.mbti.auroc.toFixed(3)} ${mbtiAurocPass ? '✅' : '❌'}`);
  console.log(`  MBTI ECE ≤ 0.15: ${report.phase2.mbti.ece.toFixed(3)} ${mbtiEcePass ? '✅' : '❌'}`);
  console.log(`  Enneagram Top-3 ≥ 0.56: ${(report.phase2.enneagram.top3 * 100).toFixed(1)}% ${enneaTop3Pass ? '✅' : '❌'}`);
  console.log(`  Enneagram ECE ≤ 0.12: ${report.phase2.enneagram.ece.toFixed(3)} ${enneaEcePass ? '✅' : '❌'}`);
  
  const allPass = mbtiAurocPass && mbtiEcePass && enneaTop3Pass && enneaEcePass;
  console.log(`\n🎯 종합 판정: ${allPass ? '✅ 합격' : '⚠️  일부 미달'}`);
  
  // 혼동 패턴
  if (report.confusion && report.confusion.length > 0) {
    console.log('\n🔍 주요 혼동 패턴 (Top 5):');
    report.confusion.slice(0, 5).forEach((c: any, i: number) => {
      console.log(`  ${i + 1}. ${c.combo} → ${c.count}회`);
    });
  }
  
  console.log('\n' + '='.repeat(80));
  
  process.exit(allPass ? 0 : 1);
  
} catch (error) {
  console.error('\n❌ 벤치마크 실행 중 오류 발생:');
  console.error(error);
  process.exit(1);
}

