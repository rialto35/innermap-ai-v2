import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Server-side client factory
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// 서버 사이드에서 사용할 Service Role 클라이언트
export const supabaseAdmin = createSupabaseClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 타입 정의
export interface User {
  id: string
  email: string
  name: string | null
  image: string | null
  provider: string
  provider_id?: string
  level: number
  exp_current: number
  exp_next: number
  created_at: string
  updated_at: string
}

export interface TestResult {
  id: string
  user_id: string
  test_type: 'imcore' | 'big5' | 'hero-analysis'
  
  // 기본 정보
  name: string
  birth_date: string | null
  gender_preference: 'male' | 'female'
  
  // 검사 결과
  mbti_type: string
  mbti_confidence: any // JSON: { EI, SN, TF, JP }
  reti_top1: string
  reti_top2: string | null
  reti_scores: any // JSON: { r1, r2, ... r9 }
  
  // Big5
  big5_openness: number
  big5_conscientiousness: number
  big5_extraversion: number
  big5_agreeableness: number
  big5_neuroticism: number
  
  // 성장 벡터
  growth_innate: number
  growth_acquired: number
  growth_conscious: number
  growth_unconscious: number
  growth_growth: number
  growth_stability: number
  growth_harmony: number
  growth_individual: number
  
  // 영웅/부족/결정석
  hero_id: string
  hero_name: string
  tribe_name: string | null
  tribe_name_en: string | null
  stone_name: string | null
  
  // 원본 점수 (JSON)
  raw_scores: any
  
  // 메타
  created_at: string
  updated_at: string
}

export interface AIReport {
  id: string
  user_id: string
  test_result_id: string
  
  report_type: 'hero-analysis' | 'growth-path' | 'relationship'
  content: string // Markdown
  
  created_at: string
  updated_at: string
}

