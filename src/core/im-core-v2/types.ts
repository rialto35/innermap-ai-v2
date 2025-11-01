export type Likert = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type Axis = "EI" | "SN" | "TF" | "JP";

export type Big5Key = "O" | "C" | "E" | "A" | "N";

export type EnneagramKey = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type MBTIAxis01 = {
  EI: number;
  SN: number;
  TF: number;
  JP: number;
};

export type ItemMeta = {
  id: number;
  question: string;
  axis?: Axis;
  axisSign?: 1 | -1;
  rev?: boolean;
  weight?: number;
  big5?: Partial<Record<Big5Key, number>>;
  ennea?: Partial<Record<EnneagramKey, number>>;
};

export type MBTIConfidence = {
  overall: number;
  axes: Record<Axis, number>;
  boundary: Record<Axis, boolean>;
};

export type MBTIResult = {
  type: string;
  axis01: MBTIAxis01;
  axis100: MBTIAxis01;
  confidence: MBTIConfidence;
};

export type Big5Axis01 = Record<Big5Key, number>;

export type Big5Scores = Record<Big5Key, number>;

export type Big5Result = {
  scores: Big5Scores;
  axis01: Big5Axis01;
  confidence: {
    overall: number;
    axes: Record<Big5Key, number>;
  };
};

export type EnneagramDistribution = Array<{ type: EnneagramKey; p: number }>;

export type EnneagramResult = {
  type: EnneagramKey;
  probTop: number;
  dist: EnneagramDistribution;
};

export type Inner9Map = {
  creation: number;
  will: number;
  expression: number;
  harmony: number;
  sensitivity: number;
  insight: number;
  resilience: number;
  balance: number;
  growth: number;
};

export type EngineConfidence = {
  big5: Big5Result["confidence"];
  mbti: MBTIConfidence;
};

export type EngineResult = {
  engine_version: string;
  big5: Big5Scores;
  mbti: MBTIResult;
  enneagram: EnneagramResult;
  inner9: Inner9Map;
  confidence: EngineConfidence;
};



