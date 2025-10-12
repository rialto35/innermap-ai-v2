import { Question, Scores, SliderItem, PairItem } from './types'

export const emptyScores = (): Scores => ({
  MBTI: { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 },
  Big5: { O: 0, C: 0, E_b5: 0, A: 0, N_b5: 0 },
  RETI: { r1: 0, r2: 0, r3: 0, r4: 0, r5: 0, r6: 0, r7: 0, r8: 0, r9: 0 },
  Growth: {
    innate: 0,
    acquired: 0,
    conscious: 0,
    unconscious: 0,
    growth: 0,
    stability: 0,
    harmony: 0,
    individual: 0,
  },
})

const addWeights = (scores: Scores, weights: any, scale: number) => {
  if (weights.MBTI) {
    for (const key in weights.MBTI) {
      const axis = key as keyof Scores['MBTI']
      scores.MBTI[axis] += scale * (weights.MBTI[axis] ?? 0)
    }
  }
  if (weights.Big5) {
    for (const key in weights.Big5) {
      const axis = key as keyof Scores['Big5']
      scores.Big5[axis] += scale * (weights.Big5[axis] ?? 0)
    }
  }
  if (weights.RETI) {
    for (const key in weights.RETI) {
      const axis = key as keyof Scores['RETI']
      scores.RETI[axis] += scale * (weights.RETI[axis] ?? 0)
    }
  }
  if (weights.Growth) {
    for (const key in weights.Growth) {
      const axis = key as keyof Scores['Growth']
      scores.Growth[axis] += scale * (weights.Growth[axis] ?? 0)
    }
  }
}

export type Answers = Record<number, number | 'A' | 'B'>

export function score(questions: Question[], answers: Answers) {
  const s = emptyScores()
  for (const q of questions) {
    const answer = answers[q.id]
    if (q.kind === 'slider') {
      const raw = typeof answer === 'number' ? answer : 50
      const z = (raw - 50) / 50
      addWeights(s, (q as SliderItem).weights, z)
    } else {
      const pair = q as PairItem
      if (answer === 'A') addWeights(s, pair.weightsA, 1)
      if (answer === 'B') addWeights(s, pair.weightsB, 1)
    }
  }
  return s
}

export function mbtiFromScores(scores: Scores) {
  const pick = (left: 'E' | 'S' | 'T' | 'J', right: 'I' | 'N' | 'F' | 'P') =>
    scores.MBTI[left] >= scores.MBTI[right] ? left : right

  const EI = pick('E', 'I')
  const SN = pick('S', 'N')
  const TF = pick('T', 'F')
  const JP = pick('J', 'P')

  const conf = {
    EI: Math.abs(scores.MBTI.E - scores.MBTI.I),
    SN: Math.abs(scores.MBTI.S - scores.MBTI.N),
    TF: Math.abs(scores.MBTI.T - scores.MBTI.F),
    JP: Math.abs(scores.MBTI.J - scores.MBTI.P),
  }

  return { type: `${EI}${SN}${TF}${JP}`, conf }
}

export function retiTop2(scores: Scores) {
  const entries = Object.entries(scores.RETI).sort((a, b) => b[1] - a[1])
  return { top1: entries[0], top2: entries[1] }
}

export function big5Scaled(scores: Scores) {
  const scale = (value: number) => Math.max(0, Math.min(100, Math.round((value + 2) * 25)))
  return {
    O: scale(scores.Big5.O),
    C: scale(scores.Big5.C),
    E: scale(scores.Big5.E_b5),
    A: scale(scores.Big5.A),
    N: scale(scores.Big5.N_b5),
  }
}
