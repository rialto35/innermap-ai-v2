/**
 * IM-Core v3.0 - Research Prototype
 * 연구용 프로토타입: 자기이해/코칭 목적
 * 
 * ⚠️ 임상 진단, 채용, 선발 등 의사결정에 사용 금지
 */

export type Likert5 = 1 | 2 | 3 | 4 | 5;

// Big5 영역 (Domain)
export type Big5Domain = "O" | "C" | "E" | "A" | "N";

// Big5 파셋 (Facet) - BFI-2 구조 참조
export type Big5Facet =
  // Openness (개방성)
  | "curiosity"           // 지적호기심
  | "aesthetic"           // 미적감수성
  | "innovation"          // 혁신성
  // Conscientiousness (성실성)
  | "order"               // 정리정돈
  | "grit"                // 끈기·근면
  | "self_control"        // 자기통제
  // Extraversion (외향성)
  | "sociability"         // 사회성
  | "vitality"            // 활력·활동성
  | "assertiveness"       // 주도성
  // Agreeableness (우호성)
  | "empathy"             // 공감·이타
  | "cooperation"         // 협동·신뢰
  | "modesty"             // 겸손·배려
  // Neuroticism (신경성)
  | "anxiety"             // 불안
  | "impulsivity"         // 충동·민감
  | "stress_vulnerability"; // 스트레스 취약

// 문항 메타데이터
export type ItemMetaV3 = {
  id: number;
  question: string;
  domain: Big5Domain;
  facet: Big5Facet;
  reverse: boolean;
  weight?: number; // v3.0: 초기는 등가가중, 학습 후 추가
};

// Big5 점수 결과
export type Big5ScoresV3 = {
  // 영역 점수 (0-100)
  O: number;
  C: number;
  E: number;
  A: number;
  N: number;
  
  // 파셋 점수 (0-100)
  facets: Record<Big5Facet, number>;
  
  // IRT θ 추정치 (z-score)
  theta: Record<Big5Domain, number>;
  
  // 95% 신뢰구간 [lower, upper]
  ci: Record<Big5Domain, [number, number]>;
  
  // 파셋별 신뢰구간
  facetCI: Record<Big5Facet, [number, number]>;
};

// MBTI 확률
export type MBTIProbability = {
  E: number; // 0~1 확률
  I: number;
  S: number;
  N: number;
  T: number;
  F: number;
  J: number;
  P: number;
};

// MBTI 결과 (확률 매핑)
export type MBTIResultV3 = {
  // 최빈 유형
  type: string; // "ENFJ"
  
  // 각 축 확률
  probabilities: MBTIProbability;
  
  // 경계 플래그 (확률 0.4~0.6)
  boundary: {
    EI: boolean;
    SN: boolean;
    TF: boolean;
    JP: boolean;
  };
  
  // 신뢰도 (0~1, 경계에서 멀수록 높음)
  confidence: number;
  
  // 양자 표기 (경계 시)
  alternativeType?: string; // "ENFJ/ENFP"
};

// Enneagram 후보
export type EnneagramCandidate = {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  probability: number;
  confidence: "high" | "medium" | "low";
};

// Enneagram 결과 (Top-3 후보)
export type EnneagramResultV3 = {
  // Top-3 후보
  candidates: EnneagramCandidate[];
  
  // 가장 높은 유형
  primary: number;
  
  // 참고 메시지
  note: string;
};

// Inner9 합성지표
export type Inner9V3 = {
  // 9개 합성지표 (0-100)
  탐구심: number;
  자기통제: number;
  사회관계: number;
  리더십: number;
  협업성: number;
  정서안정: number;
  회복탄력: number;
  몰입: number;
  성장동기: number;
  
  // 신뢰구간
  ci: Record<string, [number, number]>;
};

// 최종 엔진 결과
export type EngineResultV3 = {
  version: "v3.0-research";
  timestamp: string;
  
  // 측정 코어
  big5: Big5ScoresV3;
  
  // 해석 레이어
  mbti: MBTIResultV3;
  enneagram: EnneagramResultV3;
  inner9: Inner9V3;
  
  // 메타데이터
  metadata: {
    itemCount: number;
    completionTime?: number; // ms
    flags: string[];
    warnings: string[];
  };
};

// 검증 결과
export type ValidationResult = {
  valid: boolean;
  errors: string[];
  warnings: string[];
  stats: {
    totalItems: number;
    reverseItems: number;
    reverseRatio: number;
    itemsPerFacet: Record<Big5Facet, number>;
    itemsPerDomain: Record<Big5Domain, number>;
  };
};

