ALTER TABLE tasks ADD COLUMN IF NOT EXISTS artefact_type text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS artefact_content text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS artefact_title text;
