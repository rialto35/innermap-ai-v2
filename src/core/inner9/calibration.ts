/**
 * Inner9 calibration stubs
 * - Identity by default (safe)
 * - Interface allows future isotonic/platt-like smoothing
 */

import type { InnerNine } from './types';

export type CalibMethod = 'identity' | 'isotonic' | 'platt';

export type CalibOptions = {
  method?: CalibMethod;
  strength?: number; // 0..1, blend toward calibrated
};

// Helper: clamp 0..100
function clip(v: number): number { return Math.max(0, Math.min(100, v)); }

// Helper: linear interpolation on piecewise monotone mapping
function applyIsotonicMapping(x: number, knots: Array<[number, number]>): number {
  const t = clip(x);
  // assume knots sorted by x
  if (t <= knots[0][0]) return knots[0][1];
  if (t >= knots[knots.length - 1][0]) return knots[knots.length - 1][1];
  for (let i = 1; i < knots.length; i++) {
    const [x0, y0] = knots[i - 1];
    const [x1, y1] = knots[i];
    if (t >= x0 && t <= x1) {
      const r = (t - x0) / (x1 - x0 || 1);
      return y0 + r * (y1 - y0);
    }
  }
  return t; // fallback identity
}

// Parse knots from env string: "0:0,50:47,100:100"
function parseKnots(envStr: string | undefined): Array<[number, number]> {
  const fallback: Array<[number, number]> = [[0, 0], [50, 50], [100, 100]];
  if (!envStr) return fallback;
  try {
    const pairs = envStr.split(',').map((p) => p.trim()).filter(Boolean).map((p) => {
      const [a, b] = p.split(':');
      const x = Number(a);
      const y = Number(b);
      return [isNaN(x) ? 0 : x, isNaN(y) ? 0 : y] as [number, number];
    });
    const uniq = pairs.filter((p) => typeof p[0] === 'number' && typeof p[1] === 'number');
    uniq.sort((a, b) => a[0] - b[0]);
    // enforce monotone non-decreasing in y
    for (let i = 1; i < uniq.length; i++) {
      if (uniq[i][1] < uniq[i - 1][1]) uniq[i][1] = uniq[i - 1][1];
    }
    // ensure first/last bounds
    if (uniq[0][0] > 0) uniq.unshift([0, 0]);
    const last = uniq[uniq.length - 1];
    if (last[0] < 100) uniq.push([100, 100]);
    return uniq as Array<[number, number]>;
  } catch {
    return fallback;
  }
}

// Platt-like logistic scaling on 0..100
function applyPlatt(x: number, a: number, b: number): number {
  const t = clip(x) / 100; // 0..1
  const y = 1 / (1 + Math.exp(-a * (t - b)));
  return clip(y * 100);
}

export function calibrateInner9(scores: InnerNine, opts: CalibOptions = {}): InnerNine {
  const method = opts.method || 'identity';
  const strength = Math.max(0, Math.min(1, opts.strength ?? Number(process.env.IM_INNER9_CALIB_STRENGTH || '1')));

  if (method === 'identity' || strength === 0) return { ...scores };

  const out: InnerNine = { ...scores };
  if (method === 'isotonic') {
    const knots = parseKnots(process.env.IM_INNER9_CALIB_KNOTS);
    for (const k of Object.keys(out) as Array<keyof InnerNine>) {
      const base = out[k] as number;
      const mapped = applyIsotonicMapping(base, knots);
      out[k] = clip(base * (1 - strength) + mapped * strength);
    }
    return out;
  }

  if (method === 'platt') {
    const a = Number(process.env.IM_INNER9_CALIB_PLATT_A || '4');
    const b = Number(process.env.IM_INNER9_CALIB_PLATT_B || '0.5');
    for (const k of Object.keys(out) as Array<keyof InnerNine>) {
      const base = out[k] as number;
      const mapped = applyPlatt(base, isNaN(a) ? 4 : a, isNaN(b) ? 0.5 : b);
      out[k] = clip(base * (1 - strength) + mapped * strength);
    }
    return out;
  }

  return out;
}


