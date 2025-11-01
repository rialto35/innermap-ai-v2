/**
 * Inner9 합성지표 v3.0
 * 
 * 방법론: Big5 파셋 → Inner9 9개 성장지표 (등가가중)
 * 
 * 참조:
 * - Dawes (1979) - 등가가중의 견고성
 * - American Psychologist (1979)
 * 
 * 원칙:
 * - 초기 가중치는 등가가중 (1/N)
 * - 데이터 기반 학습 후 업데이트 (교차검증 필수)
 * - 간명성 제약 (비영 계수 다수 + 파셋군 단위만 허용)
 */

import type { Big5ScoresV3, Inner9V3 } from "./types";
import { standardizeFacetScores } from "./big5-v3";
import config from "./config.json";

/**
 * Inner9 합성지표 계산
 */
export function computeInner9V3(big5: Big5ScoresV3): Inner9V3 {
  // 파셋 z-score 표준화
  const zScores = standardizeFacetScores(big5.facets);
  
  // 9개 지표 계산
  const inner9Raw = {
    탐구심: computeIndicator("탐구심", zScores),
    자기통제: computeIndicator("자기통제", zScores),
    사회관계: computeIndicator("사회관계", zScores),
    리더십: computeIndicator("리더십", zScores),
    협업성: computeIndicator("협업성", zScores),
    정서안정: computeIndicator("정서안정", zScores),
    회복탄력: computeIndicator("회복탄력", zScores),
    몰입: computeIndicator("몰입", zScores),
    성장동기: computeIndicator("성장동기", zScores),
  };
  
  // z-score → T-score 변환 (평균 50, SD 10)
  const inner9Scores = zToTScore(inner9Raw);
  
  // 신뢰구간 계산
  const ci = computeInner9CI(inner9Scores);
  
  return {
    탐구심: inner9Scores.탐구심,
    자기통제: inner9Scores.자기통제,
    사회관계: inner9Scores.사회관계,
    리더십: inner9Scores.리더십,
    협업성: inner9Scores.협업성,
    정서안정: inner9Scores.정서안정,
    회복탄력: inner9Scores.회복탄력,
    몰입: inner9Scores.몰입,
    성장동기: inner9Scores.성장동기,
    ci,
  };
}

/**
 * 지표별 가중합 계산
 */
function computeIndicator(
  indicator: string,
  zScores: Record<string, number>
): number {
  const indicatorConfig = (config.inner9_map as any)[indicator];
  if (!indicatorConfig) return 0;
  
  const { facets } = indicatorConfig;
  
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (const [facet, weight] of Object.entries(facets)) {
    const z = zScores[facet] || 0;
    weightedSum += (weight as number) * z;
    totalWeight += Math.abs(weight as number);
  }
  
  // 등가가중 (정규화)
  return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

/**
 * z-score → T-score 변환
 * 
 * T = 50 + 10 * z
 */
function zToTScore(
  zScores: Record<string, number>
): Record<string, number> {
  const tScores: Record<string, number> = {};
  
  for (const [key, z] of Object.entries(zScores)) {
    const t = 50 + 10 * z;
    tScores[key] = Math.max(0, Math.min(100, Math.round(t)));
  }
  
  return tScores;
}

/**
 * Inner9 신뢰구간 계산 (간소화)
 * 
 * CI ≈ ±5점 (실제는 파셋 CI 전파 계산 필요)
 */
function computeInner9CI(
  inner9: Record<string, number>
): Record<string, [number, number]> {
  const ci: Record<string, [number, number]> = {};
  const SE = 5; // 표준오차 (간소화)
  
  for (const [key, score] of Object.entries(inner9)) {
    const lower = Math.max(0, score - SE);
    const upper = Math.min(100, score + SE);
    ci[key] = [lower, upper];
  }
  
  return ci;
}

/**
 * Inner9 지표 설명
 */
export const INNER9_DESCRIPTIONS: Record<string, { label: string; description: string }> = {
  탐구심: {
    label: "탐구심",
    description: "새로운 지식과 경험을 탐구하려는 동기",
  },
  자기통제: {
    label: "자기통제",
    description: "충동을 조절하고 목표를 향해 나아가는 능력",
  },
  사회관계: {
    label: "사회관계",
    description: "타인과 연결되고 관계를 형성하는 능력",
  },
  리더십: {
    label: "리더십",
    description: "방향을 제시하고 사람들을 이끄는 능력",
  },
  협업성: {
    label: "협업성",
    description: "타인과 협력하고 조화를 이루는 능력",
  },
  정서안정: {
    label: "정서안정",
    description: "스트레스와 불안을 관리하는 능력",
  },
  회복탄력: {
    label: "회복탄력",
    description: "어려움에서 회복하고 성장하는 능력",
  },
  몰입: {
    label: "몰입",
    description: "과업에 집중하고 몰두하는 능력",
  },
  성장동기: {
    label: "성장동기",
    description: "지속적으로 발전하려는 내적 동기",
  },
};

/**
 * Inner9 강점/성장 영역 추출
 */
export function extractStrengthsAndGrowth(
  inner9: Inner9V3
): {
  strengths: Array<{ key: string; score: number; label: string }>;
  growth: Array<{ key: string; score: number; label: string }>;
} {
  const entries = Object.entries(inner9)
    .filter(([key]) => key !== "ci")
    .map(([key, score]) => ({
      key,
      score: score as number,
      label: INNER9_DESCRIPTIONS[key]?.label || key,
    }))
    .sort((a, b) => b.score - a.score);
  
  return {
    strengths: entries.slice(0, 3), // Top 3
    growth: entries.slice(-3).reverse(), // Bottom 3
  };
}

