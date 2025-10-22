/**
 * Inner9 modifiers for MBTI / RETI
 * Lightweight, bounded adjustments designed to preserve Big5-based stability
 */

import type { InnerNine } from './types';

const clamp = (v: number) => Math.max(0, Math.min(100, v));

type Inner9Delta = Partial<Record<keyof InnerNine, number>>;

/**
 * Apply MBTI-based small deltas to Inner9 dimensions
 * alpha: typical absolute delta magnitude (0..100 scale). Default 5
 */
export function applyMbtiModifier(base: InnerNine, mbti?: string, alpha = 5): InnerNine {
  if (!mbti || typeof mbti !== 'string' || mbti.length < 4) return base;
  const type = mbti.toUpperCase();
  const dims: Inner9Delta = {};

  // E vs I
  if (type[0] === 'E') {
    dims.expression = (dims.expression ?? 0) + alpha; // 표현 ↑
  } else {
    dims.sensitivity = (dims.sensitivity ?? 0) + alpha; // 감수성 ↑
  }

  // N vs S
  if (type[1] === 'N') {
    dims.insight = (dims.insight ?? 0) + alpha; // 통찰 ↑
  } else {
    dims.balance = (dims.balance ?? 0) + alpha; // 균형 ↑
  }

  // T vs F
  if (type[2] === 'T') {
    dims.will = (dims.will ?? 0) + Math.round(alpha * 0.6);
    dims.creation = (dims.creation ?? 0) + Math.round(alpha * 0.4);
  } else {
    dims.harmony = (dims.harmony ?? 0) + alpha; // 조화 ↑
  }

  // J vs P
  if (type[3] === 'J') {
    dims.balance = (dims.balance ?? 0) + Math.round(alpha * 0.7);
    dims.resilience = (dims.resilience ?? 0) + Math.round(alpha * 0.3);
  } else {
    dims.resilience = (dims.resilience ?? 0) + Math.round(alpha * 0.7);
  }

  // Apply deltas
  const out: InnerNine = { ...base };
  (Object.keys(dims) as (keyof InnerNine)[]).forEach((k) => {
    out[k] = clamp((out[k] as number) + (dims[k] as number));
  });
  return out;
}

/**
 * Apply RETI-based small deltas to Inner9 dimensions
 * reti: 'r1'..'r9' or 1..9
 * beta: typical absolute delta magnitude (0..100 scale). Default 4
 */
export function applyRetiModifier(base: InnerNine, reti?: string | number, beta = 4): InnerNine {
  if (reti === undefined || reti === null) return base;
  let t: number | null = null;
  if (typeof reti === 'string') {
    const m = reti.toLowerCase().match(/r?(\d)/);
    if (m) t = parseInt(m[1], 10);
  } else if (typeof reti === 'number') {
    t = reti;
  }
  if (!t || t < 1 || t > 9) return base;

  const dims: Inner9Delta = {};
  switch (t) {
    case 1: dims.balance = (dims.balance ?? 0) + beta; dims.will = (dims.will ?? 0) + beta; break;
    case 2: dims.harmony = (dims.harmony ?? 0) + beta; dims.sensitivity = (dims.sensitivity ?? 0) + beta; break;
    case 3: dims.expression = (dims.expression ?? 0) + beta; dims.will = (dims.will ?? 0) + beta; break;
    case 4: dims.sensitivity = (dims.sensitivity ?? 0) + beta; dims.creation = (dims.creation ?? 0) + beta; break;
    case 5: dims.insight = (dims.insight ?? 0) + beta; dims.balance = (dims.balance ?? 0) + beta; break;
    case 6: dims.resilience = (dims.resilience ?? 0) + beta; dims.balance = (dims.balance ?? 0) + beta; break;
    case 7: dims.growth = (dims.growth ?? 0) + beta; dims.expression = (dims.expression ?? 0) + beta; break;
    case 8: dims.will = (dims.will ?? 0) + beta; dims.resilience = (dims.resilience ?? 0) + beta; break;
    case 9: dims.harmony = (dims.harmony ?? 0) + beta; dims.balance = (dims.balance ?? 0) + beta; break;
  }

  const out: InnerNine = { ...base };
  (Object.keys(dims) as (keyof InnerNine)[]).forEach((k) => {
    out[k] = clamp((out[k] as number) + (dims[k] as number));
  });
  return out;
}


