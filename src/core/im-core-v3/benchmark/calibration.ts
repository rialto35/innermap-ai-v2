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

