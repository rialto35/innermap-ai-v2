// Big5 성격 검사 점수 계산 유틸리티

export interface Big5Answers {
  [questionId: number]: number; // 1-5 점수
}

export interface Big5Scores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface Big5Question {
  id: number;
  question: string;
  trait: keyof Big5Scores;
  reverse: boolean;
}

/**
 * Big5 점수 계산 함수
 * @param answers 사용자 답변 (questionId: score)
 * @param questions 질문 데이터
 * @returns 0-100 스케일의 Big5 점수
 */
export function calculateBig5Scores(
  answers: Big5Answers,
  questions: Big5Question[]
): Big5Scores {
  // 각 특성별 원점수 합계
  const rawScores: Record<keyof Big5Scores, number[]> = {
    openness: [],
    conscientiousness: [],
    extraversion: [],
    agreeableness: [],
    neuroticism: [],
  };

  // 각 질문에 대해 점수 계산
  questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer === undefined) return;

    // 역문항 처리: 5점 척도에서 역전 (1→5, 2→4, 3→3, 4→2, 5→1)
    const score = question.reverse ? 6 - answer : answer;
    
    rawScores[question.trait].push(score);
  });

  // 각 특성별로 0-100 스케일로 변환
  const scores: Big5Scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0,
  };

  (Object.keys(rawScores) as Array<keyof Big5Scores>).forEach((trait) => {
    const traitScores = rawScores[trait];
    if (traitScores.length === 0) {
      scores[trait] = 0;
      return;
    }

    // 평균 점수 계산 (1-5 범위)
    const average = traitScores.reduce((sum, score) => sum + score, 0) / traitScores.length;
    
    // 0-100 스케일로 변환: (평균 - 1) / 4 * 100
    scores[trait] = Math.round(((average - 1) / 4) * 100);
  });

  return scores;
}

/**
 * 점수를 기반으로 특성 레벨 반환
 * @param score 0-100 점수
 * @returns "매우 낮음" | "낮음" | "보통" | "높음" | "매우 높음"
 */
export function getScoreLevel(score: number): string {
  if (score < 20) return "매우 낮음";
  if (score < 40) return "낮음";
  if (score < 60) return "보통";
  if (score < 80) return "높음";
  return "매우 높음";
}

/**
 * Big5 결과 요약 텍스트 생성
 * @param scores Big5 점수
 * @param traits 특성 정보
 * @returns 요약 텍스트
 */
export function generateBig5Summary(
  scores: Big5Scores,
  traits: Record<keyof Big5Scores, { name: string; high: string; low: string }>
): string {
  const summaries: string[] = [];

  (Object.keys(scores) as Array<keyof Big5Scores>).forEach((trait) => {
    const score = scores[trait];
    const traitInfo = traits[trait];
    
    if (score >= 60) {
      summaries.push(`${traitInfo.name}이 높아 ${traitInfo.high.toLowerCase()}`);
    } else if (score <= 40) {
      summaries.push(`${traitInfo.name}이 낮아 ${traitInfo.low.toLowerCase()}`);
    }
  });

  if (summaries.length === 0) {
    return "모든 특성이 균형잡힌 성격입니다.";
  }

  return summaries.join(", ") + ".";
}

