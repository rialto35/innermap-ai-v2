-- Fix reports foreign key to reference test_results instead of results
-- Issue: reports.result_id references results(id), but we're using test_results

BEGIN;

-- Drop old foreign key constraint
ALTER TABLE reports 
  DROP CONSTRAINT IF EXISTS reports_result_id_fkey;

-- Add new foreign key to test_results
ALTER TABLE reports
  ADD CONSTRAINT reports_result_id_fkey 
  FOREIGN KEY (result_id) 
  REFERENCES test_results(id) 
  ON DELETE CASCADE;

COMMIT;

