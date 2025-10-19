/**
 * im-core Analysis Pipeline Types
 * @module @innermap/im-core
 */

import { Big5, InnerNine } from '../inner9';
import type { MBTIResult } from './scoreMBTI';
import type { RETIResult } from './scoreRETI';

export type AnalyzeInput = {
  dob?: string; // 사주 확장 예정
  mbti?: string;
  reti?: number;
  big5: Big5;
  locale?: 'ko-KR' | 'en-US';
  // Demographics for norm-based scoring
  age?: number;
  gender?: 'male' | 'female';
};

export type ColorStone = {
  id: number;
  name: string;
  color: string;
  score?: number;
};

export type AnalyzeOutput = {
  inner9: InnerNine;
  hero?: { 
    id: number; 
    code: string; 
    title: string; 
    color?: number; 
    score?: number;
    tribe?: string;
    mbti?: string;
  };
  color?: { natal: ColorStone; growth: ColorStone };
  narrative?: { summary: string };
  
  // Enhanced scoring results
  big5Percentiles?: Record<keyof Big5, number>;
  mbtiResult?: MBTIResult;
  retiResult?: RETIResult;
  
  // Metadata
  engineVersion: string;
  modelVersion: string;
  normsVersion?: string;
};

