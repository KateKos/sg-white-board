CREATE TABLE sticky_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  group_id uuid REFERENCES groups(id) ON DELETE SET NULL,
  content text NOT NULL DEFAULT '',
  color text NOT NULL DEFAULT 'yellow',
  x integer NOT NULL DEFAULT 0,
  y integer NOT NULL DEFAULT 0,
  width integer NOT NULL DEFAULT 200,
  height integer NOT NULL DEFAULT 180,
  rotation real DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE sticky_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_sticky_notes" ON sticky_notes FOR SELECT USING (true);
CREATE POLICY "public_insert_sticky_notes" ON sticky_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_sticky_notes" ON sticky_notes FOR UPDATE USING (true);
CREATE POLICY "public_delete_sticky_notes" ON sticky_notes FOR DELETE USING (true);

ALTER PUBLICATION supabase_realtime ADD TABLE sticky_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE groups;