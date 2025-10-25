/**
 * im-core 엔진 타입 정의
 */

export type RawResponse = number[]; // Length 55, 1-7 Likert scale etc.

export type Big5Scores = { o: number; c: number; e: number; a: number; n: number };

export type Inner9Axis = { label: string; value: number };

export type Weights = {
  big5: number;
  mbti: number;
  reti: number;
};

export type FullResult = {
  big5: Big5Scores;
  mbti: string;
  reti: number;
  inner9: Inner9Axis[];
  timestamp: string;
};

export type EngineMetadata = {
  version: string;
  buildDate: string;
  weightsVersion: string;
  weightsChecksum: string;
};