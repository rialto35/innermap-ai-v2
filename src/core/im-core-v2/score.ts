import { Likert } from "./types";

const LIKERT_MIN = 1;
const LIKERT_MAX = 7;

export function to01(value: Likert, reverse?: boolean): number {
  const raw = reverse ? (LIKERT_MAX + LIKERT_MIN - value) : value;
  return clamp01((raw - LIKERT_MIN) / (LIKERT_MAX - LIKERT_MIN));
}

export function to100(value01: number): number {
  return Math.round(clamp01(value01) * 100);
}

export function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function ensureLikert(value: number): Likert {
  if (value < LIKERT_MIN) return LIKERT_MIN;
  if (value > LIKERT_MAX) return LIKERT_MAX;
  return value as Likert;
}

export function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}



