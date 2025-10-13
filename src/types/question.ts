export type QuestionScale = '2' | '5' | '7';
export type QuestionTag = 'MBTI' | 'RETI' | 'BIG5';

export interface Big5Question {
  id: string;
  text: string;
  scale: QuestionScale;
  tag: QuestionTag;
  dimension?: string;  // E/I, O/C/E/A/N, type1..9 등
  reverse?: boolean;   // 역채점 여부
  options?: string[];  // 2지선다용
}

export type TestMode = 'simple' | 'deep';

export interface TestState {
  mode: TestMode;
  step: number;
  total: number;
  answers: Record<string, number>;
  birth: { y: number; m: number; d: number };
}

export interface TestPlan {
  mode: TestMode;
  questions: Question[];
  total: number;
}

export interface TestScores {
  mbti: {
    axes: Record<'EI' | 'SN' | 'TF' | 'JP', number>;
    type: string;
    confidence: number;
  };
  reti: {
    scores: Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9', number>;
    top: [number, number];
  };
  big5: Record<'O' | 'C' | 'E' | 'A' | 'N', number>;
  birth: Record<string, number>;
}

export interface TestSession {
  id: string;
  mode: TestMode;
  birth: { y: number; m: number; d: number; season: string; weekday: string };
  answers: { qid: string; value: number }[];
  scores: TestScores;
  report: { hero: string; continent: string; sections: any };
}

