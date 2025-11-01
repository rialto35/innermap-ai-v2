/**
 * MBTI 확률 매핑 v3.0
 * 
 * 방법론: Big5 파셋 → MBTI 4축 로지스틱 회귀
 * 
 * 참조:
 * - McCrae & Costa (1989) - Big5 ↔ MBTI 상관관계
 * - Soto & John (2017) - BFI-2 구조
 * - Pittenger (2005) - MBTI 주의점
 * 
 * ⚠️ 주의:
 * - MBTI는 직접 측정이 아닌 Big5 기반 확률 추정
 * - 경계 영역 (0.4~0.6)은 양자 표기 권장
 * - 임상/선발 의사결정에 사용 금지
 */

import type { Big5ScoresV3, MBTIResultV3, MBTIProbability } from "./types";
import { standardizeFacetScores } from "./big5-v3";
import config from "./config.json";

/**
 * Big5 → MBTI 확률 매핑
 */
export function mapToMBTI(big5: Big5ScoresV3): MBTIResultV3 {
  // 파셋 z-score 표준화
  const zScores = standardizeFacetScores(big5.facets);
  
  // 4축 독립 확률 계산
  const probE = computeAxisProbability("E_vs_I", zScores);
  const probN = computeAxisProbability("S_vs_N", zScores);
  const probF = computeAxisProbability("T_vs_F", zScores);
  const probP = computeAxisProbability("J_vs_P", zScores);
  
  const probabilities: MBTIProbability = {
    E: probE,
    I: 1 - probE,
    S: 1 - probN,
    N: probN,
    T: 1 - probF,
    F: probF,
    J: 1 - probP,
    P: probP,
  };
  
  // 최빈 유형
  const type = 
    (probE > 0.5 ? "E" : "I") +
    (probN > 0.5 ? "N" : "S") +
    (probF > 0.5 ? "F" : "T") +
    (probP > 0.5 ? "P" : "J");
  
  // 경계 플래그 (0.4~0.6)
  const boundary = {
    EI: probE > 0.4 && probE < 0.6,
    SN: probN > 0.4 && probN < 0.6,
    TF: probF > 0.4 && probF < 0.6,
    JP: probP > 0.4 && probP < 0.6,
  };
  
  // 전체 확신도 (경계에서 멀수록 높음)
  const confidence = [probE, probN, probF, probP]
    .map(p => Math.abs(p - 0.5) * 2) // 0~1
    .reduce((a, b) => a + b, 0) / 4;
  
  // 양자 표기 (경계 시)
  let alternativeType: string | undefined;
  if (Object.values(boundary).some(b => b)) {
    const alternatives: string[] = [];
    
    if (boundary.EI) alternatives.push(`${probE > 0.5 ? "E" : "I"}/${probE > 0.5 ? "I" : "E"}`);
    else alternatives.push(probE > 0.5 ? "E" : "I");
    
    if (boundary.SN) alternatives.push(`${probN > 0.5 ? "N" : "S"}/${probN > 0.5 ? "S" : "N"}`);
    else alternatives.push(probN > 0.5 ? "N" : "S");
    
    if (boundary.TF) alternatives.push(`${probF > 0.5 ? "F" : "T"}/${probF > 0.5 ? "T" : "F"}`);
    else alternatives.push(probF > 0.5 ? "F" : "T");
    
    if (boundary.JP) alternatives.push(`${probP > 0.5 ? "P" : "J"}/${probP > 0.5 ? "J" : "P"}`);
    else alternatives.push(probP > 0.5 ? "P" : "J");
    
    alternativeType = alternatives.join("");
  }
  
  return {
    type,
    probabilities,
    boundary,
    confidence: Math.round(confidence * 100) / 100,
    alternativeType,
  };
}

/**
 * 로지스틱 회귀로 축 확률 계산
 * 
 * P(축) = σ(a0 + Σ a_i * z_i)
 * σ(x) = 1 / (1 + exp(-x))
 */
function computeAxisProbability(
  axis: "E_vs_I" | "S_vs_N" | "T_vs_F" | "J_vs_P",
  zScores: Record<string, number>
): number {
  const axisConfig = (config.mbti_map as any)[axis];
  if (!axisConfig) return 0.5; // 기본값
  
  const { intercept, coeff } = axisConfig;
  
  // 선형 조합: a0 + Σ a_i * z_i
  let linearCombination = intercept;
  for (const [facet, weight] of Object.entries(coeff)) {
    const z = zScores[facet] || 0;
    linearCombination += (weight as number) * z;
  }
  
  // 로지스틱 함수
  return logistic(linearCombination);
}

/**
 * 로지스틱 함수 (시그모이드)
 */
function logistic(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

/**
 * MBTI 유형 설명 (간략)
 */
export function getMBTIDescription(type: string): string {
  const descriptions: Record<string, string> = {
    INTJ: "전략가 - 독립적이고 논리적인 계획가",
    INTP: "논리학자 - 호기심 많은 분석가",
    ENTJ: "통솔자 - 대담하고 결단력 있는 리더",
    ENTP: "변론가 - 영리하고 호기심 많은 사색가",
    INFJ: "옹호자 - 이상주의적이고 통찰력 있는 조력자",
    INFP: "중재자 - 이상주의적이고 창의적인 몽상가",
    ENFJ: "선도자 - 카리스마 있고 영감을 주는 리더",
    ENFP: "활동가 - 열정적이고 창의적인 자유로운 영혼",
    ISTJ: "현실주의자 - 실용적이고 사실 중심적인 관리자",
    ISFJ: "수호자 - 헌신적이고 따뜻한 보호자",
    ESTJ: "경영자 - 효율적이고 조직적인 관리자",
    ESFJ: "집정관 - 배려심 많고 사교적인 조력자",
    ISTP: "장인 - 대담하고 실용적인 실험가",
    ISFP: "모험가 - 유연하고 매력적인 예술가",
    ESTP: "사업가 - 영리하고 활기찬 모험가",
    ESFP: "연예인 - 자발적이고 열정적인 엔터테이너",
  };
  
  return descriptions[type] || "알 수 없는 유형";
}

