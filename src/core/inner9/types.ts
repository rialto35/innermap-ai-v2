/**
 * Inner9 Model Types
 * @module @innermap/inner9
 */

export type InnerNine = {
  creation: number;    // 창조성
  will: number;        // 의지력
  sensitivity: number; // 감수성
  harmony: number;     // 공감력
  expression: number;  // 표현력
  insight: number;     // 통찰력
  resilience: number;  // 회복력
  balance: number;     // 균형감
  growth: number;      // 성장력
};

export type Big5 = { 
  O: number; // Openness
  C: number; // Conscientiousness
  E: number; // Extraversion
  A: number; // Agreeableness
  N: number; // Neuroticism
};

export type Inner9Config = {
  // Big5 -> Inner9 가중치 (필요 시 조정)
  weights?: {
    creation_from_O?: number;
    will_from_C?: number;
    expression_from_E?: number;
    harmony_from_A?: number;
    sensitivity_from_N?: number;
  };
  // 0~100 클리핑 여부
  clip0to100?: boolean;
};

export type ComputeResult = {
  scores: InnerNine;
  modelVersion: string;
};

