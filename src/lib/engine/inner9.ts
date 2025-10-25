/**
 * Inner9 9축 분석 엔진
 * Big5, MBTI, RETI를 융합하여 9개 차원으로 변환
 */

import { Big5Scores } from './big5';
import { clip, round } from './normalization';

export type Inner9Scores = {
  creativity: number;    // 창조성
  will: number;         // 의지
  sensitivity: number;   // 감수성
  harmony: number;       // 조화
  expression: number;    // 표현
  insight: number;      // 통찰
  resilience: number;   // 회복력
  balance: number;       // 균형
  growth: number;       // 성장
};

export type Inner9Result = {
  label: string;
  value: number;
}[];

export type Weights = {
  big5: number;
  mbti: number;
  reti: number;
};

/**
 * Big5 점수를 Inner9 차원으로 변환
 */
export function big5ToInner9(big5: Big5Scores): Inner9Scores {
  return {
    creativity: (big5.o + big5.e) / 2,
    will: big5.c,
    sensitivity: (big5.a + big5.n) / 2,
    harmony: (big5.a + 100 - big5.n) / 2,
    expression: big5.e,
    insight: (big5.o + big5.c) / 2,
    resilience: 100 - big5.n,
    balance: (100 - Math.abs(big5.o + big5.e - (big5.c + big5.a)) / 2),
    growth: (big5.o + big5.c + big5.e + (100 - big5.n)) / 4
  };
}

/**
 * MBTI를 Inner9 차원으로 변환
 */
export function mbtiToInner9(mbti: string): Inner9Scores {
  const isE = mbti.includes('E');
  const isN = mbti.includes('N');
  const isT = mbti.includes('T');
  const isP = mbti.includes('P');
  
  return {
    creativity: isN ? 80 : 40,
    will: isT ? 80 : 40,
    sensitivity: !isT ? 80 : 40,
    harmony: !isT ? 80 : 40,
    expression: isE ? 80 : 40,
    insight: isN ? 80 : 40,
    resilience: isT ? 80 : 40,
    balance: 60, // 중립
    growth: (isN && isT) ? 80 : 40
  };
}

/**
 * RETI를 Inner9 차원으로 변환
 */
export function retiToInner9(reti: number): Inner9Scores {
  // RETI 1~9를 Inner9 차원으로 매핑
  const base = (reti - 1) * 12.5; // 1~9 → 0~100
  
  return {
    creativity: base,
    will: base,
    sensitivity: base,
    harmony: base,
    expression: base,
    insight: base,
    resilience: base,
    balance: base,
    growth: base
  };
}

/**
 * Inner9 점수를 결과 배열로 변환
 */
export function scoresToResult(scores: Inner9Scores): Inner9Result {
  return [
    { label: '창조성', value: round(scores.creativity) },
    { label: '의지', value: round(scores.will) },
    { label: '감수성', value: round(scores.sensitivity) },
    { label: '조화', value: round(scores.harmony) },
    { label: '표현', value: round(scores.expression) },
    { label: '통찰', value: round(scores.insight) },
    { label: '회복력', value: round(scores.resilience) },
    { label: '균형', value: round(scores.balance) },
    { label: '성장', value: round(scores.growth) }
  ];
}

/**
 * Big5, MBTI, RETI를 융합하여 Inner9 결과 생성
 */
export function toInner9({ 
  big5, 
  mbti, 
  reti, 
  weights = { big5: 1, mbti: 0.5, reti: 0.5 } 
}: { 
  big5: Big5Scores; 
  mbti: string; 
  reti: number; 
  weights?: Weights;
}): Inner9Result {
  const big5Scores = big5ToInner9(big5);
  const mbtiScores = mbtiToInner9(mbti);
  const retiScores = retiToInner9(reti);
  
  // 가중 평균으로 융합
  const fusedScores: Inner9Scores = {
    creativity: clip((big5Scores.creativity * weights.big5 + mbtiScores.creativity * weights.mbti + retiScores.creativity * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    will: clip((big5Scores.will * weights.big5 + mbtiScores.will * weights.mbti + retiScores.will * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    sensitivity: clip((big5Scores.sensitivity * weights.big5 + mbtiScores.sensitivity * weights.mbti + retiScores.sensitivity * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    harmony: clip((big5Scores.harmony * weights.big5 + mbtiScores.harmony * weights.mbti + retiScores.harmony * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    expression: clip((big5Scores.expression * weights.big5 + mbtiScores.expression * weights.mbti + retiScores.expression * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    insight: clip((big5Scores.insight * weights.big5 + mbtiScores.insight * weights.mbti + retiScores.insight * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    resilience: clip((big5Scores.resilience * weights.big5 + mbtiScores.resilience * weights.mbti + retiScores.resilience * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    balance: clip((big5Scores.balance * weights.big5 + mbtiScores.balance * weights.mbti + retiScores.balance * weights.reti) / (weights.big5 + weights.mbti + weights.reti)),
    growth: clip((big5Scores.growth * weights.big5 + mbtiScores.growth * weights.mbti + retiScores.growth * weights.reti) / (weights.big5 + weights.mbti + weights.reti))
  };
  
  return scoresToResult(fusedScores);
}
