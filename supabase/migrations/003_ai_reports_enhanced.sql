-- =====================================================
-- AI Reports 테이블 개선
-- =====================================================
-- model_version, visual_data 컬럼 추가

ALTER TABLE ai_reports ADD COLUMN IF NOT EXISTS model_version TEXT;
ALTER TABLE ai_reports ADD COLUMN IF NOT EXISTS visual_data JSONB;
ALTER TABLE ai_reports ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ready';

-- status 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_ai_reports_status ON ai_reports(status);

-- 코멘트 추가
COMMENT ON COLUMN ai_reports.model_version IS 'LLM 모델 버전 (e.g., gpt-4-turbo, claude-3-sonnet)';
COMMENT ON COLUMN ai_reports.visual_data IS '시각화 데이터 (차트, 섹션 정보 등)';
COMMENT ON COLUMN ai_reports.status IS '리포트 상태: queued, running, ready, failed';

