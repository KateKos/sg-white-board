CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  label text NOT NULL DEFAULT '',
  x integer NOT NULL DEFAULT 0,
  y integer NOT NULL DEFAULT 0,
  width integer NOT NULL DEFAULT 300,
  height integer NOT NULL DEFAULT 200,
  color text DEFAULT 'yellow',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_groups" ON groups FOR SELECT USING (true);
CREATE POLICY "public_insert_groups" ON groups FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_groups" ON groups FOR UPDATE USING (true);
CREATE POLICY "public_delete_groups" ON groups FOR DELETE USING (true);