/**
 * Engine Core Types
 */

// ===== Answers & Assessment =====
export interface Answer {
  questionId: string;
  value: number; // 1-5 or 1-7 depending on question type
  timestamp?: string;
}

export interface Assessment {
  id: string;
  userId: string;
  answers: Answer[];
  answersHash: string; // SHA-256 hash for idempotency
  engineVersion: string;
  createdAt: string;
}

// ===== Big5 =====
export interface Big5Scores {
  openness: number; // 0-100
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

// ===== MBTI =====
export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIScores {
  type: MBTIType;
  dimensions: {
    EI: number; // Extraversion vs Introversion (-100 to 100)
    SN: number; // Sensing vs Intuition
    TF: number; // Thinking vs Feeling
    JP: number; // Judging vs Perceiving
  };
  confidence: number; // 0-1
}

// ===== RETI (Enneagram) =====
export type RETIType = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export interface RETIScores {
  primaryType: RETIType;
  wing?: RETIType;
  scores: Record<RETIType, number>; // 0-100 for each type
  confidence: number;
}

// ===== Tribes (12 Innate) =====
export type TribeType =
  | 'phoenix' | 'dragon' | 'turtle' | 'tiger'
  | 'crane' | 'bear' | 'wolf' | 'fox'
  | 'deer' | 'eagle' | 'snake' | 'rabbit';

export interface Tribe {
  type: TribeType;
  score: number; // 0-100
  element?: 'fire' | 'water' | 'earth' | 'wood' | 'metal';
}

// ===== Stones (12 Acquired) =====
export type StoneType =
  | 'ruby' | 'sapphire' | 'emerald' | 'diamond'
  | 'amethyst' | 'topaz' | 'opal' | 'jade'
  | 'pearl' | 'amber' | 'obsidian' | 'quartz';

export interface Stone {
  type: StoneType;
  score: number; // 0-100
  quality?: 'clarity' | 'brilliance' | 'durability';
}

// ===== Heroes (144) =====
export interface Hero {
  id: string; // e.g., "phoenix-ruby-001"
  tribe: TribeType;
  stone: StoneType;
  name: string;
  description: string;
  traits: string[];
  archetype?: string;
}

// ===== Growth Vector =====
export interface GrowthVector {
  direction: string; // e.g., "Exploring Intuition"
  magnitude: number; // 0-100
  components: {
    big5Delta?: Partial<Big5Scores>;
    mbtiShift?: string;
    retiGrowth?: string;
  };
}

// ===== Result Snapshot =====
export interface ResultSnapshot {
  id: string;
  userId: string;
  assessmentId: string;
  engineVersion: string;
  
  // Scores
  big5: Big5Scores;
  mbti: MBTIScores;
  reti: RETIScores;
  
  // Mappings
  tribe: Tribe;
  stone: Stone;
  hero: Hero;
  
  // Growth (if comparison available)
  growthVector?: GrowthVector;
  
  // Metadata
  createdAt: string;
  expiresAt?: string;
}

// ===== Report (Async Generated) =====
export interface Report {
  id: string;
  resultId: string;
  userId: string;
  
  status: 'queued' | 'running' | 'ready' | 'failed';
  
  // Content
  summaryMd?: string;
  narrativeMd?: string;
  visuals?: {
    radarChart?: string; // JSON or SVG data
    growthChart?: string;
    heroImage?: string;
  };
  
  // Model info
  modelProvider?: string; // 'openai' | 'anthropic'
  modelVersion?: string;
  promptVersion?: string;
  
  // Timestamps
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  
  error?: string;
}

