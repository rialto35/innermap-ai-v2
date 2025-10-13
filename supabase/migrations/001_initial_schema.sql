-- InnerMap AI v2 - Initial Database Schema
-- 생성일: 2025-01-13

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. Users 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  provider TEXT NOT NULL DEFAULT 'google', -- 'google', 'kakao', 'naver'
  provider_id TEXT, -- OAuth provider의 user ID
  
  -- 레벨/경험치 시스템
  level INTEGER DEFAULT 1,
  exp_current INTEGER DEFAULT 0,
  exp_next INTEGER DEFAULT 500,
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users 인덱스
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_provider_id ON users(provider, provider_id);

-- =====================================================
-- 2. Test Results 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_type TEXT NOT NULL DEFAULT 'imcore', -- 'imcore', 'big5', 'hero-analysis'
  
  -- 기본 정보
  name TEXT NOT NULL,
  birth_date DATE,
  gender_preference TEXT DEFAULT 'male', -- 'male', 'female'
  
  -- MBTI 결과
  mbti_type TEXT NOT NULL, -- 'ENFP', 'INTP', etc.
  mbti_confidence JSONB, -- { "EI": 0.85, "SN": 0.72, "TF": 0.91, "JP": 0.68 }
  
  -- RETI 결과
  reti_top1 TEXT NOT NULL, -- 'r7', 'r8', etc.
  reti_top2 TEXT,
  reti_scores JSONB, -- { "r1": 0.1, "r2": 0.2, ... "r9": 0.9 }
  
  -- Big5 점수 (0-100)
  big5_openness INTEGER,
  big5_conscientiousness INTEGER,
  big5_extraversion INTEGER,
  big5_agreeableness INTEGER,
  big5_neuroticism INTEGER,
  
  -- 성장 벡터 (0-100)
  growth_innate INTEGER,
  growth_acquired INTEGER,
  growth_conscious INTEGER,
  growth_unconscious INTEGER,
  growth_growth INTEGER,
  growth_stability INTEGER,
  growth_harmony INTEGER,
  growth_individual INTEGER,
  
  -- 영웅/부족/결정석
  hero_id TEXT NOT NULL, -- 'enfp-7'
  hero_name TEXT NOT NULL, -- '희망의 불꽃'
  tribe_name TEXT,
  tribe_name_en TEXT,
  stone_name TEXT,
  
  -- 원본 점수 (전체 JSON)
  raw_scores JSONB,
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test Results 인덱스
CREATE INDEX idx_test_results_user_id ON test_results(user_id);
CREATE INDEX idx_test_results_created_at ON test_results(created_at DESC);
CREATE INDEX idx_test_results_mbti ON test_results(mbti_type);
CREATE INDEX idx_test_results_hero ON test_results(hero_id);

-- =====================================================
-- 3. AI Reports 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS ai_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  test_result_id UUID REFERENCES test_results(id) ON DELETE CASCADE,
  
  report_type TEXT NOT NULL DEFAULT 'hero-analysis', -- 'hero-analysis', 'growth-path', 'relationship'
  content TEXT NOT NULL, -- Markdown 형식의 리포트
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Reports 인덱스
CREATE INDEX idx_ai_reports_user_id ON ai_reports(user_id);
CREATE INDEX idx_ai_reports_test_result_id ON ai_reports(test_result_id);
CREATE INDEX idx_ai_reports_created_at ON ai_reports(created_at DESC);

-- =====================================================
-- 4. User Settings 테이블
-- =====================================================
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  
  -- 알림 설정
  email_notifications BOOLEAN DEFAULT true,
  push_notifications BOOLEAN DEFAULT false,
  
  -- 개인정보 설정
  profile_visibility TEXT DEFAULT 'private', -- 'public', 'friends', 'private'
  
  -- 테마 설정
  theme TEXT DEFAULT 'dark', -- 'dark', 'light', 'auto'
  language TEXT DEFAULT 'ko', -- 'ko', 'en', 'ja'
  
  -- 메타데이터
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings 인덱스
CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

-- =====================================================
-- 5. Triggers for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_test_results_updated_at
  BEFORE UPDATE ON test_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_reports_updated_at
  BEFORE UPDATE ON ai_reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. Row Level Security (RLS) 설정
-- =====================================================

-- Users 테이블 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Test Results 테이블 RLS
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own test results"
  ON test_results FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own test results"
  ON test_results FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own test results"
  ON test_results FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- AI Reports 테이블 RLS
ALTER TABLE ai_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON ai_reports FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own reports"
  ON ai_reports FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- User Settings 테이블 RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings"
  ON user_settings FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own settings"
  ON user_settings FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own settings"
  ON user_settings FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

-- =====================================================
-- 7. 초기 데이터 (선택사항)
-- =====================================================

-- 샘플 사용자 (테스트용)
-- INSERT INTO users (email, name, provider) VALUES
--   ('test@innermap.ai', 'Test User', 'google');

COMMENT ON TABLE users IS 'InnerMap AI 사용자 프로필';
COMMENT ON TABLE test_results IS 'IM-CORE 검사 결과 저장';
COMMENT ON TABLE ai_reports IS 'GPT 기반 AI 분석 리포트';
COMMENT ON TABLE user_settings IS '사용자 설정 및 환경설정';

