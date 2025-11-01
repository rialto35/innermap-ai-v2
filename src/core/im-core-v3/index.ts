/**
 * IM-Core v3.0 - Research Prototype
 * 
 * 연구용 프로토타입: 자기이해/코칭 목적
 * 
 * ⚠️ 중요 면책 조항:
 * 
 * 이 엔진은 연구용 프로토타입입니다.
 * 
 * 검증되지 않은 사항:
 * - 실제 피험자 데이터 부족 (n < 100)
 * - 통계적 신뢰도 미검증 (Cronbach's α, 재검사 신뢰도)
 * - 측정불변성 미확인 (성별/연령/문화)
 * - IRT 파라미터 미추정 (간소화 공식 사용)
 * 
 * 사용 금지:
 * - 임상 진단 또는 치료 결정
 * - 채용, 승진, 선발 등 의사결정
 * - 법적 또는 공식 평가
 * 
 * 권장 사항:
 * - 결과를 참고용으로만 활용
 * - 전문가 상담 병행
 * - 100명 이상 파일럿 테스트 필요
 * 
 * 참조:
 * - Soto & John (2017) - BFI-2 구조
 * - Dawes (1979) - 등가가중의 견고성
 * - Hook et al. (2021) - Enneagram 체계적 검토
 * - Pittenger (2005) - MBTI 주의점
 */

import type { EngineResultV3, Likert5, ItemMetaV3 } from "./types";
import { scoreBig5V3 } from "./big5-v3";
import { mapToMBTI } from "./mbti-mapper";
import { mapToEnneagram } from "./ennea-mapper";
import { computeInner9V3 } from "./inner9-v3";
import { items60V3 } from "./items60-v3";

/**
 * IM-Core v3.0 메인 실행 함수
 * 
 * @param responses - 60문항 응답 (1~5 Likert)
 * @param items - 문항 메타데이터 (기본값: items60V3)
 * @returns EngineResultV3
 */
export function runIMCoreV3(
  responses: Record<number, Likert5> | Likert5[],
  items: ItemMetaV3[] = items60V3
): EngineResultV3 {
  const startTime = Date.now();
  
  // 입력 정규화
  const normalizedResponses = normalizeResponses(responses);
  
  // 검증
  const validation = validateResponses(normalizedResponses, items);
  if (!validation.valid) {
    throw new Error(`입력 검증 실패: ${validation.errors.join(", ")}`);
  }
  
  // Step 1: Big5 측정 (CTT + IRT)
  const big5 = scoreBig5V3(normalizedResponses, items);
  
  // Step 2: MBTI 확률 매핑 (로지스틱)
  const mbti = mapToMBTI(big5);
  
  // Step 3: Enneagram 패턴 매칭 (softmax)
  const enneagram = mapToEnneagram(big5, mbti);
  
  // Step 4: Inner9 합성지표 (등가가중)
  const inner9 = computeInner9V3(big5);
  
  const completionTime = Date.now() - startTime;
  
  // 경고 메시지 생성
  const warnings: string[] = [];
  if (mbti.confidence < 0.6) {
    warnings.push("MBTI 확신도가 낮습니다. 경계 영역일 수 있습니다.");
  }
  if (enneagram.candidates[0].probability < 0.3) {
    warnings.push("Enneagram 확률이 낮습니다. 여러 유형의 특성을 공유할 수 있습니다.");
  }
  if (validation.warnings.length > 0) {
    warnings.push(...validation.warnings);
  }
  
  return {
    version: "v3.0-research",
    timestamp: new Date().toISOString(),
    big5,
    mbti,
    enneagram,
    inner9,
    metadata: {
      itemCount: items.length,
      completionTime,
      flags: [
        "RESEARCH_PROTOTYPE",
        "NOT_FOR_CLINICAL_USE",
        "NOT_FOR_HIRING_DECISIONS",
        "REQUIRES_EXPERT_VALIDATION",
      ],
      warnings,
    },
  };
}

/**
 * 응답 정규화
 */
function normalizeResponses(
  responses: Record<number, Likert5> | Likert5[]
): Record<number, Likert5> {
  if (Array.isArray(responses)) {
    const normalized: Record<number, Likert5> = {};
    responses.forEach((value, index) => {
      normalized[index + 1] = value;
    });
    return normalized;
  }
  return responses;
}

/**
 * 응답 검증
 */
function validateResponses(
  responses: Record<number, Likert5>,
  items: ItemMetaV3[]
): { valid: boolean; errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // 문항 수 확인
  const responseCount = Object.keys(responses).length;
  if (responseCount < items.length * 0.75) {
    errors.push(`응답 문항 수 부족: ${responseCount}/${items.length} (최소 75% 필요)`);
  }
  
  // 응답 범위 확인
  for (const [id, value] of Object.entries(responses)) {
    if (value < 1 || value > 5) {
      errors.push(`문항 ${id}: 응답 범위 오류 (1~5 필요, 실제: ${value})`);
    }
  }
  
  // 결측치 경고
  const missingItems = items.filter(item => responses[item.id] === undefined);
  if (missingItems.length > 0) {
    warnings.push(`결측치 ${missingItems.length}개 (문항 ID: ${missingItems.map(i => i.id).join(", ")})`);
  }
  
  // 응답 패턴 확인 (모두 같은 값)
  const uniqueValues = new Set(Object.values(responses));
  if (uniqueValues.size === 1) {
    warnings.push("모든 응답이 동일합니다. 성실하게 응답했는지 확인하세요.");
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

export default runIMCoreV3;

// 추가 유틸리티 export
export { items60V3, TOTAL_ITEMS, REVERSE_ITEM_IDS } from "./items60-v3";
export { INNER9_DESCRIPTIONS, extractStrengthsAndGrowth } from "./inner9-v3";
export { getMBTIDescription } from "./mbti-mapper";
export { getEnneagramDescription, estimateWing } from "./ennea-mapper";
export type * from "./types";

