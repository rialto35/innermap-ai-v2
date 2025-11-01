// src/core/im-core-v3/benchmark/types.ts

export type MBTI = "INTJ" | "INTP" | "ENTJ" | "ENTP" | "INFJ" | "INFP" | "ENFJ" | "ENFP" |
                   "ISTJ" | "ISFJ" | "ESTJ" | "ESFJ" | "ISTP" | "ISFP" | "ESTP" | "ESFP";

export type Ennea = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Big5 = {
  O: number; // Openness
  C: number; // Conscientiousness
  E: number; // Extraversion
  A: number; // Agreeableness
  N: number; // Neuroticism
};

export type TestRow = {
  mbti_true: MBTI;
  ennea_true: Ennea;
  big5_generated: Big5;
  mbti_pred: MBTI;
  mbti_probs: Record<string, number>;
  ennea_pred: Ennea;
  ennea_probs: number[];
  ennea_top3: Ennea[];
};

export type AxisMetrics = {
  accuracy: number;
  auroc: number;
  brier: number;
  ece: number;
  ci: [number, number]; // 95% 신뢰구간
};

export type EnneaMetrics = {
  top1: number;
  top3: number;
  nll: number;
  brier: number;
  ece: number;
  ci: [number, number];
};

export type BenchmarkReport = {
  meta: {
    version: string;
    timestamp: string;
    sim_version: string;
    infer_version: string;
    seed: number;
    R: number;
  };
  phase1: {
    deterministic: any[];
    mbti_accuracy: number;
    ennea_accuracy: number;
  };
  phase2: {
    mbti: AxisMetrics;
    enneagram: EnneaMetrics;
  };
  calibration: {
    method: "platt" | "temperature" | "platt+temperature" | "none";
    before: { mbti_ece: number; ennea_ece: number };
    after: { mbti_ece: number; ennea_ece: number };
    improvement: { mbti: number; ennea: number };
  };
  confusion: {
    top5: Array<{ combo: string; pred: string; count: number }>;
    heatmap?: string; // 파일 경로
  };
  recommendations: string[];
};

