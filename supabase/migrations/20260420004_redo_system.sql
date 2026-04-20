-- Redo task flag
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS is_redo boolean DEFAULT false;

-- Message type column (coaching, feedback, colleague, system)
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type text;
