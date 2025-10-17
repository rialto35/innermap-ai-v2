-- InnerMap AI v2 - Reports Enhancement for Async LLM Generation
-- PR #5.1 - Add status tracking, narrative content, and visual metadata
-- Created: 2025-10-17

-- =====================================================
-- 1. Extend Reports Table
-- =====================================================

-- Add new columns for async report generation
ALTER TABLE reports
  -- Status tracking
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'queued',  
    -- 'queued' | 'processing' | 'ready' | 'failed'
  
  -- LLM narrative content
  ADD COLUMN IF NOT EXISTS summary_md TEXT,
    -- Markdown-formatted narrative report from LLM
  
  -- Visual metadata for charts/graphs
  ADD COLUMN IF NOT EXISTS visuals_json JSONB DEFAULT '{}'::JSONB,
    -- { "growthVector": {...}, "auxProfile": {...} }
  
  -- Error tracking
  ADD COLUMN IF NOT EXISTS error_msg TEXT,
    -- Error message if status = 'failed'
  
  -- Timestamps for processing lifecycle
  ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
    -- When processing began
  ADD COLUMN IF NOT EXISTS finished_at TIMESTAMPTZ;
    -- When processing completed (ready or failed)

-- =====================================================
-- 2. Indexes for Performance
-- =====================================================

-- Index for status-based queries (queue processing)
CREATE INDEX IF NOT EXISTS idx_reports_status_created 
  ON reports(status, created_at DESC);

-- Index for failed report retry
CREATE INDEX IF NOT EXISTS idx_reports_failed 
  ON reports(status, created_at DESC) 
  WHERE status = 'failed';

-- =====================================================
-- 3. Check Constraints for Data Integrity
-- =====================================================

-- Validate status values
ALTER TABLE reports
  ADD CONSTRAINT check_reports_status 
  CHECK (status IN ('queued', 'processing', 'ready', 'failed'));

-- Ensure finished_at is after started_at
ALTER TABLE reports
  ADD CONSTRAINT check_reports_timestamps
  CHECK (finished_at IS NULL OR started_at IS NULL OR finished_at >= started_at);

-- =====================================================
-- 4. Update Existing Records
-- =====================================================

-- Set default status for existing reports
UPDATE reports 
SET status = 'ready'
WHERE status IS NULL OR status = '';

-- =====================================================
-- 5. Comments for Documentation
-- =====================================================

COMMENT ON COLUMN reports.status IS 'Report generation status: queued → processing → ready | failed';
COMMENT ON COLUMN reports.summary_md IS 'LLM-generated narrative report in Markdown format';
COMMENT ON COLUMN reports.visuals_json IS 'Metadata for visualization (growth vectors, auxiliary profiles)';
COMMENT ON COLUMN reports.error_msg IS 'Error message if generation failed';
COMMENT ON COLUMN reports.started_at IS 'Timestamp when LLM processing started';
COMMENT ON COLUMN reports.finished_at IS 'Timestamp when processing completed';

-- =====================================================
-- 6. Function for Report Queue Processing
-- =====================================================

-- Helper function to fetch next queued report (for edge function)
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

-- =====================================================
-- 7. Grant Permissions
-- =====================================================

-- Grant execute permission to authenticated users
-- (Edge function will use service role key)
GRANT EXECUTE ON FUNCTION get_next_queued_report TO authenticated;


