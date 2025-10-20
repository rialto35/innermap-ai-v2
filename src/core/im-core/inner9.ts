/**
 * Inner9 score computation with MBTI/RETI weighting
 * Enhanced with type-based adjustments and robust validation
 */

import { clamp100, safeNumber } from "@/lib/schemas/inner9";
import type { Big5 } from "@/core/im-core/types";

export type MbtiType = `${"I"|"E"}${"N"|"S"}${"T"|"F"}${"J"|"P"}`;
export type RetiType = 1|2|3|4|5|6|7|8|9;

export type Inner9Base = {
  creation: number;
  will: number;
  sensitivity: number;
  harmony: number;
  expression: number;
  insight: number;
  resilience: number;
  balance: number;
  growth: number;
};

/**
 * Compute base Inner9 scores from Big5 percentiles
 */
export function computeInner9Base(big5: Record<keyof Big5, number>): Inner9Base {
  const O = safeNumber(big5.O);
  const C = safeNumber(big5.C);
  const E = safeNumber(big5.E);
  const A = safeNumber(big5.A);
  const N = safeNumber(big5.N);

  const creation = O;
  const will = C;
  const sensitivity = N;
  const harmony = A;
  const expression = E;

  const insight = (O + (100 - N) * 0.5);
  const resilience = (100 - N);
  const balance = (O + C + E + A + (100 - N)) / 5;
  const growth = (O * 0.4 + C * 0.3 + (100 - N) * 0.3);

  const raw = { creation, will, sensitivity, harmony, expression, insight, resilience, balance, growth };
  
  // NaN/Infinity 보호 + 반올림 + 0~100 clamp
  const safe = Object.fromEntries(
    Object.entries(raw).map(([k, v]) => [k, clamp100(Number.isFinite(v) ? v : 0)])
  );
  
  return safe as Inner9Base;
}

/**
 * Compute Inner9 scores with MBTI/RETI type weighting
 */
export function computeInner9Scores(
  big5: Record<keyof Big5, number>,
  mbti?: MbtiType,
  reti?: RetiType,
  enableTypeWeights = true
): Inner9Base {
  const base = computeInner9Base(big5);
  
  if (!enableTypeWeights || !mbti || !reti) {
    return base;
  }

  // --- MBTI 가중 ---
  let insightAdj = 1.0;
  let growthAdj = 1.0;
  
  const is = (ch: string) => mbti.includes(ch);

  if (is("N")) insightAdj += 0.10;
  if (is("S")) { insightAdj -= 0.05; growthAdj += 0.10; }
  if (is("T")) insightAdj += 0.05;
  if (is("F")) growthAdj += 0.05;
  if (is("J")) growthAdj += 0.10;
  if (is("P")) { insightAdj += 0.05; growthAdj -= 0.05; }

  // --- RETI 가중 ---
  const logic = [1, 5, 9];
  const express = [2, 3, 7];
  const will = [4, 6, 8];
  
  if (logic.includes(reti)) insightAdj += 0.10;
  if (express.includes(reti)) growthAdj += 0.10;
  if (will.includes(reti)) { insightAdj += 0.05; growthAdj += 0.05; }

  const out = { ...base };
  out.insight = clamp100(base.insight * insightAdj);
  out.growth = clamp100(base.growth * growthAdj);
  
  console.log('🔍 [Inner9] Type-weighted scores:', {
    mbti, reti, insightAdj, growthAdj,
    insight: out.insight, growth: out.growth
  });

  return out;
}

/**
 * Legacy compatibility - use computeInner9Scores instead
 * @deprecated Use computeInner9Scores with proper parameters
 */
export function computeInner9ScoresLegacy(big5: any, mbti: any): Inner9Base {
  return computeInner9Base(big5);
}



