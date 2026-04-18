ALTER TABLE portfolio_entries ADD COLUMN IF NOT EXISTS entry_type text DEFAULT 'competency_evidence';
ALTER TABLE portfolio_entries ADD COLUMN IF NOT EXISTS evidence text;
ALTER TABLE portfolio_entries ADD COLUMN IF NOT EXISTS competency_tags text[];
ALTER TABLE portfolio_entries ADD COLUMN IF NOT EXISTS score integer;
ALTER TABLE portfolio_entries ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true;
