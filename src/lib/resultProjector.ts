/**
 * Result Projector
 * 검사 결과를 무료 요약 / 심층 분석으로 분리
 */

import type { AssessmentResult, SummaryFields, PremiumFields } from '@/types/assessment';

/**
 * 무료 요약 필드만 추출
 */
export function toSummary(r: AssessmentResult): SummaryFields {
  const { mbti, big5, keywords, confidence } = r;
  return { 
    mbti, 
    big5, 
    keywords: (keywords || []).slice(0, 5), 
    confidence 
  };
}

/**
 * 심층 분석 필드만 추출
 */
export function toPremium(r: AssessmentResult): PremiumFields | null {
  const { inner9, world, growthVector } = r;
  
  // 심층 데이터가 없으면 null 반환
  if (!inner9 || !world) {
    return null;
  }
  
  return { 
    inner9, 
    world, 
    growthVector 
  };
}

/**
 * 심층 분석 가능 여부 확인
 */
export function hasPremiumAccess(r: AssessmentResult): boolean {
  return !!(r.inner9 && r.world);
}

