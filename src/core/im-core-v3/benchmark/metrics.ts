// src/core/im-core-v3/benchmark/metrics.ts

import type { TestRow, AxisMetrics, EnneaMetrics } from "./types";

// ========================================
// Brier Score
// ========================================
export function computeBrier(y_true: number[], y_pred: number[]): number {
  if (y_true.length !== y_pred.length) throw new Error("Length mismatch");
  const sum = y_true.reduce((acc, yt, i) => acc + (y_pred[i] - yt) ** 2, 0);
  return sum / y_true.length;
}

// ========================================
// ECE (Expected Calibration Error)
// ========================================
export function computeECE(y_true: number[], y_pred: number[], bins = 10): number {
  const binEdges = Array.from({ length: bins + 1 }, (_, i) => i / bins);
  let totalError = 0;
  let totalCount = 0;

  for (let b = 0; b < bins; b++) {
    const lower = binEdges[b];
    const upper = binEdges[b + 1];

    const indices = y_pred
      .map((p, i) => (p >= lower && p < upper ? i : -1))
      .filter((i) => i >= 0);

    if (indices.length === 0) continue;

    const binPreds = indices.map((i) => y_pred[i]);
    const binTrues = indices.map((i) => y_true[i]);

    const avgPred = binPreds.reduce((a, b) => a + b, 0) / binPreds.length;
    const avgTrue = binTrues.reduce((a, b) => a + b, 0) / binTrues.length;

    totalError += indices.length * Math.abs(avgPred - avgTrue);
    totalCount += indices.length;
  }

  return totalCount > 0 ? totalError / totalCount : 0;
}

// ========================================
// NLL (Negative Log-Likelihood)
// ========================================
export function computeNLL(y_true: number[], y_pred: number[][]): number {
  const sum = y_true.reduce((acc, label, i) => {
    const prob = y_pred[i][label];
    return acc - Math.log(Math.max(1e-9, prob));
  }, 0);
  return sum / y_true.length;
}

// ========================================
// AUROC (이진 분류)
// ========================================
export function binaryAUROC(y_true: number[], y_score: number[]): number {
  // y_true ∈ {0,1}, y_score ∈ [0,1]
  const pairs = y_true.map((yt, i) => ({ yt, yp: y_score[i] }));
  pairs.sort((a, b) => b.yp - a.yp);

  let tp = 0, fp = 0;
  const P = y_true.filter((y) => y === 1).length;
  const N = y_true.length - P;

  if (P === 0 || N === 0) return 0.5; // 불가능한 경우

  let auc = 0;
  for (const { yt } of pairs) {
    if (yt === 1) {
      tp++;
    } else {
      auc += tp; // 현재까지 누적된 TP
      fp++;
    }
  }

  return auc / (P * N);
}

// ========================================
// Multiclass AUROC (macro-average)
// ========================================
export function multiclassAUROC(trueLabels: number[], probs: number[][]): number {
  const K = probs[0]?.length ?? 0;
  if (K === 0) return 0.5;
  
  const aurocs: number[] = [];
  
  for (let k = 0; k < K; k++) {
    const yTrue = trueLabels.map(y => (y === k ? 1 : 0));
    const yScore = probs.map(p => p[k] ?? 0);
    
    const P = yTrue.filter(y => y === 1).length;
    const N = yTrue.length - P;
    
    if (P > 0 && N > 0) {
      aurocs.push(binaryAUROC(yTrue, yScore));
    }
  }
  
  // macro-average
  return aurocs.length > 0 ? aurocs.reduce((a, b) => a + b, 0) / aurocs.length : 0.5;
}

// Deprecated: 이전 버전 호환용
export function computeAUROC(y_true: number[], y_pred: number[]): number {
  return binaryAUROC(y_true, y_pred);
}

// ========================================
// 95% 신뢰구간 (bootstrap)
// ========================================
export function computeCI(values: number[]): [number, number] {
  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const lower = sorted[Math.floor(n * 0.025)];
  const upper = sorted[Math.floor(n * 0.975)];
  return [lower, upper];
}

// ========================================
// MBTI 지표 집계
// ========================================
export function aggregateMBTIMetrics(results: TestRow[][]): AxisMetrics {
  const accuracies: number[] = [];

  for (const run of results) {
    const correct = run.filter((r) => r.mbti_pred === r.mbti_true).length;
    accuracies.push(correct / run.length);
  }

  const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
  const ci = computeCI(accuracies);

  // AUROC, Brier, ECE는 모든 run 통합 계산
  const allRows = results.flat();
  
  // MBTI 16-class multiclass AUROC (macro-average)
  const mbtiTypes = ['INTJ', 'INTP', 'ENTJ', 'ENTP', 'INFJ', 'INFP', 'ENFJ', 'ENFP',
                     'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ', 'ISTP', 'ISFP', 'ESTP', 'ESFP'];
  
  const mbtiTypeToIdx = Object.fromEntries(mbtiTypes.map((t, i) => [t, i]));
  
  const yTrueIdx = allRows.map(r => mbtiTypeToIdx[r.mbti_true] ?? 0);
  const yProbsMatrix = allRows.map(r => mbtiTypes.map(t => r.mbti_probs[t] ?? 0));
  
  const auroc = multiclassAUROC(yTrueIdx, yProbsMatrix);
  
  // 확률 분포 로깅 (디버깅용)
  const probsTrue = allRows.map((r, i) => yProbsMatrix[i][yTrueIdx[i]]);
  const minProb = Math.min(...probsTrue);
  const maxProb = Math.max(...probsTrue);
  const avgProb = probsTrue.reduce((a, b) => a + b, 0) / probsTrue.length;
  console.log(`  [MBTI AUROC Debug] min/avg/max(prob_true): ${minProb.toFixed(3)}/${avgProb.toFixed(3)}/${maxProb.toFixed(3)}`);
  
  // Brier: 예측 확률 vs 실제 (1 if correct, 0 if wrong)
  const y_true_correct = allRows.map(r => r.mbti_pred === r.mbti_true ? 1 : 0);
  const y_pred_confidence = allRows.map(r => r.mbti_probs[r.mbti_pred] ?? 0.5);
  const brier = computeBrier(y_true_correct, y_pred_confidence);
  
  // ECE: 예측 신뢰도 vs 정확도
  const ece = computeECE(y_true_correct, y_pred_confidence);

  return { accuracy: avgAccuracy, auroc, brier, ece, ci };
}

// ========================================
// Enneagram 지표 집계
// ========================================
export function aggregateEnneaMetrics(results: TestRow[][]): EnneaMetrics {
  const top1s: number[] = [];
  const top3s: number[] = [];

  for (const run of results) {
    const top1 = run.filter((r) => r.ennea_pred === r.ennea_true).length / run.length;
    const top3 = run.filter((r) => r.ennea_top3.includes(r.ennea_true)).length / run.length;
    top1s.push(top1);
    top3s.push(top3);
  }

  const avgTop1 = top1s.reduce((a, b) => a + b, 0) / top1s.length;
  const avgTop3 = top3s.reduce((a, b) => a + b, 0) / top3s.length;
  const ci = computeCI(top3s);

  // NLL, Brier, ECE는 첫 번째 run 기준
  const firstRun = results[0];
  const y_true_labels = firstRun.map((r) => r.ennea_true - 1); // 0-indexed
  const y_pred_probs = firstRun.map((r) => r.ennea_probs);

  const nll = computeNLL(y_true_labels, y_pred_probs);

  // Brier for multi-class (one-hot)
  const brierScores = firstRun.map((r, i) => {
    const oneHot = Array(9).fill(0);
    oneHot[r.ennea_true - 1] = 1;
    return computeBrier(oneHot, r.ennea_probs);
  });
  const brier = brierScores.reduce((a, b) => a + b, 0) / brierScores.length;

  // ECE (Top-1 확률)
  const y_true_binary = firstRun.map((r) => (r.ennea_pred === r.ennea_true ? 1 : 0));
  const y_pred_top1_probs = firstRun.map((r) => r.ennea_probs[r.ennea_pred - 1]);
  const ece = computeECE(y_true_binary, y_pred_top1_probs);

  return { top1: avgTop1, top3: avgTop3, nll, brier, ece, ci };
}

