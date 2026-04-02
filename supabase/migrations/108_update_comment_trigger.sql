-- Recreate update_post_comment_count to consider soft-deleted comments
BEGIN;

CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE posts SET comment_count = (
    SELECT COUNT(*) FROM comments WHERE post_id = COALESCE(NEW.post_id, OLD.post_id) AND deleted_at IS NULL
  )
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_comment_count ON comments;
CREATE TRIGGER trg_post_comment_count
AFTER INSERT OR UPDATE OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

COMMIT;
