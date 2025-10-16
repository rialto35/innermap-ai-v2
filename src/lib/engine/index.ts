/**
 * Engine Integration
 * 
 * @innermap/engine 패키지와 기존 시스템 통합
 */

import type { Answer } from '@innermap/engine';
import { getCurrentVersion } from '@innermap/engine';
import { calculateBig5, Big5QuestionMeta } from '@innermap/engine';
import { calculateMBTI } from '@innermap/engine';
import { calculateRETI } from '@innermap/engine';
import { mapTribe } from '@innermap/engine';
import { mapStone } from '@innermap/engine';
import { mapHero } from '@innermap/engine';
import type { Big5Scores, MBTIScores, RETIScores, Tribe, Stone, Hero, ResultSnapshot } from '@innermap/engine';
import crypto from 'crypto';

/**
 * Answer hash 계산 (idempotency)
 */
export function calculateAnswerHash(answers: Answer[]): string {
  const sorted = [...answers].sort((a, b) => a.questionId.localeCompare(b.questionId));
  const str = JSON.stringify(sorted);
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * 전체 스코어링 파이프라인 실행
 */
export interface ScoringInput {
  answers: Answer[];
  birthDate?: string;
  big5Meta: Record<string, Big5QuestionMeta>;
  mbtiWeights: Record<string, any>;
  retiWeights: Record<string, any>;
}

export interface ScoringResult {
  big5: Big5Scores;
  mbti: MBTIScores;
  reti: RETIScores;
  tribe: Tribe;
  stone: Stone;
  hero: Hero;
  engineVersion: string;
}

export async function runScoringPipeline(input: ScoringInput): Promise<ScoringResult> {
  // 1. Big5 계산
  const big5 = calculateBig5(input.answers, input.big5Meta);
  
  // 2. MBTI 계산
  const mbti = calculateMBTI(input.answers, input.mbtiWeights);
  
  // 3. RETI 계산
  const reti = calculateRETI(input.answers, input.retiWeights);
  
  // 4. Tribe 매핑 (생년월일 + Big5)
  const tribe = mapTribe(big5, input.birthDate);
  
  // 5. Stone 매핑 (MBTI + RETI)
  const stone = mapStone(mbti, reti);
  
  // 6. Hero 매칭 (Tribe + Stone)
  const hero = mapHero(tribe, stone);
  
  return {
    big5,
    mbti,
    reti,
    tribe,
    stone,
    hero,
    engineVersion: getCurrentVersion()
  };
}

/**
 * Result snapshot 생성
 */
export function createResultSnapshot(
  resultId: string,
  userId: string,
  assessmentId: string,
  scoringResult: ScoringResult
): ResultSnapshot {
  return {
    id: resultId,
    userId,
    assessmentId,
    engineVersion: scoringResult.engineVersion,
    
    big5: scoringResult.big5,
    mbti: scoringResult.mbti,
    reti: scoringResult.reti,
    
    tribe: scoringResult.tribe,
    stone: scoringResult.stone,
    hero: scoringResult.hero,
    
    createdAt: new Date().toISOString()
  };
}

