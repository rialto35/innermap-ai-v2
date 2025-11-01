import type { Big5Scores, Inner9Map } from "./types";

export function computeInner9(big5: Big5Scores): Inner9Map {
  const O = clamp(big5.O);
  const C = clamp(big5.C);
  const E = clamp(big5.E);
  const A = clamp(big5.A);
  const N = clamp(big5.N);

  const creation = O;
  const will = C;
  const expression = E;
  let harmony = A;
  const sensitivity = N;
  const insight = Math.round(0.6 * O + 0.4 * C);
  const resilience = Math.round(100 - N);
  // Balance: 기존 공식 사용 (O+E와 C+A의 균형)
  const balance = Math.round(100 - Math.abs((O + E) - (C + A)) / 2);
  const growth = Math.round(creation * 0.3 + will * 0.3 + insight * 0.2 + resilience * 0.2);

  if (process.env.IM_INNER9_NONLINEAR_ENABLED === 'true') {
    harmony = clamp(harmony + 0.3 * ((A * E) / 100));
  }

  return { creation, will, expression, harmony, sensitivity, insight, resilience, balance: clamp(balance), growth: clamp(growth) };
}

function clamp(v: number): number {
  if (v < 0) return 0;
  if (v > 100) return 100;
  return Math.round(v);
}



