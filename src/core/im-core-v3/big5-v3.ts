/**
 * Big5 채점 엔진 v3.0
 * 
 * 방법론:
 * 1. CTT (Classical Test Theory) - 등가가중 (1/N)
 * 2. IRT (Item Response Theory) - 간소화 버전 (실제는 mirt 패키지 권장)
 * 3. 표준화 - z-score → T-score (평균 50, SD 10)
 * 
 * 참조:
 * - Dawes (1979) - 등가가중의 견고성
 * - Embretson & Reise (2000, 2013) - IRT 기본서
 * - Soto & John (2017) - BFI-2 구조
 */

import type { Big5ScoresV3, ItemMetaV3, Likert5, Big5Domain, Big5Facet } from "./types";

// 파셋 → 영역 매핑
const FACET_TO_DOMAIN: Record<Big5Facet, Big5Domain> = {
  curiosity: "O",
  aesthetic: "O",
  innovation: "O",
  order: "C",
  grit: "C",
  self_control: "C",
  sociability: "E",
  vitality: "E",
  assertiveness: "E",
  empathy: "A",
  cooperation: "A",
  modesty: "A",
  anxiety: "N",
  impulsivity: "N",
  stress_vulnerability: "N",
};

// 영역 → 파셋 매핑
const DOMAIN_TO_FACETS: Record<Big5Domain, Big5Facet[]> = {
  O: ["curiosity", "aesthetic", "innovation"],
  C: ["order", "grit", "self_control"],
  E: ["sociability", "vitality", "assertiveness"],
  A: ["empathy", "cooperation", "modesty"],
  N: ["anxiety", "impulsivity", "stress_vulnerability"],
};

/**
 * Big5 채점 메인 함수
 */
export function scoreBig5V3(
  responses: Record<number, Likert5>,
  items: ItemMetaV3[]
): Big5ScoresV3 {
  // Step 1: 역문항 변환 및 파셋별 평균 계산
  const facetScores = computeFacetScores(responses, items);
  
  // Step 2: 영역별 평균 계산 (3개 파셋의 평균)
  const domainScores = computeDomainScores(facetScores);
  
  // Step 3: IRT θ 추정 (간소화)
  const theta = estimateTheta(domainScores);
  
  // Step 4: 신뢰구간 계산
  const ci = computeConfidenceIntervals(theta, domainScores);
  const facetCI = computeFacetConfidenceIntervals(facetScores);
  
  return {
    ...domainScores,
    facets: facetScores,
    theta,
    ci,
    facetCI,
  };
}

/**
 * 파셋별 평균 계산 (등가가중 1/N)
 */
function computeFacetScores(
  responses: Record<number, Likert5>,
  items: ItemMetaV3[]
): Record<Big5Facet, number> {
  const facetScores: Partial<Record<Big5Facet, number>> = {};
  const facetItems: Partial<Record<Big5Facet, ItemMetaV3[]>> = {};
  
  // 파셋별 문항 그룹화
  for (const item of items) {
    if (!facetItems[item.facet]) {
      facetItems[item.facet] = [];
    }
    facetItems[item.facet]!.push(item);
  }
  
  // 파셋별 평균 계산
  for (const [facet, facetItemList] of Object.entries(facetItems)) {
    const scores: number[] = [];
    
    for (const item of facetItemList!) {
      const raw = responses[item.id];
      if (raw === undefined) continue; // 결측치 처리
      
      // 역문항 변환: x' = 6 - x
      const score = item.reverse ? (6 - raw) : raw;
      scores.push(score);
    }
    
    if (scores.length === 0) {
      facetScores[facet as Big5Facet] = 50; // 기본값 (중립)
      continue;
    }
    
    // 등가가중 평균 (1/N)
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // 1-5 → 0-100 변환: (mean - 1) * 25
    facetScores[facet as Big5Facet] = Math.round((mean - 1) * 25);
  }
  
  return facetScores as Record<Big5Facet, number>;
}

/**
 * 영역별 평균 계산 (3개 파셋의 평균)
 */
function computeDomainScores(
  facetScores: Record<Big5Facet, number>
): Record<Big5Domain, number> {
  const domainScores: Partial<Record<Big5Domain, number>> = {};
  
  for (const [domain, facets] of Object.entries(DOMAIN_TO_FACETS)) {
    const scores = facets.map(f => facetScores[f]);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    domainScores[domain as Big5Domain] = Math.round(mean);
  }
  
  return domainScores as Record<Big5Domain, number>;
}

/**
 * IRT θ 추정 (간소화 버전)
 * 
 * 실제 프로덕션에서는 mirt 패키지 (R) 또는 pyirt (Python) 사용 권장
 * 여기서는 z-score 근사로 간소화
 */
function estimateTheta(
  domainScores: Record<Big5Domain, number>
): Record<Big5Domain, number> {
  const theta: Partial<Record<Big5Domain, number>> = {};
  
  for (const [domain, score] of Object.entries(domainScores)) {
    // z-score 근사: (score - 50) / 10
    // 가정: 평균 50, SD 10 (T-score 기준)
    theta[domain as Big5Domain] = (score - 50) / 10;
  }
  
  return theta as Record<Big5Domain, number>;
}

/**
 * 95% 신뢰구간 계산
 * 
 * CI = θ ± 1.96 * SE
 * SE ≈ 0.3 (간소화, 실제는 정보함수 I(θ)로 계산)
 */
function computeConfidenceIntervals(
  theta: Record<Big5Domain, number>,
  domainScores: Record<Big5Domain, number>
): Record<Big5Domain, [number, number]> {
  const ci: Partial<Record<Big5Domain, [number, number]>> = {};
  const SE = 0.3; // 표준오차 (간소화)
  
  for (const [domain, t] of Object.entries(theta)) {
    const lower = Math.max(0, Math.round((t - 1.96 * SE) * 10 + 50));
    const upper = Math.min(100, Math.round((t + 1.96 * SE) * 10 + 50));
    ci[domain as Big5Domain] = [lower, upper];
  }
  
  return ci as Record<Big5Domain, [number, number]>;
}

/**
 * 파셋별 신뢰구간 계산 (간소화)
 */
function computeFacetConfidenceIntervals(
  facetScores: Record<Big5Facet, number>
): Record<Big5Facet, [number, number]> {
  const ci: Partial<Record<Big5Facet, [number, number]>> = {};
  const SE_FACET = 5; // 파셋 SE (간소화)
  
  for (const [facet, score] of Object.entries(facetScores)) {
    const lower = Math.max(0, score - SE_FACET);
    const upper = Math.min(100, score + SE_FACET);
    ci[facet as Big5Facet] = [lower, upper];
  }
  
  return ci as Record<Big5Facet, [number, number]>;
}

/**
 * z-score 표준화 (파셋 점수 기준)
 */
export function standardizeFacetScores(
  facetScores: Record<Big5Facet, number>
): Record<Big5Facet, number> {
  const zScores: Partial<Record<Big5Facet, number>> = {};
  
  for (const [facet, score] of Object.entries(facetScores)) {
    // z = (x - 50) / 10
    zScores[facet as Big5Facet] = (score - 50) / 10;
  }
  
  return zScores as Record<Big5Facet, number>;
}

