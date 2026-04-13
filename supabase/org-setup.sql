-- Step 1: Add new columns to organisations table
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS sector_code integer DEFAULT 2;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS org_number integer DEFAULT 1;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS member_count integer DEFAULT 0;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS access_code text UNIQUE;
ALTER TABLE organisations ADD COLUMN IF NOT EXISTS sector_name text DEFAULT 'Corporate';

-- Step 2: Add new columns to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS member_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS customer_type text DEFAULT 'individual';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unique_user_id text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assessment_score integer DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS assessment_suggested_level integer;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS self_selected_seniority text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_complete boolean DEFAULT false;

-- Step 3: Check what columns exist in organisations
-- (Run this first to see the type column values needed)
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'organisations';

-- Step 4: Seed organisations
-- We include 'type' column to satisfy the not-null constraint
INSERT INTO organisations (id, name, type, industry, size, access_code, sector_code, org_number, sector_name)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'Nexus Digital',       'employer',    'Technology',   'startup', 'NEXUS-2026', 2, 1, 'Corporate'),
  ('00000000-0000-0000-0000-000000000002', 'GlobalBank Advisory', 'employer',    'Finance',      'large',   'GBANK-2026', 2, 2, 'Corporate'),
  ('00000000-0000-0000-0000-000000000003', 'Meridian FMCG',       'employer',    'Manufacturing','large',   'MERID-2026', 2, 3, 'Corporate'),
  ('00000000-0000-0000-0000-000000000004', 'Pally University',    'university',  'Education',    'large',   'PALLY-2026', 1, 1, 'University'),
  ('00000000-0000-0000-0000-000000000005', 'Hully University',    'university',  'Education',    'large',   'HULLY-2026', 1, 2, 'University'),
  ('00000000-0000-0000-0000-000000000006', 'Reed Recruitment',    'recruiter',   'Recruitment',  'large',   'REED-2026',  3, 1, 'Recruitment')
ON CONFLICT (id) DO UPDATE SET
  access_code  = EXCLUDED.access_code,
  sector_code  = EXCLUDED.sector_code,
  org_number   = EXCLUDED.org_number,
  sector_name  = EXCLUDED.sector_name,
  type         = EXCLUDED.type;

-- Step 5: Create the member ID generator function
CREATE OR REPLACE FUNCTION generate_praxis_member_id(p_org_id uuid)
RETURNS text AS $$
DECLARE
  v_sector  integer;
  v_org     integer;
  v_serial  integer;
BEGIN
  SELECT sector_code, org_number, member_count + 1
  INTO v_sector, v_org, v_serial
  FROM organisations WHERE id = p_org_id;

  UPDATE organisations SET member_count = member_count + 1 WHERE id = p_org_id;

  -- e.g. sector=1, org=1, serial=3 → '1' || '01' || '0003' = '1010003'
  RETURN v_sector::text
      || lpad(v_org::text, 2, '0')
      || lpad(v_serial::text, 4, '0');
END;
$$ LANGUAGE plpgsql;
