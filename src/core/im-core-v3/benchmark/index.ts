// src/core/im-core-v3/benchmark/index.ts

import { runAllValidations } from "../validator";
import { generate144Combinations, generateBig5, setSeed } from "./generator";
import { aggregateMBTIMetrics, aggregateEnneaMetrics } from "./metrics";
import { plattScaling, temperatureScaling, applyPlatt, applySoftmaxTemp } from "./calibration";
import type { BenchmarkReport, TestRow } from "./types";
import { runIMCoreV3 } from "../index";
import { items60V3 } from "../items60-v3";
import type { Big5Domain } from "../types";

// ========================================
// 메인 벤치마크 실행
// ========================================
export function runCompleteBenchmark(): BenchmarkReport {
  console.log("\n🚀 IM-Core v3.0 완전 벤치마크 시작\n");

  // ========================================
  // Phase 1: 결정론적 극단 케이스 (4개)
  // ========================================
  console.log("📍 Phase 1: 결정론적 극단 케이스\n");
  const phase1 = runAllValidations();

  // Phase 1 정확도 계산
  const phase1MbtiCorrect = phase1.filter((v: any) => {
    const expected = v.scenario.split("+")[0];
    return v.result.mbti.type === expected;
  }).length;

  const phase1EnneaCorrect = phase1.filter((v: any) => {
    const expected = parseInt(v.scenario.split("+")[1]);
    return v.result.enneagram.type === expected;
  }).length;

  console.log(`  ✅ Phase 1 완료: MBTI ${phase1MbtiCorrect}/4, Enneagram ${phase1EnneaCorrect}/4\n`);

  // ========================================
  // Phase 2: 확률적 전수 테스트 (144×R)
  // ========================================
  console.log("📍 Phase 2: 확률적 전수 테스트 (144×20)\n");

  const R = 20;
  const combos = generate144Combinations();
  const phase2Results: TestRow[][] = [];

  for (let r = 0; r < R; r++) {
    setSeed(42 + r);
    console.log(`  반복 ${r + 1}/${R}...`);

    const runResults: TestRow[] = [];

    for (const { mbti, ennea } of combos) {
      const big5 = generateBig5(mbti, ennea);

      // Big5 → 60문항 응답 역산 (개선: facet별 변동 추가)
      const responses: Record<number, 1 | 2 | 3 | 4 | 5> = {};
      
      // Facet별 Big5 값 계산 (domain 평균 + 작은 노이즈)
      const facetNoise: Record<string, number> = {};
      items60V3.forEach((item) => {
        if (!facetNoise[item.facet]) {
          // Facet별 작은 노이즈 (-5 ~ +5)
          facetNoise[item.facet] = (Math.random() - 0.5) * 10;
        }
      });
      
      items60V3.forEach((item) => {
        const domainKey = item.domain.charAt(0) as keyof typeof big5;
        const domainValue = big5[domainKey];
        
        // Facet별 변동 적용
        const facetValue = Math.max(0, Math.min(100, domainValue + facetNoise[item.facet]));
        
        // Likert 변환 (0-100 → 1-5)
        let likert = Math.round((facetValue / 100) * 4 + 1);
        
        // reverse 처리
        if (item.reverse) {
          likert = 6 - likert;
        }
        
        responses[item.id] = Math.max(1, Math.min(5, likert)) as 1 | 2 | 3 | 4 | 5;
      });

      // 엔진 실행
      const result = runIMCoreV3(responses);

      // MBTI 확률 추출
      const mbtiProbs: Record<string, number> = {
        [result.mbti.type]: result.mbti.confidence,
      };

      // Enneagram Top-3
      const enneaTop3 = result.enneagram.candidates
        .sort((a, b) => b.probability - a.probability)
        .slice(0, 3)
        .map((e) => e.type);

      // Enneagram 9개 확률 배열 생성 (candidates는 Top-3만 포함)
      const enneaProbs = Array(9).fill(0);
      for (const candidate of result.enneagram.candidates) {
        enneaProbs[candidate.type - 1] = candidate.probability;
      }

      runResults.push({
        mbti_true: mbti,
        ennea_true: ennea,
        big5_generated: big5,
        mbti_pred: result.mbti.type as any,
        mbti_probs: mbtiProbs,
        ennea_pred: result.enneagram.primary as any,
        ennea_probs: enneaProbs,
        ennea_top3: enneaTop3 as any,
      });
    }

    phase2Results.push(runResults);
  }

  // ========================================
  // Phase 3: 지표 계산 (Before Calibration)
  // ========================================
  console.log("\n📍 Phase 3: 지표 계산 (Before Calibration)\n");

  const mbtiMetricsBefore = aggregateMBTIMetrics(phase2Results);
  const enneaMetricsBefore = aggregateEnneaMetrics(phase2Results);

  console.log("  [Before Calibration]");
  console.log(`  MBTI 정확도: ${(mbtiMetricsBefore.accuracy * 100).toFixed(1)}% ± ${((mbtiMetricsBefore.ci[1] - mbtiMetricsBefore.ci[0]) * 50).toFixed(1)}%`);
  console.log(`  MBTI AUROC: ${mbtiMetricsBefore.auroc.toFixed(3)}, Brier: ${mbtiMetricsBefore.brier.toFixed(3)}, ECE: ${mbtiMetricsBefore.ece.toFixed(3)}`);
  console.log(`  Enneagram Top-1: ${(enneaMetricsBefore.top1 * 100).toFixed(1)}%, Top-3: ${(enneaMetricsBefore.top3 * 100).toFixed(1)}% ± ${((enneaMetricsBefore.ci[1] - enneaMetricsBefore.ci[0]) * 50).toFixed(1)}%`);
  console.log(`  Enneagram NLL: ${enneaMetricsBefore.nll.toFixed(3)}, Brier: ${enneaMetricsBefore.brier.toFixed(3)}, ECE: ${enneaMetricsBefore.ece.toFixed(3)}`);

  // ========================================
  // Phase 3.5: Calibration 적용
  // ========================================
  console.log("\n📍 Phase 3.5: Calibration 적용\n");

  // 70% 학습, 30% 검증 분리
  const trainSize = Math.floor(phase2Results.length * 0.7);
  const trainResults = phase2Results.slice(0, trainSize);
  const testResults = phase2Results.slice(trainSize);

  console.log(`  학습셋: ${trainSize}회 (${trainSize * 144}개 샘플)`);
  console.log(`  검증셋: ${phase2Results.length - trainSize}회 (${(phase2Results.length - trainSize) * 144}개 샘플)`);

  // Platt Scaling 학습 (MBTI)
  console.log("\n  🔧 Platt Scaling 학습 중 (MBTI)...");
  const mbtiLabels = trainResults.flatMap(run => 
    run.map(r => (r.mbti_pred === r.mbti_true ? 1 : 0))
  );
  const mbtiProbs = trainResults.flatMap(run => 
    run.map(r => r.mbti_probs[r.mbti_true] ?? 0.5)
  );
  const plattParams = plattScaling(mbtiProbs, mbtiLabels);
  console.log(`  ✅ Platt 파라미터: a=${plattParams.a.toFixed(3)}, b=${plattParams.b.toFixed(3)}`);

  // Temperature Scaling 학습 (Enneagram)
  console.log("\n  🔧 Temperature Scaling 학습 중 (Enneagram)...");
  const enneaLabels = trainResults.flatMap(run => 
    run.map(r => r.ennea_true - 1)
  );
  const enneaLogits = trainResults.flatMap(run => 
    run.map(r => r.ennea_probs.map(p => Math.log(Math.max(1e-9, p))))
  );
  const tempParam = temperatureScaling(enneaLogits, enneaLabels);
  console.log(`  ✅ Temperature 파라미터: τ=${tempParam.toFixed(3)}`);

  // Calibration 적용 (검증셋)
  console.log("\n  🎯 Calibration 적용 중...");
  const calibratedResults = testResults.map(run => 
    run.map(row => {
      // MBTI Platt Scaling
      const mbtiProbCal = Object.fromEntries(
        Object.entries(row.mbti_probs).map(([type, prob]) => [
          type,
          applyPlatt(prob, plattParams.a, plattParams.b)
        ])
      );

      // Enneagram Temperature Scaling
      const enneaLogits = row.ennea_probs.map(p => Math.log(Math.max(1e-9, p)));
      const enneaProbsCal = applySoftmaxTemp(enneaLogits, tempParam);

      return {
        ...row,
        mbti_probs: mbtiProbCal,
        ennea_probs: enneaProbsCal,
      };
    })
  );

  const mbtiMetricsAfter = aggregateMBTIMetrics(calibratedResults);
  const enneaMetricsAfter = aggregateEnneaMetrics(calibratedResults);

  console.log("\n  [After Calibration]");
  console.log(`  MBTI 정확도: ${(mbtiMetricsAfter.accuracy * 100).toFixed(1)}% ± ${((mbtiMetricsAfter.ci[1] - mbtiMetricsAfter.ci[0]) * 50).toFixed(1)}%`);
  console.log(`  MBTI AUROC: ${mbtiMetricsAfter.auroc.toFixed(3)}, Brier: ${mbtiMetricsAfter.brier.toFixed(3)}, ECE: ${mbtiMetricsAfter.ece.toFixed(3)}`);
  console.log(`  Enneagram Top-1: ${(enneaMetricsAfter.top1 * 100).toFixed(1)}%, Top-3: ${(enneaMetricsAfter.top3 * 100).toFixed(1)}% ± ${((enneaMetricsAfter.ci[1] - enneaMetricsAfter.ci[0]) * 50).toFixed(1)}%`);
  console.log(`  Enneagram NLL: ${enneaMetricsAfter.nll.toFixed(3)}, Brier: ${enneaMetricsAfter.brier.toFixed(3)}, ECE: ${enneaMetricsAfter.ece.toFixed(3)}`);

  console.log("\n  📊 개선도:");
  console.log(`  MBTI ECE: ${mbtiMetricsBefore.ece.toFixed(3)} → ${mbtiMetricsAfter.ece.toFixed(3)} (${((mbtiMetricsAfter.ece - mbtiMetricsBefore.ece) * 100).toFixed(1)}%)`);
  console.log(`  Enneagram ECE: ${enneaMetricsBefore.ece.toFixed(3)} → ${enneaMetricsAfter.ece.toFixed(3)} (${((enneaMetricsAfter.ece - enneaMetricsBefore.ece) * 100).toFixed(1)}%)`);

  // 최종 지표는 After 사용
  const mbtiMetrics = mbtiMetricsAfter;
  const enneaMetrics = enneaMetricsAfter;

  console.log(`  MBTI 정확도: ${(mbtiMetrics.accuracy * 100).toFixed(1)}% ± ${((mbtiMetrics.ci[1] - mbtiMetrics.ci[0]) * 50).toFixed(1)}%`);
  console.log(`  MBTI AUROC: ${mbtiMetrics.auroc.toFixed(3)}, Brier: ${mbtiMetrics.brier.toFixed(3)}, ECE: ${mbtiMetrics.ece.toFixed(3)}`);
  console.log(`  Enneagram Top-1: ${(enneaMetrics.top1 * 100).toFixed(1)}%, Top-3: ${(enneaMetrics.top3 * 100).toFixed(1)}% ± ${((enneaMetrics.ci[1] - enneaMetrics.ci[0]) * 50).toFixed(1)}%`);
  console.log(`  Enneagram NLL: ${enneaMetrics.nll.toFixed(3)}, Brier: ${enneaMetrics.brier.toFixed(3)}, ECE: ${enneaMetrics.ece.toFixed(3)}`);

  // 혼동 패턴 분석
  const confusionMap = new Map<string, number>();
  for (const run of phase2Results) {
    for (const row of run) {
      if (row.mbti_pred !== row.mbti_true || row.ennea_pred !== row.ennea_true) {
        const key = `${row.mbti_true}+${row.ennea_true} → ${row.mbti_pred}+${row.ennea_pred}`;
        confusionMap.set(key, (confusionMap.get(key) ?? 0) + 1);
      }
    }
  }

  const top5Confusion = Array.from(confusionMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([key, count]) => {
      const [combo, pred] = key.split(" → ");
      return { combo, pred, count };
    });

  // ========================================
  // Phase 4: 보고서 생성
  // ========================================
  console.log("\n📍 Phase 4: 보고서 생성\n");

  const report: BenchmarkReport = {
    meta: {
      version: "v3.0-benchmark",
      timestamp: new Date().toISOString(),
      sim_version: "1.0",
      infer_version: "1.0",
      seed: 42,
      R,
    },
    phase1: {
      deterministic: phase1,
      mbti_accuracy: phase1MbtiCorrect / 4,
      ennea_accuracy: phase1EnneaCorrect / 4,
    },
    phase2: {
      mbti: mbtiMetrics,
      enneagram: enneaMetrics,
    },
    calibration: {
      method: "platt+temperature",
      before: { mbti_ece: mbtiMetricsBefore.ece, ennea_ece: enneaMetricsBefore.ece },
      after: { mbti_ece: mbtiMetricsAfter.ece, ennea_ece: enneaMetricsAfter.ece },
      improvement: { 
        mbti: mbtiMetricsBefore.ece - mbtiMetricsAfter.ece, 
        ennea: enneaMetricsBefore.ece - enneaMetricsAfter.ece 
      },
    },
    confusion: {
      top5: top5Confusion,
    },
    recommendations: [
      mbtiMetrics.accuracy < 0.65 ? "⚠️ MBTI 정확도 개선 필요: T_vs_F, J_vs_P 계수 조정" : "",
      enneaMetrics.top3 < 0.70 ? "⚠️ Enneagram Top-3 개선 필요: 가중치 재조정" : "",
      mbtiMetrics.ece > 0.08 ? "⚠️ MBTI ECE 높음: Platt Scaling 적용 권장" : "",
      enneaMetrics.ece > 0.08 ? "⚠️ Enneagram ECE 높음: Temperature Scaling 적용 권장" : "",
    ].filter(Boolean),
  };

  console.log("\n✅ 벤치마크 완료!\n");
  console.log("📊 최종 보고서:\n");
  console.log(JSON.stringify(report, null, 2));

  return report;
}

// ========================================
// CLI 실행
// ========================================
const isMainModule = process.argv[1]?.includes("benchmark");
if (isMainModule) {
  runCompleteBenchmark();
}

