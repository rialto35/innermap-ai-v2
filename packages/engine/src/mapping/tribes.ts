/**
 * Tribes Mapping (12 Innate)
 * 
 * 생년월일 기반 12부족 매핑 (선천적 특성)
 * 12지지(子丑寅卯辰巳午未申酉戌亥) → 12부족 매칭
 * 
 * @version v1.0.0
 * @reference src/lib/innermapLogic.ts
 */

import type { Tribe, TribeType, Big5Scores } from '../types';

// 12지지
const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 12지지 → 부족 매핑
const BRANCH_TO_TRIBE: Record<string, TribeType> = {
  '子': 'phoenix',   // 텐브라 (봉황)
  '丑': 'turtle',    // 베르마 (거북)
  '寅': 'tiger',     // 실바 (호랑이)
  '卯': 'rabbit',    // 세라 (토끼)
  '辰': 'dragon',    // 에이라 (용)
  '巳': 'snake',     // 아우린 (뱀)
  '午': 'deer',      // 노바 (사슴)
  '未': 'crane',     // 소란 (학)
  '申': 'bear',      // 드라스 (곰)
  '酉': 'fox',       // 바르노 (여우)
  '戌': 'wolf',      // 루민 (늑대)
  '亥': 'eagle'      // 네바 (독수리)
};

/**
 * 생년월일에서 부족 추출
 * 
 * @param birthDate "YYYY-MM-DD" 형식
 * @param big5 Big5 점수 (옵션, 점수 조정용)
 * @returns Tribe
 */
export function mapTribe(big5?: Big5Scores, birthDate?: string): Tribe {
  if (!birthDate) {
    // 기본값: 봉황
    return {
      type: 'phoenix',
      score: 50,
      element: 'fire'
    };
  }

  // 날짜 파싱
  const [year, month, day] = birthDate.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  
  // 기준일 (1984-01-01 = 甲子일 = 60갑자 0번)
  const baseDate = new Date(1984, 0, 1);
  
  // 경과 일수
  const diffTime = targetDate.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 60갑자 인덱스
  const gapjaIndex = ((diffDays % 60) + 60) % 60;
  
  // 12지지 인덱스
  const branchIndex = gapjaIndex % 12;
  
  // 지지 추출
  const branch = BRANCHES[branchIndex];
  const tribeType = BRANCH_TO_TRIBE[branch];

  // 점수 계산 (Big5 기반 조정 가능)
  let score = 70; // 기본 강도
  
  if (big5) {
    // Big5 점수로 부족 적합도 조정
    const relevance = calculateTribeRelevance(tribeType, big5);
    score = Math.round(50 + relevance * 50);
  }

  return {
    type: tribeType,
    score,
    element: getTribeElement(tribeType)
  };
}

/**
 * 부족 원소 가져오기
 */
function getTribeElement(tribe: TribeType): Tribe['element'] {
  const elementMap: Record<TribeType, Tribe['element']> = {
    'phoenix': 'fire',
    'dragon': 'fire',
    'tiger': 'wood',
    'rabbit': 'wood',
    'turtle': 'water',
    'snake': 'water',
    'deer': 'earth',
    'crane': 'earth',
    'bear': 'metal',
    'fox': 'metal',
    'wolf': 'metal',
    'eagle': 'fire'
  };

  return elementMap[tribe] || 'earth';
}

/**
 * Big5 기반 부족 적합도 계산
 * -1 (부적합) ~ +1 (적합)
 */
function calculateTribeRelevance(tribe: TribeType, big5: Big5Scores): number {
  // 각 부족별 Big5 특성 가중치
  const weights: Record<TribeType, Partial<Record<keyof Big5Scores, number>>> = {
    'phoenix': { openness: 0.8, extraversion: 0.6, conscientiousness: 0.4 },
    'dragon': { extraversion: 0.9, conscientiousness: 0.7, openness: 0.5 },
    'tiger': { extraversion: 0.8, neuroticism: -0.6, agreeableness: 0.3 },
    'rabbit': { agreeableness: 0.9, openness: 0.6, neuroticism: -0.4 },
    'turtle': { conscientiousness: 0.9, agreeableness: 0.5, extraversion: -0.3 },
    'snake': { openness: 0.8, conscientiousness: 0.6, extraversion: -0.2 },
    'deer': { agreeableness: 0.9, openness: 0.7, neuroticism: -0.5 },
    'crane': { conscientiousness: 0.8, agreeableness: 0.7, extraversion: 0.4 },
    'bear': { conscientiousness: 0.9, extraversion: 0.3, agreeableness: 0.6 },
    'fox': { openness: 0.9, extraversion: 0.7, agreeableness: -0.2 },
    'wolf': { extraversion: 0.7, conscientiousness: 0.6, neuroticism: -0.5 },
    'eagle': { openness: 0.9, extraversion: 0.8, conscientiousness: 0.5 }
  };

  const weight = weights[tribe] || {};
  let relevance = 0;
  let totalWeight = 0;

  for (const [trait, w] of Object.entries(weight) as Array<[keyof Big5Scores, number]>) {
    const score = (big5[trait] - 50) / 50; // -1 ~ +1로 정규화
    relevance += score * w;
    totalWeight += Math.abs(w);
  }

  return totalWeight > 0 ? relevance / totalWeight : 0;
}


