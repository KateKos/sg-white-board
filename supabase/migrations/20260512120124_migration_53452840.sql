CREATE TABLE boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Untitled Board',
  slug text NOT NULL UNIQUE DEFAULT generate_board_slug(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_boards" ON boards FOR SELECT USING (true);
CREATE POLICY "public_insert_boards" ON boards FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_boards" ON boards FOR UPDATE USING (true);
CREATE POLICY "public_delete_boards" ON boards FOR DELETE USING (true);