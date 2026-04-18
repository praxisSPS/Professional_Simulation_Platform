CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  career_path text NOT NULL,
  name text NOT NULL,
  description text,
  start_day integer DEFAULT 1,
  end_day integer DEFAULT 26,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS project_ref text;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS kpi_tag text;
