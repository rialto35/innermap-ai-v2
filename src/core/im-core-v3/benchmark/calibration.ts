// src/core/im-core-v3/benchmark/calibration.ts

import { computeBrier, computeNLL } from "./metrics";

const logit = (p: number) => Math.log(Math.max(1e-9, p) / (1 - Math.max(1e-9, p)));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

// ========================================
// Platt Scaling
// ========================================
export function plattScaling(probs: number[], labels: number[]): { a: number; b: number } {
  let bestA = 1.0, bestB = 0.0, bestLoss = Infinity;

  for (let a = 0.5; a <= 2.0; a += 0.1) {
    for (let b = -2.0; b <= 2.0; b += 0.2) {
      const calibrated = probs.map((p) => sigmoid(a * logit(p) + b));
      const loss = computeBrier(labels, calibrated);
      if (loss < bestLoss) {
        bestLoss = loss;
        bestA = a;
        bestB = b;
      }
    }
  }

  return { a: bestA, b: bestB };
}

// ========================================
// Temperature Scaling
// ========================================
export function temperatureScaling(logits: number[][], labels: number[]): number {
  let bestT = 1.0, bestLoss = Infinity;

  for (let T = 0.5; T <= 3.0; T += 0.1) {
    const probs = logits.map((l) => softmaxTemp(l, T));
    const loss = computeNLL(labels, probs);
    if (loss < bestLoss) {
      bestLoss = loss;
      bestT = T;
    }
  }

  return bestT;
}

function softmaxTemp(xs: number[], tau: number): number[] {
  const m = Math.max(...xs);
  const exps = xs.map((x) => Math.exp((x - m) / tau));
  const den = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / den);
}

// ========================================
// Apply Calibration
// ========================================
export function applyPlatt(prob: number, a: number, b: number): number {
  return sigmoid(a * logit(prob) + b);
}

export function applySoftmaxTemp(logits: number[], tau: number): number[] {
  return softmaxTemp(logits, tau);
}

// ========================================
// Isotonic Regression (PAV Algorithm)
// ========================================
export function isotonicFit(probs: number[], labels: number[]) {
  // probs ∈ [0,1], labels ∈ {0,1}
  // 정렬 후 PAV (Pool Adjacent Violators)
  const idx = probs.map((p, i) => [p, labels[i], i] as [number, number, number])
    .sort((a, b) => a[0] - b[0]);
  
  const xs = idx.map(x => x[0]);
  const ys = idx.map(x => x[1]);
  
  // 블록 초기화
  const blocks: { sumW: number; sumY: number; start: number; end: number }[] = [];
  
  for (let i = 0; i < xs.length; i++) {
    blocks.push({ sumW: 1, sumY: ys[i], start: i, end: i });
    
    // 단조 위반 시 병합
    while (blocks.length >= 2) {
      const b2 = blocks[blocks.length - 1];
      const b1 = blocks[blocks.length - 2];
      if (b1.sumY / b1.sumW <= b2.sumY / b2.sumW) break;
      
      const merged = {
        sumW: b1.sumW + b2.sumW,
        sumY: b1.sumY + b2.sumY,
        start: b1.start,
        end: b2.end
      };
      blocks.pop();
      blocks.pop();
      blocks.push(merged);
    }
  }
  
  // 예측 함수 만들기
  const fitted: number[] = new Array(xs.length);
  for (const b of blocks) {
    const v = b.sumY / b.sumW;
    for (let i = b.start; i <= b.end; i++) fitted[i] = v;
  }
  
  // 원래 순서로 복원
  const out: number[] = new Array(xs.length);
  for (let i = 0; i < idx.length; i++) {
    out[idx[i][2]] = Math.min(1, Math.max(0, fitted[i]));
  }
  
  return {
    xs,
    fitted,
    predict: (p: number) => {
      // 최근접 보간 (계단 함수)
      // 정렬된 xs 기준 이진탐색
      let lo = 0, hi = xs.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (xs[mid] < p) lo = mid + 1; else hi = mid;
      }
      return out[lo];
    }
  };
}

export function isotonicCalibrateMBTI(rawProbs: number[], labels: number[]): number[] {
  // 클래스별 독립 보정
  const fit = isotonicFit(rawProbs, labels);
  return rawProbs.map(p => fit.predict(p));
}

// ========================================
// Temperature Sweep (Grid Search)
// ========================================
export function sweepTemperature(
  logitsList: number[][],
  trueLabels: number[],
  grid = [1.3, 1.4, 1.5, 1.6]
): { bestT: number; bestECE: number; results: Array<{ tau: number; ece: number }> } {
  let bestT = grid[0], bestECE = Number.POSITIVE_INFINITY;
  const results: Array<{ tau: number; ece: number }> = [];
  
  for (const t of grid) {
    const probs = logitsList.map(z => softmaxTemp(z, t));
    const ece = computeECE_multi(trueLabels, probs);
    results.push({ tau: t, ece });
    
    if (ece < bestECE) {
      bestECE = ece;
      bestT = t;
    }
  }
  
  return { bestT, bestECE, results };
}

// ========================================
// Multi-class ECE (Expected Calibration Error)
// ========================================
export function computeECE_multi(
  trueLabels: number[],
  probsList: number[][],
  nBins = 10
): number {
  // 각 샘플의 최대 확률과 예측 클래스 추출
  const maxProbs: number[] = [];
  const predLabels: number[] = [];
  
  for (const probs of probsList) {
    let maxProb = 0;
    let maxIdx = 0;
    for (let i = 0; i < probs.length; i++) {
      if (probs[i] > maxProb) {
        maxProb = probs[i];
        maxIdx = i;
      }
    }
    maxProbs.push(maxProb);
    predLabels.push(maxIdx);
  }
  
  // Binning
  const bins: Array<{ conf: number; acc: number; count: number }> = [];
  for (let b = 0; b < nBins; b++) {
    bins.push({ conf: 0, acc: 0, count: 0 });
  }
  
  for (let i = 0; i < maxProbs.length; i++) {
    const conf = maxProbs[i];
    const correct = predLabels[i] === trueLabels[i] ? 1 : 0;
    const binIdx = Math.min(nBins - 1, Math.floor(conf * nBins));
    
    bins[binIdx].conf += conf;
    bins[binIdx].acc += correct;
    bins[binIdx].count += 1;
  }
  
  // ECE 계산
  let ece = 0;
  const total = maxProbs.length;
  
  for (const bin of bins) {
    if (bin.count === 0) continue;
    const avgConf = bin.conf / bin.count;
    const avgAcc = bin.acc / bin.count;
    ece += (bin.count / total) * Math.abs(avgConf - avgAcc);
  }
  
  return ece;
}

