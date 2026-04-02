-- Update public read policies to hide soft-deleted rows
BEGIN;

DROP POLICY IF EXISTS "public_read_posts" ON posts;
CREATE POLICY "public_read_posts" ON posts FOR SELECT USING (deleted_at IS NULL);

DROP POLICY IF EXISTS "public_read_comments" ON comments;
CREATE POLICY "public_read_comments" ON comments FOR SELECT USING (deleted_at IS NULL);

COMMIT;
