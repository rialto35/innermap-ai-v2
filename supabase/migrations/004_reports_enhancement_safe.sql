-- InnerMap AI v2 - Reports Enhancement (Safe/Idempotent Version)
-- PR #5.1 - 기존 컬럼과 충돌하지 않는 안전한 마이그레이션
-- Created: 2025-10-17
-- 
-- 이 스크립트는 여러 번 실행해도 안전합니다 (멱등성)

BEGIN;

-- =====================================================
-- 1. Add columns (IF NOT EXISTS)
-- =====================================================

ALTER TABLE reports ADD COLUMN IF NOT EXISTS status TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS summary_md TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS visuals_json JSONB;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS error_msg TEXT;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
ALTER TABLE reports ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ;

-- =====================================================
-- 2. Set defaults and update existing rows
-- =====================================================

-- Set default for status
ALTER TABLE reports ALTER COLUMN status SET DEFAULT 'queued';

-- Update NULL status to 'queued'
UPDATE reports SET status = 'queued' WHERE status IS NULL;

-- Set default for visuals_json
ALTER TABLE reports ALTER COLUMN visuals_json SET DEFAULT '{}'::JSONB;

-- Update NULL visuals_json to empty object
UPDATE reports SET visuals_json = '{}'::JSONB WHERE visuals_json IS NULL;

-- =====================================================
-- 3. Create indexes (IF NOT EXISTS)
-- =====================================================

-- Index for status-based queries (queue processing)
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);

-- Composite index for status + created_at (better for queue)
CREATE INDEX IF NOT EXISTS idx_reports_status_created 
  ON reports(status, created_at DESC);

-- Index for failed reports (retry)
CREATE INDEX IF NOT EXISTS idx_reports_failed 
  ON reports(status, created_at DESC) 
  WHERE status = 'failed';

-- =====================================================
-- 4. Add constraints (only if not already exists)
-- =====================================================

-- Validate status values (drop and recreate for idempotency)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_reports_status'
  ) THEN
    ALTER TABLE reports DROP CONSTRAINT check_reports_status;
  END IF;
END $$;

ALTER TABLE reports
  ADD CONSTRAINT check_reports_status 
  CHECK (status IN ('queued', 'processing', 'ready', 'failed'));

-- Ensure finished_at is after started_at
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'check_reports_timestamps'
  ) THEN
    ALTER TABLE reports DROP CONSTRAINT check_reports_timestamps;
  END IF;
END $$;

ALTER TABLE reports
  ADD CONSTRAINT check_reports_timestamps
  CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at);

-- =====================================================
-- 5. Update comments
-- =====================================================

COMMENT ON COLUMN reports.status IS 'Report generation status: queued → processing → ready | failed';
COMMENT ON COLUMN reports.summary_md IS 'LLM-generated narrative report in Markdown format';
COMMENT ON COLUMN reports.visuals_json IS 'Metadata for visualization (growth vectors, auxiliary profiles)';
COMMENT ON COLUMN reports.error_msg IS 'Error message if generation failed';
COMMENT ON COLUMN reports.started_at IS 'Timestamp when LLM processing started';
COMMENT ON COLUMN reports.finished_at IS 'Timestamp when processing completed';

-- =====================================================
-- 6. Helper function for queue processing
-- =====================================================

CREATE OR REPLACE FUNCTION get_next_queued_report()
RETURNS TABLE (
  report_id UUID,
  result_id UUID,
  user_id TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    id as report_id,
    reports.result_id,
    reports.user_id,
    reports.created_at
  FROM reports
  WHERE status = 'queued'
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED; -- Prevent concurrent processing
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_next_queued_report IS 'Safely fetch next queued report for processing (with row lock)';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_next_queued_report TO authenticated;
GRANT EXECUTE ON FUNCTION get_next_queued_report TO service_role;

COMMIT;

-- =====================================================
-- Success message
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Reports enhancement migration completed successfully!';
  RAISE NOTICE '📊 Run this query to verify:';
  RAISE NOTICE '   SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = ''reports'';';
END $$;

