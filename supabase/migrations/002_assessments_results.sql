-- InnerMap AI v2 - Assessments & Results Schema
-- PR #3, #4.5 - New architecture for unified flow
-- Created: 2025-10-16

-- =====================================================
-- 1. Assessments 테이블 (원시 응답 저장)
-- =====================================================
CREATE TABLE IF NOT EXISTS assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL, -- email for now (TODO: migrate to UUID)
  
  -- Raw answers
  answers JSONB NOT NULL, -- { "q_001": 5, "q_002": 3, ... }
  answers_hash TEXT NOT NULL, -- SHA256 hash for idempotency
  
  -- Metadata
  engine_version TEXT NOT NULL DEFAULT 'v1.1.0',
  test_type TEXT NOT NULL DEFAULT 'full', -- 'quick' | 'full'
  draft BOOLEAN DEFAULT false, -- true for auto-save drafts
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments 인덱스
CREATE INDEX idx_assessments_user_id ON assessments(user_id);
CREATE INDEX idx_assessments_hash ON assessments(user_id, answers_hash, engine_version);
CREATE INDEX idx_assessments_draft ON assessments(user_id, draft);
CREATE INDEX idx_assessments_created_at ON assessments(created_at DESC);

-- Unique constraint for idempotency (exclude drafts)
CREATE UNIQUE INDEX idx_assessments_unique_final 
  ON assessments(user_id, answers_hash, engine_version) 
  WHERE draft = false;

-- =====================================================
-- 2. Results 테이블 (스코어링 결과 스냅샷)
-- =====================================================
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  
  -- Engine version for reproducibility
  engine_version TEXT NOT NULL DEFAULT 'v1.1.0',
  
  -- Big5 Scores (JSONB)
  big5_scores JSONB NOT NULL, -- { "openness": 75, "conscientiousness": 60, ... }
  
  -- MBTI Result (JSONB)
  mbti_scores JSONB NOT NULL, -- { "type": "ENFP", "confidence": {...}, "raw": {...} }
  
  -- RETI Result (JSONB)
  reti_scores JSONB NOT NULL, -- { "primaryType": "7", "secondaryType": "8", ... }
  
  -- Tribe (innate)
  tribe JSONB NOT NULL, -- { "type": "phoenix", "score": 75, "element": "fire" }
  
  -- Stone (acquired)
  stone JSONB NOT NULL, -- { "type": "ruby", "score": 80, "affinity": [...] }
  
  -- Hero (matching)
  hero JSONB NOT NULL, -- { "id": "phoenix-ruby", "name": "...", ... }
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Results 인덱스
CREATE INDEX idx_results_user_id ON results(user_id);
CREATE INDEX idx_results_assessment_id ON results(assessment_id);
CREATE INDEX idx_results_engine_version ON results(engine_version);
CREATE INDEX idx_results_created_at ON results(created_at DESC);

-- =====================================================
-- 3. Reports 테이블 (비동기 AI 리포트)
-- =====================================================
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  result_id UUID REFERENCES results(id) ON DELETE CASCADE,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'queued', -- 'queued' | 'running' | 'ready' | 'failed'
  
  -- Model info
  model_version TEXT, -- e.g., 'gpt-4o-mini'
  
  -- Report content
  summary_md TEXT, -- Markdown summary
  visual_data JSONB, -- Chart data, growth vectors, etc.
  
  -- Error info (if failed)
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reports 인덱스
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_result_id ON reports(result_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- =====================================================
-- 4. Payments 테이블 (플랜/결제)
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  
  -- Plan info
  plan_type TEXT NOT NULL DEFAULT 'free', -- 'free' | 'premium' | 'pro'
  
  -- Stripe/Toss info
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'inactive', -- 'active' | 'inactive' | 'cancelled'
  current_period_end TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments 인덱스
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_stripe_customer ON payments(stripe_customer_id);

-- =====================================================
-- 5. Triggers for updated_at
-- =====================================================
CREATE TRIGGER update_assessments_updated_at
  BEFORE UPDATE ON assessments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. Row Level Security (RLS) - Simplified for v1
-- =====================================================

-- Assessments RLS
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own assessments"
  ON assessments FOR SELECT
  USING (true); -- TODO: Add auth check when user_id becomes UUID

CREATE POLICY "Users can insert their own assessments"
  ON assessments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own assessments"
  ON assessments FOR UPDATE
  USING (true);

-- Results RLS
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own results"
  ON results FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own results"
  ON results FOR INSERT
  WITH CHECK (true);

-- Reports RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON reports FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own reports"
  ON reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own reports"
  ON reports FOR UPDATE
  USING (true);

-- Payments RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
  ON payments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own payments"
  ON payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update their own payments"
  ON payments FOR UPDATE
  USING (true);

-- =====================================================
-- 7. Comments
-- =====================================================
COMMENT ON TABLE assessments IS 'Raw assessment answers with idempotency (PR #3)';
COMMENT ON TABLE results IS 'Scored results snapshot with engine version (PR #3, #4.5)';
COMMENT ON TABLE reports IS 'Async AI-generated reports (queued/ready) (PR #5)';
COMMENT ON TABLE payments IS 'User subscription and payment tracking';

COMMENT ON COLUMN assessments.answers_hash IS 'SHA256 hash for idempotent submission';
COMMENT ON COLUMN assessments.draft IS 'True for auto-save drafts, false for final submission';
COMMENT ON COLUMN results.engine_version IS 'Engine version used for scoring (reproducibility)';
COMMENT ON COLUMN reports.status IS 'queued → running → ready | failed';

