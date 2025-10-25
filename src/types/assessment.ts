/**
 * Assessment System Types
 * 검사 시스템 타입 정의 (무료 요약 vs 심층 분석)
 */

export type Big5 = { 
  O: number; 
  C: number; 
  E: number; 
  A: number; 
  N: number;
};

/**
 * 무료 요약 필드 (Summary)
 * - MBTI, Big5, 키워드 Top5, 신뢰도
 */
export type SummaryFields = {
  mbti: string;
  big5: Big5;
  keywords: string[];
  confidence?: number;
};

/**
 * 심층 분석 필드 (Premium/Locked)
 * - Inner9 그래프, 세계관 매핑, 성장 벡터
 */
export type PremiumFields = {
  inner9: { 
    axes: number[];    // 9축 0~100
    labels: string[];  // 축 이름
  }; 
  world: { 
    continent: string; // 대륙
    tribe: string;     // 12부족
    stone: string;     // 결정석 (예: 베르디, 노드크루스)
  };
  growthVector?: { 
    from: number[];    // 선천 벡터
    to: number[];      // 후천 벡터
  };
};

/**
 * 전체 검사 결과
 * - 무료 필드 + 심층 필드(옵셔널)
 */
export type AssessmentResult = SummaryFields & Partial<PremiumFields>;

/**
 * 프로필 입력 데이터
 */
export type ProfileInput = {
  gender: 'male' | 'female' | 'other';
  birthdate: string; // YYYY-MM-DD
  email: string;
  consentRequired: boolean;
  consentMarketing: boolean;
};

/**
 * 검사 상태
 */
export type AssessmentStatus = 'intro' | 'questions' | 'profile' | 'processing' | 'complete';

