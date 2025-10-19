/**
 * Big5 Scoring Module
 * Handles Big5 score calculation and percentile conversion
 */

import type { Big5 } from '../inner9/types';

export interface Big5Norms {
  O: { mean: number; sd: number };
  C: { mean: number; sd: number };
  E: { mean: number; sd: number };
  A: { mean: number; sd: number };
  N: { mean: number; sd: number };
}

// Default norms (based on general population data)
// TODO: Replace with actual Korean population norms
const DEFAULT_NORMS: Big5Norms = {
  O: { mean: 0.65, sd: 0.15 },
  C: { mean: 0.60, sd: 0.16 },
  E: { mean: 0.55, sd: 0.18 },
  A: { mean: 0.70, sd: 0.14 },
  N: { mean: 0.45, sd: 0.17 },
};

/**
 * Error function approximation for normal distribution
 * Used in percentile calculation
 */
function erf(x: number): number {
  // Abramowitz and Stegun approximation
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);

  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return sign * y;
}

/**
 * Convert raw score to percentile using normal distribution
 * 
 * @param rawScore - Raw score (0-1 range)
 * @param mean - Population mean
 * @param sd - Population standard deviation
 * @returns Percentile (0-100)
 */
export function toPercentile(rawScore: number, mean: number, sd: number): number {
  if (sd === 0) return 50; // Avoid division by zero
  
  const z = (rawScore - mean) / sd;
  const percentile = 50 * (1 + erf(z / Math.sqrt(2)));
  
  return Math.max(0, Math.min(100, Math.round(percentile)));
}

/**
 * Convert Big5 raw scores to percentiles
 * 
 * @param big5 - Raw Big5 scores (0-1 range)
 * @param norms - Population norms (optional, uses defaults if not provided)
 * @returns Big5 percentiles (0-100)
 */
export function big5ToPercentiles(
  big5: Big5,
  norms: Big5Norms = DEFAULT_NORMS
): Record<keyof Big5, number> {
  return {
    O: toPercentile(big5.O, norms.O.mean, norms.O.sd),
    C: toPercentile(big5.C, norms.C.mean, norms.C.sd),
    E: toPercentile(big5.E, norms.E.mean, norms.E.sd),
    A: toPercentile(big5.A, norms.A.mean, norms.A.sd),
    N: toPercentile(big5.N, norms.N.mean, norms.N.sd),
  };
}

/**
 * Validate Big5 scores
 * 
 * @param big5 - Big5 scores to validate
 * @returns true if valid, false otherwise
 */
export function validateBig5(big5: Partial<Big5>): big5 is Big5 {
  const required: (keyof Big5)[] = ['O', 'C', 'E', 'A', 'N'];
  
  for (const key of required) {
    const value = big5[key];
    if (typeof value !== 'number' || value < 0 || value > 1) {
      return false;
    }
  }
  
  return true;
}

/**
 * Normalize Big5 scores to 0-1 range
 * 
 * @param big5 - Big5 scores (any range)
 * @param maxValue - Maximum value in the input range (default: 100)
 * @returns Normalized Big5 scores (0-1)
 */
export function normalizeBig5(
  big5: Record<keyof Big5, number>,
  maxValue: number = 100
): Big5 {
  return {
    O: Math.max(0, Math.min(1, big5.O / maxValue)),
    C: Math.max(0, Math.min(1, big5.C / maxValue)),
    E: Math.max(0, Math.min(1, big5.E / maxValue)),
    A: Math.max(0, Math.min(1, big5.A / maxValue)),
    N: Math.max(0, Math.min(1, big5.N / maxValue)),
  };
}

