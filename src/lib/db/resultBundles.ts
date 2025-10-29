import { supabaseAdmin } from '@/lib/supabase'

// 임시 타입 정의 (나중에 통합)
interface ResultBundle {
  inner9: any;
  hero: any;
  tribe: any;
  stone: any;
  big5: any;
  growth: any;
  assessmentId?: any;
  [key: string]: any;
}

function mapInner9(raw: any): ResultBundle['inner9'] {
  if (!raw || typeof raw !== 'object') return null
  const keys = ['creation','will','sensitivity','harmony','expression','insight','resilience','balance','growth']
  const mapped: any = {}
  let hasValue = false
  for (const key of keys) {
    const value = Number(raw[key] ?? raw[key.toUpperCase()] ?? raw[key.toLowerCase()])
    if (!Number.isFinite(value)) {
      mapped[key] = null
    } else {
      mapped[key] = Math.round(value)
      hasValue = true
    }
  }
  return hasValue ? mapped : null
}

function mapGrowth(raw: any): ResultBundle['growth'] {
  if (!raw || typeof raw !== 'object') return null
  return {
    innate: raw.innate ?? null,
    acquired: raw.acquired ?? null,
    conscious: raw.conscious ?? null,
    unconscious: raw.unconscious ?? null,
    growth: raw.growth ?? null,
    stability: raw.stability ?? null,
    harmony: raw.harmony ?? null,
    individual: raw.individual ?? null,
  }
}

function mapBig5(raw: any): ResultBundle['big5'] {
  if (!raw || typeof raw !== 'object') return null
  const normalize = (value: any) => {
    const num = Number(value ?? 0)
    if (!Number.isFinite(num)) return 0
    const ratio = num > 0 && num <= 1 ? num * 100 : num
    return Math.max(0, Math.min(100, Math.round(ratio)))
  }
  return {
    openness: normalize(raw.O ?? raw.openness),
    conscientiousness: normalize(raw.C ?? raw.conscientiousness),
    extraversion: normalize(raw.E ?? raw.extraversion),
    agreeableness: normalize(raw.A ?? raw.agreeableness),
    neuroticism: normalize(raw.N ?? raw.neuroticism),
  }
}

const bundleSelect = `
  id,
  user_id,
  owner_token,
  completed_at,
  results:results(
    engine_version,
    big5_scores,
    mbti_scores,
    reti_scores,
    inner9_scores,
    tribe,
    stone,
    hero,
    big5_percentiles,
    mbti_ratios,
    analysis_text,
    growth,
    created_at,
    updated_at
  ),
  test_assessment_results(
    mbti,
    big5,
    inner9,
    world,
    confidence,
    created_at
  )
`

async function fetchLatestBundleForUser(userId: string): Promise<ResultBundle | null> {
  if (!userId) return null

  const { data, error } = await supabaseAdmin
    .from('test_assessments')
    .select(bundleSelect)
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error || !data) return null

  return mapAssessmentRowToBundle(data)
}

export async function getLatestResultBundle(userId: string): Promise<ResultBundle | null> {
  return fetchLatestBundleForUser(userId)
}

export async function getResultBundleByAssessmentId(assessmentId: string): Promise<ResultBundle | null> {
  if (!assessmentId) return null

  const { data, error } = await supabaseAdmin
    .from('test_assessments')
    .select(bundleSelect)
    .eq('id', assessmentId)
    .maybeSingle()

  if (error || !data) return null

  return mapAssessmentRowToBundle(data)
}

function mapAssessmentRowToBundle(row: any): ResultBundle {
  const results = Array.isArray(row.results) ? row.results[0] : row.results
  const detailed = Array.isArray(row.test_assessment_results) ? row.test_assessment_results[0] : row.test_assessment_results

  const big5 = results?.big5_scores ?? detailed?.big5 ?? null
  const mbtiScores = results?.mbti_scores ?? null
  const retiScores = results?.reti_scores ?? null
  const inner9 = mapInner9(results?.inner9_scores ?? detailed?.inner9)
  const growth = mapGrowth(results?.growth)

  // Extract hero/tribe/stone from world if not in results
  const world = detailed?.world
  const hero = results?.hero ?? (world?.hero ? { id: world.hero, name: world.hero, traits: [] } : null)
  const tribe = results?.tribe ?? (world?.tribe ? { name: world.tribe, nameEn: world.tribe } : null)
  const stone = results?.stone ?? (world?.stone ? { name: world.stone, nameEn: world.stone } : null)

  return {
    assessmentId: row.id,
    userId: row.user_id ?? null,
    ownerToken: row.owner_token ?? null,
    createdAt: row.completed_at ?? results?.created_at ?? detailed?.created_at ?? '',
    updatedAt: results?.updated_at ?? null,
    engineVersion: results?.engine_version ?? undefined,
    big5: big5 ? mapBig5(big5) : null,
    mbti: mbtiScores
      ? {
          type: mbtiScores.type ?? mbtiScores.MBTI ?? detailed?.mbti ?? null,
          confidence: mbtiScores.confidence ?? detailed?.confidence ?? null
        }
      : detailed?.mbti
        ? { type: detailed.mbti, confidence: detailed?.confidence ?? null }
        : null,
    reti: retiScores
      ? {
          top1: retiScores.primaryType ?? retiScores.top1 ?? null,
          top2: retiScores.secondaryType ?? retiScores.top2 ?? null,
          scores: retiScores.scores ?? undefined
        }
      : detailed?.reti
        ? {
            top1: detailed.reti.top1 ?? null,
            top2: detailed.reti.top2 ?? null,
            scores: detailed.reti.scores ?? undefined
          }
        : null,
    inner9,
    growth,
    hero,
    tribe,
    stone,
    big5Percentiles: results?.big5_percentiles ?? null,
    mbtiRatios: results?.mbti_ratios ?? null,
    analysisText: results?.analysis_text ?? null,
    isLimited: false,
    limitMessage: undefined,
  }
}
