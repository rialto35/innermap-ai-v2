export type AxisMBTI = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
export type AxisBig5 = 'O' | 'C' | 'E_b5' | 'A' | 'N_b5'
export type AxisRETI = 'r1' | 'r2' | 'r3' | 'r4' | 'r5' | 'r6' | 'r7' | 'r8' | 'r9'
export type AxisGrowth =
  | 'innate'
  | 'acquired'
  | 'conscious'
  | 'unconscious'
  | 'growth'
  | 'stability'
  | 'harmony'
  | 'individual'

export type WeightMap = {
  MBTI?: Partial<Record<AxisMBTI, number>>
  Big5?: Partial<Record<AxisBig5, number>>
  RETI?: Partial<Record<AxisRETI, number>>
  Growth?: Partial<Record<AxisGrowth, number>>
}

export type ItemMeta = {
  reliability?: number // 0.5~1.5
  clip?: number // 허버 클리핑 δ (기본 0.8)
  group?: 'MBTI' | 'RETI' | 'Big5' | 'Growth'
}

export type SliderItem = {
  id: number
  kind: 'slider'
  text: string
  leftLabel?: string
  rightLabel?: string
  weights: WeightMap
  meta?: ItemMeta
}

export type PairItem = {
  id: number
  kind: 'pair'
  a: string
  b: string
  weightsA: WeightMap
  weightsB: WeightMap
  meta?: ItemMeta
}

export type Question = SliderItem | PairItem

export type Scores = {
  MBTI: Record<AxisMBTI, number>
  Big5: Record<AxisBig5, number>
  RETI: Record<AxisRETI, number>
  Growth: Record<AxisGrowth, number>
}

// Deep Analysis Types
export interface Big5Percentiles {
  O: number // Openness (0-100)
  C: number // Conscientiousness (0-100)
  E: number // Extraversion (0-100)
  A: number // Agreeableness (0-100)
  N: number // Neuroticism (0-100)
}

export interface MBTIRatios {
  EI: number // Extraversion vs Introversion (0-100)
  SN: number // Sensing vs Intuition (0-100)
  TF: number // Thinking vs Feeling (0-100)
  JP: number // Judging vs Perceiving (0-100)
}

export interface AnalyzeResult {
  // Basic info
  userId: string
  testType: string
  
  // Scores
  big5: { O: number; C: number; E: number; A: number; N: number }
  mbti: string
  reti?: { top1: string; top2?: string }
  
  // Deep analysis
  big5Percentiles: Big5Percentiles
  mbtiRatios: MBTIRatios
  analysisText: string
  
  // Hero matching
  hero?: {
    id: string
    name: string
    tribe?: string
    stone?: string
  }
  
  // Growth vectors
  growth?: {
    innate: number
    acquired: number
    conscious: number
    unconscious: number
    growth: number
    stability: number
    harmony: number
    individual: number
  }
}

