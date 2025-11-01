/**
 * Enneagram 확률 매핑 v3.0
 * 
 * 방법론: Big5 파셋 → Enneagram 9유형 softmax
 * 
 * 참조:
 * - Hook et al. (2021) - Enneagram 체계적 검토
 * - Journal of Clinical Psychology (2021)
 * 
 * ⚠️ 주의:
 * - Enneagram은 타당도 연구가 제한적 (Hook et al. 2021)
 * - Top-3 후보 + 확신도로만 제공 (참고/코칭용)
 * - 직접 진단이 아닌 패턴 매칭 결과
 * - 임상/선발 의사결정에 사용 금지
 */

import type { Big5ScoresV3, EnneagramResultV3, EnneagramCandidate, MBTIResultV3 } from "./types";
import { standardizeFacetScores } from "./big5-v3";
import config from "./config.json";

/**
 * Big5 → Enneagram 확률 매핑
 */
export function mapToEnneagram(
  big5: Big5ScoresV3,
  mbti: MBTIResultV3
): EnneagramResultV3 {
  // 파셋 z-score 표준화
  const zScores = standardizeFacetScores(big5.facets);
  
  // 9개 유형별 점수 계산
  const rawScores = computeEnneagramScores(zScores);
  
  // MBTI prior 보정 (약하게)
  const adjustedScores = applyMBTIPrior(rawScores, mbti.type);
  
  // Softmax 확률화
  const probabilities = softmax(adjustedScores);
  
  // Top-3 후보 추출
  const candidates = extractTopCandidates(probabilities, 3);
  
  return {
    candidates,
    primary: candidates[0].type,
    note: "참고용 패턴 매칭 결과입니다. Enneagram은 자기성찰과 전문가 상담을 통해 확인하는 것이 가장 정확합니다.",
  };
}

/**
 * 9개 유형별 점수 계산 (가중합)
 */
function computeEnneagramScores(
  zScores: Record<string, number>
): Record<number, number> {
  const scores: Record<number, number> = {};
  const weights = config.enneagram_map.weights;
  
  for (let type = 1; type <= 9; type++) {
    const typeWeights = (weights as any)[type.toString()];
    if (!typeWeights) {
      scores[type] = 0;
      continue;
    }
    
    let score = 0;
    for (const [facet, weight] of Object.entries(typeWeights)) {
      const z = zScores[facet] || 0;
      score += (weight as number) * z;
    }
    
    scores[type] = score;
  }
  
  return scores;
}

/**
 * MBTI prior 보정
 * 
 * 문헌 기반 약한 보정 (Hook et al. 2021)
 */
function applyMBTIPrior(
  scores: Record<number, number>,
  mbtiType: string
): Record<number, number> {
  const adjusted = { ...scores };
  
  // NT 유형 → 5번 (관찰자) 보정
  if (mbtiType.includes("NT")) {
    adjusted[5] = (adjusted[5] || 0) + 0.3;
  }
  
  // NF 유형 → 4번 (창조자), 2번 (조력자) 보정
  if (mbtiType.includes("NF")) {
    adjusted[4] = (adjusted[4] || 0) + 0.2;
    adjusted[2] = (adjusted[2] || 0) + 0.15;
  }
  
  // INFP → 4번 강화 (Round 2 튜닝)
  if (mbtiType === "INFP") {
    adjusted[4] = (adjusted[4] || 0) + 0.6;
    adjusted[2] = (adjusted[2] || 0) - 0.3; // 2번 약화
  }
  
  // ENFJ → 8번 (도전자) 보정 (사용자 피드백 반영, 1차 튜닝 강화)
  if (mbtiType === "ENFJ") {
    adjusted[8] = (adjusted[8] || 0) + 0.6;
    adjusted[2] = (adjusted[2] || 0) + 0.3;
    adjusted[3] = (adjusted[3] || 0) + 0.2;
  }
  
  // SJ 유형 → 1번 (완벽주의자), 6번 (충성가) 보정
  if (mbtiType.includes("SJ")) {
    adjusted[1] = (adjusted[1] || 0) + 0.4;
    adjusted[6] = (adjusted[6] || 0) + 0.2;
  }
  
  // ESTJ → 1번 강화 (2차 튜닝)
  if (mbtiType === "ESTJ") {
    adjusted[1] = (adjusted[1] || 0) + 0.5;
    adjusted[8] = (adjusted[8] || 0) - 0.3; // 8번 약화
  }
  
  // SP 유형 → 7번 (열정가), 9번 (평화주의자) 보정
  if (mbtiType.includes("SP")) {
    adjusted[7] = (adjusted[7] || 0) + 0.2;
    adjusted[9] = (adjusted[9] || 0) + 0.15;
  }
  
  return adjusted;
}

/**
 * Softmax 확률화
 * 
 * P(i) = exp(x_i) / Σ exp(x_j)
 */
function softmax(scores: Record<number, number>): Record<number, number> {
  const expScores: Record<number, number> = {};
  let sumExp = 0;
  
  // exp(x_i) 계산
  for (const [type, score] of Object.entries(scores)) {
    const expScore = Math.exp(score);
    expScores[Number(type)] = expScore;
    sumExp += expScore;
  }
  
  // 정규화
  const probabilities: Record<number, number> = {};
  for (const [type, expScore] of Object.entries(expScores)) {
    probabilities[Number(type)] = expScore / sumExp;
  }
  
  return probabilities;
}

/**
 * Top-N 후보 추출
 */
function extractTopCandidates(
  probabilities: Record<number, number>,
  topN: number = 3
): EnneagramCandidate[] {
  const sorted = Object.entries(probabilities)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN);
  
  return sorted.map(([type, prob], idx) => ({
    type: Number(type) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
    probability: Math.round(prob * 100) / 100,
    confidence: idx === 0 ? "high" : idx === 1 ? "medium" : "low",
  }));
}

/**
 * Enneagram 유형 설명 (간략)
 */
export function getEnneagramDescription(type: number): string {
  const descriptions: Record<number, string> = {
    1: "완벽주의자 - 원칙적이고 이상주의적",
    2: "조력자 - 관대하고 헌신적",
    3: "성취자 - 적응력 있고 성공 지향적",
    4: "창조자 - 감성적이고 개성 있는",
    5: "관찰자 - 지적이고 통찰력 있는",
    6: "충성가 - 책임감 있고 안전 지향적",
    7: "열정가 - 자발적이고 다재다능한",
    8: "도전자 - 자신감 있고 결단력 있는",
    9: "평화주의자 - 수용적이고 안정 추구",
  };
  
  return descriptions[type] || "알 수 없는 유형";
}

/**
 * Enneagram 날개 (Wing) 추정
 * 
 * 예: 8w7 (8번 + 7번 날개), 8w9 (8번 + 9번 날개)
 */
export function estimateWing(
  primary: number,
  candidates: EnneagramCandidate[]
): string {
  if (candidates.length < 2) return `${primary}`;
  
  const secondary = candidates[1].type;
  
  // 인접 유형만 날개로 인정
  const adjacent = [
    primary === 1 ? 9 : primary - 1,
    primary === 9 ? 1 : primary + 1,
  ];
  
  if (adjacent.includes(secondary)) {
    return `${primary}w${secondary}`;
  }
  
  return `${primary}`;
}

