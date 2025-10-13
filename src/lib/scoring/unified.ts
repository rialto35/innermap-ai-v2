import { Big5Question } from '@/types/question';
import { TestScores } from '@/types/question';

interface Answer {
  qid: string;
  value: number;
}

// MBTI 점수화
export function calculateMBTI(answers: Answer[], questions: Big5Question[]): TestScores['mbti'] {
  const scores = { EI: 0, SN: 0, TF: 0, JP: 0 };
  const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };

  answers.forEach(({ qid, value }) => {
    const q = questions.find(q => q.id === qid);
    if (!q || q.tag !== 'MBTI' || !q.dimension) return;

    const axis = q.dimension as keyof typeof scores;
    if (!axis) return;

    // 5점 척도를 -2 ~ +2로 변환
    let score = value - 3; // 1->-2, 2->-1, 3->0, 4->1, 5->2
    
    if (q.reverse) {
      score = -score;
    }

    scores[axis] += score;
    counts[axis] += 1;
  });

  // 평균 계산
  const axes: Record<'EI' | 'SN' | 'TF' | 'JP', number> = {
    EI: counts.EI > 0 ? scores.EI / counts.EI : 0,
    SN: counts.SN > 0 ? scores.SN / counts.SN : 0,
    TF: counts.TF > 0 ? scores.TF / counts.TF : 0,
    JP: counts.JP > 0 ? scores.JP / counts.JP : 0,
  };

  // 타입 결정
  const type = 
    (axes.EI > 0 ? 'E' : 'I') +
    (axes.SN > 0 ? 'N' : 'S') +
    (axes.TF > 0 ? 'T' : 'F') +
    (axes.JP > 0 ? 'J' : 'P');

  // 신뢰도 계산 (평균 절대값)
  const confidence = Math.min(100, 
    (Math.abs(axes.EI) + Math.abs(axes.SN) + Math.abs(axes.TF) + Math.abs(axes.JP)) / 4 * 50
  );

  return { axes, type, confidence };
}

// RETI (에니어그램) 점수화
export function calculateRETI(answers: Answer[], questions: Big5Question[]): TestScores['reti'] {
  const scores: Record<string, number> = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
    '6': 0, '7': 0, '8': 0, '9': 0
  };
  const counts: Record<string, number> = {
    '1': 0, '2': 0, '3': 0, '4': 0, '5': 0,
    '6': 0, '7': 0, '8': 0, '9': 0
  };

  answers.forEach(({ qid, value }) => {
    const q = questions.find(q => q.id === qid);
    if (!q || q.tag !== 'RETI' || !q.dimension) return;

    const type = q.dimension.replace('type', '');
    scores[type] += value;
    counts[type] += 1;
  });

  // 평균 계산
  Object.keys(scores).forEach(key => {
    if (counts[key] > 0) {
      scores[key] = scores[key] / counts[key];
    }
  });

  // 상위 2개 선택
  const sorted = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  return {
    scores: scores as Record<'1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9', number>,
    top: [parseInt(sorted[0][0]), parseInt(sorted[1][0])] as [number, number]
  };
}

// Big5 점수화
export function calculateBig5(answers: Answer[], questions: Big5Question[]): TestScores['big5'] {
  const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  answers.forEach(({ qid, value }) => {
    const q = questions.find(q => q.id === qid);
    if (!q || q.tag !== 'BIG5' || !q.dimension) return;

    const dim = q.dimension as keyof typeof scores;
    let score = value;

    // 역채점 처리
    if (q.reverse) {
      score = 6 - value; // 5점 척도 역전
    }

    scores[dim] += score;
    counts[dim] += 1;
  });

  // 0-100 스케일로 정규화
  return {
    O: counts.O > 0 ? (scores.O / counts.O - 1) * 25 : 50,
    C: counts.C > 0 ? (scores.C / counts.C - 1) * 25 : 50,
    E: counts.E > 0 ? (scores.E / counts.E - 1) * 25 : 50,
    A: counts.A > 0 ? (scores.A / counts.A - 1) * 25 : 50,
    N: counts.N > 0 ? (scores.N / counts.N - 1) * 25 : 50,
  };
}

// 생년월일 프로필
export function calculateBirthProfile(birth: { y: number; m: number; d: number }): Record<string, number> {
  const date = new Date(birth.y, birth.m - 1, birth.d);
  const weekday = date.getDay(); // 0-6
  
  // 계절 매핑 (북반구 기준)
  let season = 0;
  if (birth.m >= 3 && birth.m <= 5) season = 1; // 봄
  else if (birth.m >= 6 && birth.m <= 8) season = 2; // 여름
  else if (birth.m >= 9 && birth.m <= 11) season = 3; // 가을
  else season = 0; // 겨울

  return {
    weekday: weekday / 6,
    season: season / 3,
    month: (birth.m - 1) / 11,
    day: (birth.d - 1) / 30
  };
}

// 통합 점수화
export function calculateAllScores(
  answers: Answer[],
  questions: Big5Question[],
  birth: { y: number; m: number; d: number }
): TestScores {
  return {
    mbti: calculateMBTI(answers, questions),
    reti: calculateRETI(answers, questions),
    big5: calculateBig5(answers, questions),
    birth: calculateBirthProfile(birth)
  };
}

