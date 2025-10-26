export type ResultSummary = {
  mbti: string;
  big5: { O: number; C: number; E: number; A: number; N: number };
  keywords: string[];
  confidence?: number;
};

export type ResultDetail = {
  inner9: { labels: string[]; axes: number[] };
  world: { continent: string; tribe: string; stone: string };
  growthVector?: { from: number[]; to: number[] };
};

export type ResultDashboard = {
  level: number;
  xp: { current: number; max: number };
  strengths: string[];
  growthAreas: string[];
  quests: Array<{ id: string; title: string; difficulty: 'EASY' | 'MED' | 'HARD' }>;
};

export type ResultCoaching = {
  daily: { stars: number; oneLiner: string; actions: string[] };
  weeklyPlan: { rituals: string[]; blockers: string[] };
  narrative: { work: string; relation: string; habit: string };
};

export type ResultBundle = {
  id: string;
  summary?: ResultSummary;
  detail?: ResultDetail;
  dashboard?: ResultDashboard;
  coaching?: ResultCoaching;
};
