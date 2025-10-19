/**
 * RETI (Relational-Emotional Type Indicator) Scoring Module
 * Handles RETI type determination and scoring
 */

export interface RETIScores {
  r1: number; // Type 1
  r2: number; // Type 2
  r3: number; // Type 3
  r4: number; // Type 4
  r5: number; // Type 5
  r6: number; // Type 6
  r7: number; // Type 7
  r8: number; // Type 8
  r9: number; // Type 9
}

export interface RETIResult {
  top1: string; // Primary type (e.g., "r3")
  top2?: string; // Secondary type (e.g., "r7")
  scores: RETIScores;
  confidence: number; // 0-1, confidence in primary type
}

/**
 * Determine top RETI types
 * 
 * @param scores - RETI type scores
 * @returns Top 2 RETI types
 */
export function determineRETITypes(scores: RETIScores): { top1: string; top2?: string } {
  const entries = Object.entries(scores) as [keyof RETIScores, number][];
  entries.sort((a, b) => b[1] - a[1]);
  
  return {
    top1: entries[0][0],
    top2: entries.length > 1 && entries[1][1] > 0 ? entries[1][0] : undefined,
  };
}

/**
 * Calculate confidence in primary RETI type
 * 
 * @param scores - RETI type scores
 * @returns Confidence score (0-1)
 */
export function calculateRETIConfidence(scores: RETIScores): number {
  const values = Object.values(scores);
  const max = Math.max(...values);
  const sum = values.reduce((a, b) => a + b, 0);
  
  if (sum === 0) return 0;
  
  // Confidence = (max - average) / max
  const avg = sum / values.length;
  return Math.min(1, (max - avg) / max);
}

/**
 * Calculate full RETI result from scores
 * 
 * @param scores - RETI type scores
 * @returns Complete RETI result
 */
export function scoreRETI(scores: RETIScores): RETIResult {
  const { top1, top2 } = determineRETITypes(scores);
  const confidence = calculateRETIConfidence(scores);
  
  return {
    top1,
    top2,
    scores,
    confidence,
  };
}

/**
 * Validate RETI scores
 * 
 * @param scores - RETI scores to validate
 * @returns true if valid, false otherwise
 */
export function validateRETIScores(scores: Partial<RETIScores>): scores is RETIScores {
  const required: (keyof RETIScores)[] = ['r1', 'r2', 'r3', 'r4', 'r5', 'r6', 'r7', 'r8', 'r9'];
  
  for (const key of required) {
    const value = scores[key];
    if (typeof value !== 'number' || value < 0) {
      return false;
    }
  }
  
  return true;
}

/**
 * Normalize RETI scores to sum to 100
 * 
 * @param scores - RETI scores
 * @returns Normalized RETI scores
 */
export function normalizeRETIScores(scores: RETIScores): RETIScores {
  const sum = Object.values(scores).reduce((a, b) => a + b, 0);
  
  if (sum === 0) {
    // Equal distribution if all scores are 0
    const equalValue = 100 / 9;
    return {
      r1: equalValue,
      r2: equalValue,
      r3: equalValue,
      r4: equalValue,
      r5: equalValue,
      r6: equalValue,
      r7: equalValue,
      r8: equalValue,
      r9: equalValue,
    };
  }
  
  return {
    r1: (scores.r1 / sum) * 100,
    r2: (scores.r2 / sum) * 100,
    r3: (scores.r3 / sum) * 100,
    r4: (scores.r4 / sum) * 100,
    r5: (scores.r5 / sum) * 100,
    r6: (scores.r6 / sum) * 100,
    r7: (scores.r7 / sum) * 100,
    r8: (scores.r8 / sum) * 100,
    r9: (scores.r9 / sum) * 100,
  };
}

