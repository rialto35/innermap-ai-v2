/**
 * Assessment Database Operations
 */

import { createClient } from '@/lib/supabase';
import type { Answer } from '@innermap/engine';
import type { DbAssessment, DbResult } from '@innermap/types';

/**
 * Assessment 생성
 */
export async function createAssessment(
  userId: string,
  answers: Answer[],
  answersHash: string,
  engineVersion: string,
  testType: 'lite' | 'full' = 'full'
): Promise<DbAssessment> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      answers: answers,
      answers_hash: answersHash,
      engine_version: engineVersion,
      test_type: testType
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Hash로 기존 assessment 찾기 (idempotency)
 */
export async function findAssessmentByHash(
  userId: string,
  answersHash: string,
  engineVersion: string
): Promise<DbAssessment | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .eq('answers_hash', answersHash)
    .eq('engine_version', engineVersion)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

/**
 * Result 생성
 */
export async function createResult(
  userId: string,
  assessmentId: string,
  engineVersion: string,
  big5Scores: any,
  mbtiScores: any,
  retiScores: any,
  tribe: any,
  stone: any,
  hero: any
): Promise<DbResult> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('results')
    .insert({
      user_id: userId,
      assessment_id: assessmentId,
      engine_version: engineVersion,
      big5_scores: big5Scores,
      mbti_scores: mbtiScores,
      reti_scores: retiScores,
      tribe: tribe,
      stone: stone,
      hero: hero
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

/**
 * Assessment의 기존 Result 찾기
 */
export async function findResultByAssessment(
  assessmentId: string
): Promise<DbResult | null> {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('results')
    .select('*')
    .eq('assessment_id', assessmentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

