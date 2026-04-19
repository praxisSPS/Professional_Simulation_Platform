-- Submission method fields
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_type text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_url text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS submission_file_path text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tool_used text;
