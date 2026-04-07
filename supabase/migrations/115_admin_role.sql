-- Add is_admin flag to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false NOT NULL;

-- Admin can delete any post
DROP POLICY IF EXISTS "admin_delete_post" ON posts;
CREATE POLICY "admin_delete_post" ON posts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );

-- Admin can delete any comment
DROP POLICY IF EXISTS "admin_delete_comment" ON comments;
CREATE POLICY "admin_delete_comment" ON comments
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.is_admin = true
    )
  );
