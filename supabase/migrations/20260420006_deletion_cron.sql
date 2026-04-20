ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz DEFAULT now();

CREATE OR REPLACE FUNCTION delete_inactive_users() RETURNS void AS $$
DECLARE inactive_users uuid[];
BEGIN
  SELECT ARRAY(SELECT id FROM profiles WHERE last_login_at < NOW() - INTERVAL '60 days') INTO inactive_users;
  DELETE FROM tasks WHERE user_id = ANY(inactive_users);
  DELETE FROM messages WHERE user_id = ANY(inactive_users);
  DELETE FROM kpi_metrics WHERE user_id = ANY(inactive_users);
  DELETE FROM simulation_sessions WHERE user_id = ANY(inactive_users);
  DELETE FROM portfolio_entries WHERE user_id = ANY(inactive_users);
  DELETE FROM profiles WHERE id = ANY(inactive_users);
  DELETE FROM auth.users WHERE id = ANY(inactive_users);
END; $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule cron job only if pg_cron extension is available.
-- To enable: go to Supabase Dashboard > Database > Extensions > enable pg_cron, then run:
-- SELECT cron.schedule('delete-inactive-users','0 2 * * *','SELECT delete_inactive_users();');
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('delete-inactive-users','0 2 * * *','SELECT delete_inactive_users();');
  END IF;
END $$;
