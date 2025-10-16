/**
 * Big5 Personality Scoring
 * 
 * Big Five (OCEAN) 성격 특성 점수 계산
 * - Openness (개방성)
 * - Conscientiousness (성실성)
 * - Extraversion (외향성)
 * - Agreeableness (친화성)
 * - Neuroticism (신경성)
 * 
 * @version v1.0.0
 * @reference src/lib/calculateBig5.ts, src/lib/scoring.ts
 */

import type { Big5Scores, Answer } from '../types';
import { scaleToHundred } from './huber';

/**
 * Big5 질문 메타데이터
 */
export interface Big5QuestionMeta {
  trait: keyof Big5Scores;
  reverse?: boolean;  // 역문항 여부
  weight?: number;    // 가중치 (기본: 1.0)
}

/**
 * Big5 점수 계산
 * 
 * @param answers 사용자 답변 배열
 * @param questionMeta 질문별 메타데이터 (trait, reverse, weight)
 * @returns Big5Scores (0-100 스케일)
 * 
 * @example
 * const answers = [
 *   { questionId: 'q1', value: 4 }, // 1-5 척도
 *   { questionId: 'q2', value: 2 }
 * ];
 * const meta = {
 *   'q1': { trait: 'openness', reverse: false },
 *   'q2': { trait: 'openness', reverse: true }
 * };
 * const scores = calculateBig5(answers, meta);
 * // => { openness: 75, conscientiousness: 0, ... }
 */
export function calculateBig5(
  answers: Answer[],
  questionMeta: Record<string, Big5QuestionMeta>
): Big5Scores {
  // 각 특성별 원점수 누적
  const rawScores: Record<keyof Big5Scores, number[]> = {
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    neuroticism: [],
  };

  // 답변 처리
  for (const answer of answers) {
    const meta = questionMeta[answer.questionId];
    if (!meta) continue;

    let score = answer.value;

    // 역문항 처리 (5점 척도 가정: 1→5, 2→4, 3→3, 4→2, 5→1)
    if (meta.reverse) {
      score = 6 - score;
    }

    // 가중치 적용
    if (meta.weight) {
      score *= meta.weight;
    }

    rawScores[meta.trait].push(score);
  }

  // 0-100 스케일로 변환
  const scores: Big5Scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  for (const trait of Object.keys(rawScores) as Array<keyof Big5Scores>) {
    const traitScores = rawScores[trait];
    
    if (traitScores.length === 0) {
      scores[trait] = 50; // 기본값 (중간)
      continue;
    }

    // 평균 계산 (1-5 범위)
    const average = traitScores.reduce((sum, s) => sum + s, 0) / traitScores.length;
    
    // 0-100 스케일 변환: (average - 1) / 4 * 100
    scores[trait] = Math.round(((average - 1) / 4) * 100);
  }

  return scores;
}

/**
 * Big5 간이 버전 - 질문 수가 적을 때
 * 가중치 기반 직접 계산
 * 
 * @param answers 사용자 답변
 * @param weights 질문별 Big5 가중치
 * @returns Big5Scores (0-100 스케일)
 */
export function calculateBig5Simple(
  answers: Answer[],
  weights: Record<string, Partial<Big5Scores>>
): Big5Scores {
  const rawScores: Big5Scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  // 가중합 계산
  for (const answer of answers) {
    const weight = weights[answer.questionId];
    if (!weight) continue;

    // 정규화된 값 (-1 ~ +1)
    const normalized = (answer.value - 3) / 2; // 5점 척도 가정

    for (const trait of Object.keys(weight) as Array<keyof Big5Scores>) {
      const w = weight[trait];
      if (w !== undefined) {
        rawScores[trait] += normalized * w;
      }
    }
  }

  // 0-100 스케일로 변환
  return {
    openness: scaleToHundred(rawScores.openness),
    conscientiousness: scaleToHundred(rawScores.conscientiousness),
    extraversion: scaleToHundred(rawScores.extraversion),
    agreeableness: scaleToHundred(rawScores.agreeableness),
    neuroticism: scaleToHundred(rawScores.neuroticism),
  };
}

/**
 * 점수 레벨 판정
 * 
 * @param score 0-100 점수
 * @returns 레벨 설명
 */
export function getScoreLevel(score: number): string {
  if (score < 20) return '매우 낮음';
  if (score < 40) return '낮음';
  if (score < 60) return '보통';
  if (score < 80) return '높음';
  return '매우 높음';
}

/**
 * 강점/약점 추출
 * 
 * @param scores Big5 점수
 * @returns 강점 및 약점 특성 목록
 */
export function extractStrengthsWeaknesses(scores: Big5Scores): {
  strengths: string[];
  weaknesses: string[];
} {
  const traitNames: Record<keyof Big5Scores, string> = {
    openness: '개방성',
    conscientiousness: '성실성',
    extraversion: '외향성',
    agreeableness: '친화성',
    neuroticism: '신경성',
  };

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  for (const [trait, score] of Object.entries(scores) as Array<[keyof Big5Scores, number]>) {
    if (score >= 70) {
      strengths.push(traitNames[trait]);
    } else if (score <= 30) {
      weaknesses.push(traitNames[trait]);
    }
  }

  return {
    strengths: strengths.length > 0 ? strengths : ['균형잡힌 성향'],
    weaknesses: weaknesses.length > 0 ? weaknesses : ['특별한 약점 없음'],
  };
}

