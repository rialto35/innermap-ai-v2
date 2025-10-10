// 점수 계산 로직

interface MBTIScores {
  E: number  // 외향
  I: number  // 내향
  S: number  // 감각
  N: number  // 직관
  T: number  // 사고
  F: number  // 감정
  J: number  // 판단
  P: number  // 인식
}

export function calculateMBTI(_answers: Record<string, number>): string {
  // Mock 계산 (실제로는 문항별 가중치 적용)
  const scores: MBTIScores = {
    E: 0, I: 0,
    S: 0, N: 0,
    T: 0, F: 0,
    J: 0, P: 0
  }

  // 각 축별 우세 타입 결정
  const result = 
    (scores.E >= scores.I ? 'E' : 'I') +
    (scores.S >= scores.N ? 'S' : 'N') +
    (scores.T >= scores.F ? 'T' : 'F') +
    (scores.J >= scores.P ? 'J' : 'P')

  return result
}

export function calculateRETI(_answers: Record<string, number>): { primary: number; secondary: number } {
  // 9가지 유형별 점수
  const typeScores = Array(9).fill(0)

  // Mock 계산
  Object.values(_answers).forEach((value, index) => {
    const typeIndex = index % 9
    typeScores[typeIndex] += value
  })

  // 상위 2개 유형 반환
  const sorted = typeScores
    .map((score, index) => ({ type: index + 1, score }))
    .sort((a, b) => b.score - a.score)

  return {
    primary: sorted[0].type,
    secondary: sorted[1].type
  }
}

export function calculateBig5(_answers: Record<string, number>): Record<string, number> {
  // Big5 5요인
  const factors = {
    O: 0,  // 개방성
    C: 0,  // 성실성
    E: 0,  // 외향성
    A: 0,  // 친화성
    N: 0   // 신경성
  }

  // Mock 계산 (0-100 정규화)
  factors.O = Math.floor(Math.random() * 40) + 60  // 60-100
  factors.C = Math.floor(Math.random() * 40) + 40  // 40-80
  factors.E = Math.floor(Math.random() * 40) + 50  // 50-90
  factors.A = Math.floor(Math.random() * 40) + 50  // 50-90
  factors.N = Math.floor(Math.random() * 40) + 20  // 20-60

  return factors
}

export function normalizeScore(score: number, min: number, max: number): number {
  return Math.round(((score - min) / (max - min)) * 100)
}
