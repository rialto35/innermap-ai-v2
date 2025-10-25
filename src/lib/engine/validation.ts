/**
 * 런타임 방어 코드
 * 결과 검증 및 안전 폴백 처리
 */

import { FullResult } from './orchestrator';
import { getEngineMetadata } from './VERSION';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 결과 검증
 */
export function validateResult(result: FullResult): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Big5 검증
  Object.entries(result.big5).forEach(([key, value]) => {
    if (typeof value !== 'number' || isNaN(value)) {
      errors.push(`Big5 ${key} 값이 유효하지 않습니다: ${value}`);
    } else if (value < 0 || value > 100) {
      errors.push(`Big5 ${key} 값이 범위를 벗어났습니다: ${value}`);
    }
  });

  // MBTI 검증
  if (typeof result.mbti !== 'string' || !/^[EI][SN][TF][PJ]$/.test(result.mbti)) {
    errors.push(`MBTI 값이 유효하지 않습니다: ${result.mbti}`);
  }

  // RETI 검증
  if (!Number.isInteger(result.reti) || result.reti < 1 || result.reti > 9) {
    errors.push(`RETI 값이 유효하지 않습니다: ${result.reti}`);
  }

  // Inner9 검증
  if (!Array.isArray(result.inner9) || result.inner9.length !== 9) {
    errors.push(`Inner9 배열이 유효하지 않습니다: ${result.inner9?.length}개`);
  } else {
    result.inner9.forEach((axis, index) => {
      if (!axis.label || typeof axis.value !== 'number' || isNaN(axis.value)) {
        errors.push(`Inner9 ${index}번 축이 유효하지 않습니다`);
      } else if (axis.value < 0 || axis.value > 100) {
        errors.push(`Inner9 ${index}번 축 값이 범위를 벗어났습니다: ${axis.value}`);
      }
    });
  }

  // 타임스탬프 검증
  if (!result.timestamp || isNaN(new Date(result.timestamp).getTime())) {
    errors.push(`타임스탬프가 유효하지 않습니다: ${result.timestamp}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 안전 폴백 결과 생성
 */
export function createFallbackResult(): FullResult {
  const now = new Date().toISOString();
  
  return {
    big5: { o: 50, c: 50, e: 50, a: 50, n: 50 },
    mbti: 'ISFJ',
    reti: 5,
    inner9: [
      { label: '창조성', value: 50 },
      { label: '의지', value: 50 },
      { label: '감수성', value: 50 },
      { label: '조화', value: 50 },
      { label: '표현', value: 50 },
      { label: '통찰', value: 50 },
      { label: '회복력', value: 50 },
      { label: '균형', value: 50 },
      { label: '성장', value: 50 }
    ],
    timestamp: now
  };
}

/**
 * 결과에 메타데이터 추가
 */
export function addMetadata(result: FullResult): FullResult & { metadata: any } {
  const metadata = getEngineMetadata();
  
  return {
    ...result,
    metadata: {
      ...metadata,
      generatedAt: result.timestamp,
      validation: validateResult(result)
    }
  };
}

/**
 * 안전한 결과 처리
 */
export function safeProcessResult(result: FullResult): FullResult {
  const validation = validateResult(result);
  
  if (!validation.isValid) {
    console.warn('결과 검증 실패:', validation.errors);
    return createFallbackResult();
  }
  
  return result;
}
