// src/core/im-core-v3/benchmark/generator.ts

import type { MBTI, Ennea, Big5 } from "./types";

// ========================================
// PRNG (Linear Congruential Generator)
// ========================================
let _seed = 42;
export function setSeed(s: number) {
  _seed = s >>> 0;
}

function rand(): number {
  _seed = (1664525 * _seed + 1013904223) >>> 0;
  return _seed / 2 ** 32;
}

function randn(): number {
  // Box-Muller transform
  const u1 = Math.max(1e-9, rand());
  const u2 = rand();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// ========================================
// μ (MBTI 기대치) - 축별 단조성 강화
// ========================================
const MU: Record<string, Partial<Big5>> = {
  E: { E: 72 },
  I: { E: 28 },
  N: { O: 68 },
  S: { O: 42 },
  F: { A: 62 },
  T: { A: 48 },
  J: { C: 68 },
  P: { C: 45 },
};

// ========================================
// δ (Enneagram 편향) - 절반으로 축소
// ========================================
const DELTA: Record<Ennea, Partial<Big5>> = {
  1: { C: +6, A: +1 },
  2: { A: +6 },
  3: { E: +4, C: +2 },
  4: { N: +6, O: +3 },
  5: { O: +5, E: -4 },
  6: { N: +5, C: +2 },
  7: { E: +6, N: -2 },
  8: { E: +5, A: -4 },
  9: { A: +4, N: -4 },
};

// ========================================
// σ (노이즈 표준편차) - Round 3: 8 → 6
// ========================================
const SIGMA: Big5 = { O: 6, C: 6, E: 6, A: 6, N: 6 };

function clamp(x: number): number {
  return Math.max(0, Math.min(100, x));
}

// 축별 scale 보정 (중앙 → 끝으로 당기기)
function pullToEnds(x: number, center = 50, k = 0.15): number {
  return center + (x - center) * (1 + k);
}

// ========================================
// 확률적 Big5 발생
// ========================================
export function generateBig5(mbti: MBTI, ennea: Ennea): Big5 {
  // 1) μ 조립 (MBTI 4글자)
  let O = 50, C = 50, E = 50, A = 50, N = 50;

  for (const ch of mbti) {
    const m = MU[ch];
    if (m?.O !== undefined) O = (O + m.O) / 2;
    if (m?.C !== undefined) C = (C + m.C) / 2;
    if (m?.E !== undefined) E = (E + m.E) / 2;
    if (m?.A !== undefined) A = (A + m.A) / 2;
  }

  // 1.5) pullToEnds 적용 (O, C, E, A만)
  O = pullToEnds(O);
  C = pullToEnds(C);
  E = pullToEnds(E);
  A = pullToEnds(A);

  // 2) δ 적용 (Enneagram 편향)
  const d = DELTA[ennea];
  O += d.O ?? 0;
  C += d.C ?? 0;
  E += d.E ?? 0;
  A += d.A ?? 0;
  N += d.N ?? 0;

  // 3) ε 노이즈 첨가
  O = clamp(O + SIGMA.O * randn());
  C = clamp(C + SIGMA.C * randn());
  E = clamp(E + SIGMA.E * randn());
  A = clamp(A + SIGMA.A * randn());
  N = clamp(N + SIGMA.N * randn());

  return { O, C, E, A, N };
}

// ========================================
// 144 조합 생성
// ========================================
export function generate144Combinations(): Array<{ mbti: MBTI; ennea: Ennea }> {
  const mbtiTypes: MBTI[] = [
    "INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP",
    "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP",
  ];
  const enneaTypes: Ennea[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const combos: Array<{ mbti: MBTI; ennea: Ennea }> = [];
  for (const mbti of mbtiTypes) {
    for (const ennea of enneaTypes) {
      combos.push({ mbti, ennea });
    }
  }
  return combos;
}

