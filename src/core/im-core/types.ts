/**
 * im-core Analysis Pipeline Types
 * @module @innermap/im-core
 */

import { Big5, InnerNine } from '../inner9';

export type AnalyzeInput = {
  dob?: string; // 사주 확장 예정
  mbti?: string;
  reti?: number;
  big5: Big5;
  locale?: 'ko-KR' | 'en-US';
};

export type AnalyzeOutput = {
  inner9: InnerNine;
  hero?: { id: number; code: string; title: string };
  color?: { natal?: number; growth?: number };
  narrative?: { summary: string };
  engineVersion: string;
  modelVersion: string;
};

