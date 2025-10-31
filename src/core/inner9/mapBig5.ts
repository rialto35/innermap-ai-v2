/**
 * Big5 → Inner9 Mapping Engine
 * @module @innermap/inner9
 */

import { Big5, Inner9Config, InnerNine, ComputeResult } from './types';

const DEFAULT_VERSION = 'inner9@1.1.0';

const clip = (v: number) => Math.max(0, Math.min(100, v));
const smoothstep = (t: number) => {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
};
const nonlinearEnabled = process.env.IM_INNER9_NONLINEAR_ENABLED === 'true';

export function mapBig5ToInner9(big5: Big5, cfg: Inner9Config = {}): ComputeResult {
  const w = {
    creation_from_O: cfg.weights?.creation_from_O ?? 1.0,
    will_from_C: cfg.weights?.will_from_C ?? 1.0,
    expression_from_E: cfg.weights?.expression_from_E ?? 1.0,
    harmony_from_A: cfg.weights?.harmony_from_A ?? 1.0,
    sensitivity_from_N: cfg.weights?.sensitivity_from_N ?? 1.0,
  };

  // 기본 매핑(초기 버전): Big5 직결 + 보조 파생(통찰/회복/균형/성장)
  const creation = big5.O * w.creation_from_O;
  const will = big5.C * w.will_from_C;
  const expression = big5.E * w.expression_from_E;
  const harmony = big5.A * w.harmony_from_A;
  // 신경성 N은 '감수성'으로 해석 (높을수록 감정 민감/깊이) — 이후 안정/회복 로직에서 보정
  const sensitivity = big5.N * w.sensitivity_from_N;

  // 파생 속성 (v1 단순식) — 추후 실험으로 조정
  const insight = big5.O * 0.6 + big5.C * 0.4; // 통찰: 창조성+규율
  const resilience = 100 - big5.N; // 회복: 정서 안정
  const balance = 100 - Math.abs(big5.O + big5.E - (big5.C + big5.A)) / 2; // 이성·감정 조화
  const growth = (creation + will + insight + resilience) / 4; // 성장: 핵심 축 평균

  let scores: InnerNine = {
    creation,
    will,
    sensitivity,
    harmony,
    expression,
    insight,
    resilience,
    balance,
    growth,
  };

  // Phase 0: 가벼운 상호작용 항 (flag-guarded)
  if (nonlinearEnabled) {
    // 조화(harmony): 친화성(A) × 외향성(E)의 상호작용 기여
    const interHarmony = (big5.A * big5.E) / 100; // 0..100
    scores.harmony = clip(scores.harmony + 0.3 * interHarmony);

    // 성장(growth): 창조/통찰 평균의 소폭 기여
    const creativeInsight = (scores.creation + scores.insight) / 2;
    scores.growth = clip(scores.growth + 0.2 * creativeInsight);
  }

  // Optional non-linear shaping (Phase 0, lightweight) behind flag
  if (nonlinearEnabled) {
    scores = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => {
        const t = (v as number) / 100;
        const shaped = smoothstep(t) * 100;
        return [k, shaped];
      })
    ) as InnerNine;
  }

  if (cfg.clip0to100 !== false) {
    scores = Object.fromEntries(
      Object.entries(scores).map(([k, v]) => [k, clip(v as number)])
    ) as InnerNine;
  }

  return { scores, modelVersion: DEFAULT_VERSION };
}

