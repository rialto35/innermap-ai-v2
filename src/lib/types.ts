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

export type SliderItem = {
  id: number
  kind: 'slider'
  text: string
  leftLabel?: string
  rightLabel?: string
  weights: WeightMap
}

export type PairItem = {
  id: number
  kind: 'pair'
  a: string
  b: string
  weightsA: WeightMap
  weightsB: WeightMap
}

export type Question = SliderItem | PairItem

export type Scores = {
  MBTI: Record<AxisMBTI, number>
  Big5: Record<AxisBig5, number>
  RETI: Record<AxisRETI, number>
  Growth: Record<AxisGrowth, number>
}

