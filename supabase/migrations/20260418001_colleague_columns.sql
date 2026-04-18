ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_message_id uuid REFERENCES messages(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS feedback_for_task_id uuid REFERENCES tasks(id);
ALTER TABLE messages ADD COLUMN IF NOT EXISTS message_type text DEFAULT 'action';
