// src/lib/db/testResults.ts
// 검사 결과 관련 데이터베이스 함수

import { supabaseAdmin } from '@/lib/supabase'
import type { TestResult } from '@/lib/supabase'

/**
 * 검사 결과 저장
 */
export async function saveTestResult(data: {
  userId: string
  testType: 'imcore' | 'big5' | 'hero-analysis'
  name: string
  birthDate?: string
  genderPreference: 'male' | 'female'
  mbtiType: string
  mbtiConfidence: any
  retiTop1: string
  retiTop2?: string
  retiScores: any
  big5: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  growth: {
    innate: number
    acquired: number
    conscious: number
    unconscious: number
    growth: number
    stability: number
    harmony: number
    individual: number
  }
  hero: {
    id: string
    name: string
  }
  tribe?: {
    name: string
    nameEn: string
  }
  stone?: {
    name: string
  }
  rawScores: any
}): Promise<TestResult | null> {
  try {
    const { data: result, error } = await supabaseAdmin
      .from('test_results')
      .insert({
        user_id: data.userId,
        test_type: data.testType,
        name: data.name,
        birth_date: data.birthDate || null,
        gender_preference: data.genderPreference,
        mbti_type: data.mbtiType,
        mbti_confidence: data.mbtiConfidence,
        reti_top1: data.retiTop1,
        reti_top2: data.retiTop2 || null,
        reti_scores: data.retiScores,
        big5_openness: data.big5.openness,
        big5_conscientiousness: data.big5.conscientiousness,
        big5_extraversion: data.big5.extraversion,
        big5_agreeableness: data.big5.agreeableness,
        big5_neuroticism: data.big5.neuroticism,
        growth_innate: data.growth.innate,
        growth_acquired: data.growth.acquired,
        growth_conscious: data.growth.conscious,
        growth_unconscious: data.growth.unconscious,
        growth_growth: data.growth.growth,
        growth_stability: data.growth.stability,
        growth_harmony: data.growth.harmony,
        growth_individual: data.growth.individual,
        hero_id: data.hero.id,
        hero_name: data.hero.name,
        tribe_name: data.tribe?.name || null,
        tribe_name_en: data.tribe?.nameEn || null,
        stone_name: data.stone?.name || null,
        raw_scores: data.rawScores
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving test result:', error)
      return null
    }

    return result
  } catch (error) {
    console.error('Error in saveTestResult:', error)
    return null
  }
}

/**
 * 사용자의 최신 검사 결과 조회
 */
export async function getLatestTestResult(
  userId: string,
  testType?: 'imcore' | 'big5' | 'hero-analysis'
): Promise<TestResult | null> {
  try {
    let query = supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (testType) {
      query = query.eq('test_type', testType)
    }

    const { data, error } = await query.single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned
        return null
      }
      console.error('Error getting latest test result:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getLatestTestResult:', error)
    return null
  }
}

/**
 * 사용자의 검사 결과 목록 조회
 */
export async function getTestResults(
  userId: string,
  options?: {
    testType?: 'imcore' | 'big5' | 'hero-analysis'
    limit?: number
    offset?: number
  }
): Promise<TestResult[]> {
  try {
    let query = supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options?.testType) {
      query = query.eq('test_type', options.testType)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error getting test results:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getTestResults:', error)
    return []
  }
}

/**
 * 검사 결과 ID로 조회
 */
export async function getTestResultById(
  resultId: string
): Promise<TestResult | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('test_results')
      .select('*')
      .eq('id', resultId)
      .single()

    if (error) {
      console.error('Error getting test result:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error in getTestResultById:', error)
    return null
  }
}

/**
 * 검사 결과 삭제
 */
export async function deleteTestResult(
  resultId: string,
  userId: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from('test_results')
      .delete()
      .eq('id', resultId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting test result:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error in deleteTestResult:', error)
    return false
  }
}

