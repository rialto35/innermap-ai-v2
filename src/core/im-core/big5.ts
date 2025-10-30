/**
 * Big5 성격 분석 엔진
 * 55문항 응답을 Big5 점수로 변환
 */

import { RawResponse } from './types';
import { normalizeLikert, to100, normalizeBig5 } from './normalization';
import { getBig5Mapping } from './big5.config';

export type Big5Scores = { o: number; c: number; e: number; a: number; n: number };

/**
 * 55문항 응답을 Big5 점수로 변환
 */
export function toBig5(responses: RawResponse): Big5Scores {
  const v2 = process.env.IM_ENGINE_V2_ENABLED === 'true';

  if (!v2) {
    // Legacy behavior (deterministic but coarse)
    const avg = responses.reduce((acc, val) => acc + val, 0) / responses.length;
    const seed = responses.slice(0, 5).reduce((acc, val) => acc + val, 0);
    return normalizeBig5({
      o: avg * 12 + (seed % 4),
      c: avg * 12 + ((seed + 1) % 4),
      e: avg * 12 + ((seed + 2) % 4),
      a: avg * 12 + ((seed + 3) % 4),
      n: avg * 12 + ((seed + 4) % 4),
    });
  }

  // V2: question-mapped scoring with optional reverse items (Phase 0)
  const map = getBig5Mapping();

  const calc = (items: number[], reverseSet: Set<number>, weights: number[]) => {
    if (!items.length) return 50;
    const ws = (weights && weights.length === items.length) ? weights : items.map(() => 1);
    const totalW = ws.reduce((s, w) => s + w, 0);
    const sum = items.reduce((acc, idx, i) => {
      const raw = responses[idx - 1]; // 1-based index
      const v = reverseSet.has(idx) ? (8 - raw) : raw; // reverse 1↔7
      const norm01 = normalizeLikert(v); // 0..1
      return acc + ws[i] * norm01;
    }, 0);
    return to100(sum / totalW); // 0..100
  };

  const o = calc(map.O.items, new Set(map.O.reverse), map.O.weights);
  const c = calc(map.C.items, new Set(map.C.reverse), map.C.weights);
  const e = calc(map.E.items, new Set(map.E.reverse), map.E.weights);
  const a = calc(map.A.items, new Set(map.A.reverse), map.A.weights);
  const n = calc(map.N.items, new Set(map.N.reverse), map.N.weights);

  return normalizeBig5({ o, c, e, a, n });
}
