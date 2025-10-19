/**
 * MBTI Scoring Module
 * Handles MBTI type determination and confidence calculation
 */

export interface MBTIScores {
  E: number; // Extraversion
  I: number; // Introversion
  S: number; // Sensing
  N: number; // Intuition
  T: number; // Thinking
  F: number; // Feeling
  J: number; // Judging
  P: number; // Perceiving
}

export interface MBTIResult {
  type: string; // e.g., "INFP"
  confidence: {
    EI: number; // 0-1, confidence in E vs I
    SN: number; // 0-1, confidence in S vs N
    TF: number; // 0-1, confidence in T vs F
    JP: number; // 0-1, confidence in J vs P
  };
  ratios: {
    EI: number; // 0-100, percentage towards E
    SN: number; // 0-100, percentage towards S
    TF: number; // 0-100, percentage towards T
    JP: number; // 0-100, percentage towards J
  };
}

/**
 * Determine MBTI type from scores
 * 
 * @param scores - MBTI dimension scores
 * @returns MBTI type string (e.g., "INFP")
 */
export function determineMBTIType(scores: Partial<MBTIScores>): string {
  const ei = (scores.E ?? 0) > (scores.I ?? 0) ? 'E' : 'I';
  const sn = (scores.S ?? 0) > (scores.N ?? 0) ? 'S' : 'N';
  const tf = (scores.T ?? 0) > (scores.F ?? 0) ? 'T' : 'F';
  const jp = (scores.J ?? 0) > (scores.P ?? 0) ? 'J' : 'P';
  
  return `${ei}${sn}${tf}${jp}`;
}

/**
 * Calculate confidence for each MBTI axis
 * 
 * @param scores - MBTI dimension scores
 * @returns Confidence scores (0-1) for each axis
 */
export function calculateMBTIConfidence(scores: Partial<MBTIScores>): MBTIResult['confidence'] {
  const e = scores.E ?? 0;
  const i = scores.I ?? 0;
  const s = scores.S ?? 0;
  const n = scores.N ?? 0;
  const t = scores.T ?? 0;
  const f = scores.F ?? 0;
  const j = scores.J ?? 0;
  const p = scores.P ?? 0;
  
  // Confidence = |difference| / (sum)
  const eiConf = Math.abs(e - i) / Math.max(e + i, 1);
  const snConf = Math.abs(s - n) / Math.max(s + n, 1);
  const tfConf = Math.abs(t - f) / Math.max(t + f, 1);
  const jpConf = Math.abs(j - p) / Math.max(j + p, 1);
  
  return {
    EI: Math.min(1, eiConf),
    SN: Math.min(1, snConf),
    TF: Math.min(1, tfConf),
    JP: Math.min(1, jpConf),
  };
}

/**
 * Calculate ratio for each MBTI axis
 * 
 * @param scores - MBTI dimension scores
 * @returns Ratio scores (0-100) for each axis
 */
export function calculateMBTIRatios(scores: Partial<MBTIScores>): MBTIResult['ratios'] {
  const e = scores.E ?? 0;
  const i = scores.I ?? 0;
  const s = scores.S ?? 0;
  const n = scores.N ?? 0;
  const t = scores.T ?? 0;
  const f = scores.F ?? 0;
  const j = scores.J ?? 0;
  const p = scores.P ?? 0;
  
  return {
    EI: Math.round((e / Math.max(e + i, 1)) * 100),
    SN: Math.round((s / Math.max(s + n, 1)) * 100),
    TF: Math.round((t / Math.max(t + f, 1)) * 100),
    JP: Math.round((j / Math.max(j + p, 1)) * 100),
  };
}

/**
 * Calculate full MBTI result from scores
 * 
 * @param scores - MBTI dimension scores
 * @returns Complete MBTI result with type, confidence, and ratios
 */
export function scoreMBTI(scores: Partial<MBTIScores>): MBTIResult {
  return {
    type: determineMBTIType(scores),
    confidence: calculateMBTIConfidence(scores),
    ratios: calculateMBTIRatios(scores),
  };
}

/**
 * Validate MBTI scores
 * 
 * @param scores - MBTI scores to validate
 * @returns true if valid, false otherwise
 */
export function validateMBTIScores(scores: Partial<MBTIScores>): scores is MBTIScores {
  const required: (keyof MBTIScores)[] = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'];
  
  for (const key of required) {
    const value = scores[key];
    if (typeof value !== 'number' || value < 0) {
      return false;
    }
  }
  
  return true;
}

