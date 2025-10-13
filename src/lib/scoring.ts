import { Question, Scores, SliderItem, PairItem } from './types'

// ---------- 기본 스코어 컨테이너 ----------
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

// ---------- 유틸 ----------
const huber = (z: number, delta: number) => {
  const a = Math.abs(z)
  if (a <= delta) return z
  return Math.sign(z) * delta
}

const addWeights = (scores: Scores, w: any, z: number, rel = 1) => {
  if (w.MBTI) for (const k in w.MBTI) scores.MBTI[k as keyof Scores['MBTI']] += z * (w.MBTI as any)[k] * rel
  if (w.Big5) for (const k in w.Big5) scores.Big5[k as keyof Scores['Big5']] += z * (w.Big5 as any)[k] * rel
  if (w.RETI) for (const k in w.RETI) scores.RETI[k as keyof Scores['RETI']] += z * (w.RETI as any)[k] * rel
  if (w.Growth) for (const k in w.Growth) scores.Growth[k as keyof Scores['Growth']] += z * (w.Growth as any)[k] * rel
}

// 축-쌍 결합
const antagonisticCouple = (s: Scores, k1: keyof Scores['MBTI'], k2: keyof Scores['MBTI'], alpha = 0.15) => {
  const diff = s.MBTI[k1] - s.MBTI[k2]
  s.MBTI[k1] += alpha * diff
  s.MBTI[k2] -= alpha * diff
}

// ---------- 감정상태 보정 ----------
export type StateAdjust = {
  fatigue?: number // 0..1
  stress?: number // 0..1
  arousal?: number // 0..1
}

const applyStateAdjust = (s: Scores, st?: StateAdjust) => {
  if (!st) return
  const f = st.fatigue ?? 0,
    r = st.stress ?? 0,
    a = st.arousal ?? 0
  s.Big5.E_b5 -= 0.6 * f
  s.MBTI.J += 0.4 * f
  s.Big5.N_b5 += 0.7 * (f * 0.6 + r * 0.7)
  s.MBTI.F += 0.2 * r
  s.Big5.E_b5 += 0.6 * a
  s.MBTI.P += 0.3 * a
  s.Big5.O += 0.4 * a
}

// ---------- 메인 채점 ----------
export type Answers = Record<number, number | 'A' | 'B'>

/** v1.1: 허버클리핑, 신뢰도가중, 축-쌍 결합 포함 */
export function score(questions: Question[], answers: Answers, state?: StateAdjust) {
  const s = emptyScores()

  for (const q of questions) {
    const rel = (q as any).meta?.reliability ?? 1
    const delta = (q as any).meta?.clip ?? 0.8

    const v = answers[q.id]
    if (q.kind === 'slider') {
      const x = typeof v === 'number' ? v : 50
      let z = (x - 50) / 50
      z = huber(z, delta)
      addWeights(s, (q as SliderItem).weights, z, rel)
    } else {
      const sign = v === 'A' ? +1 : v === 'B' ? -1 : 0
      const qa = q as PairItem
      if (sign === +1) addWeights(s, qa.weightsA, +1 * rel)
      if (sign === -1) addWeights(s, qa.weightsB, +1 * rel)
    }
  }

  applyStateAdjust(s, state)

  antagonisticCouple(s, 'E', 'I')
  antagonisticCouple(s, 'N', 'S')
  antagonisticCouple(s, 'T', 'F')
  antagonisticCouple(s, 'J', 'P')

  return s
}

// ---------- MBTI 소프트맥스 판정 ----------
const soft = (x: number[]) => {
  const m = Math.max(...x)
  const e = x.map(v => Math.exp(v - m))
  const sum = e.reduce((a, b) => a + b, 0)
  return e.map(v => v / sum)
}

export function mbtiFromScores(s: Scores) {
  const pair = (a: number, b: number, L: string, R: string) => {
    const p = soft([a, b]) // [pL, pR]
    return { letter: a >= b ? L : R, prob: a >= b ? p[0] : p[1], pairProb: p }
  }
  const EI = pair(s.MBTI.E, s.MBTI.I, 'E', 'I')
  const SN = pair(s.MBTI.N, s.MBTI.S, 'N', 'S')
  const TF = pair(s.MBTI.T, s.MBTI.F, 'T', 'F')
  const JP = pair(s.MBTI.J, s.MBTI.P, 'J', 'P')
  const type = `${EI.letter}${SN.letter}${TF.letter}${JP.letter}`
  const conf = { EI: EI.prob, SN: SN.prob, TF: TF.prob, JP: JP.prob }
  return { type, conf, raw: { EI, SN, TF, JP } }
}

// ---------- RETI Top2 + 타이브레이커 ----------
export function retiTop2(s: Scores) {
  const entries = Object.entries(s.RETI).sort((a, b) => b[1] - a[1])
  const [t1, t2] = [entries[0], entries[1]]
  return { top1: t1, top2: t2 }
}

export function retiTieBreak(mbti: string, s: Scores, base: number) {
  let k = base
  const E = s.Big5.E_b5,
    C = s.Big5.C,
    O = s.Big5.O,
    N = s.Big5.N_b5
  if (mbti.startsWith('ENF') && base === 7) {
    if (E > 0.8 && C > 0.4 && N < 0.2) k = 8
  }
  if (mbti.startsWith('EN') && base === 7) {
    if (E > 0.7 && C > 0.6 && O < 0.3) k = 3
  }
  return k
}

// ---------- Big5 정규화 ----------
export function big5Scaled(s: Scores) {
  const scale = (v: number) => Math.max(0, Math.min(100, Math.round((v + 2) * 25)))
  return { O: scale(s.Big5.O), C: scale(s.Big5.C), E: scale(s.Big5.E_b5), A: scale(s.Big5.A), N: scale(s.Big5.N_b5) }
}
