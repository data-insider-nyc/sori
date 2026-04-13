-- Fix comment count trigger: SECURITY DEFINER + soft-delete support + backfill
--
-- Root cause: trigger ran as SECURITY INVOKER (authenticated user), who is blocked
-- by the `own_post` RLS policy from updating another user's post.comment_count.
-- Result: comment counts silently stayed 0 on posts the commenter doesn't own.

-- Fix 1: Rebuild function as SECURITY DEFINER (runs as postgres, bypasses RLS)
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  ELSIF TG_OP = 'UPDATE' THEN
    -- Soft-delete: decrement when deleted_at flips NULL → timestamp
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
      UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = NEW.post_id;
    -- Soft-undelete: increment when deleted_at flips timestamp → NULL
    ELSIF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
      UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

-- Fix 2: Add UPDATE trigger to handle soft-deletes
DROP TRIGGER IF EXISTS trg_post_comment_count_update ON comments;

CREATE TRIGGER trg_post_comment_count_update
  AFTER UPDATE OF deleted_at ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

-- Fix 3: Backfill any posts whose comment_count drifted due to the old bug
UPDATE posts
SET
    comment_count = (
        SELECT COUNT(*)
        FROM comments
        WHERE
            comments.post_id = posts.id
            AND comments.deleted_at IS NULL
    )
WHERE
    id IN (
        SELECT p.id
        FROM posts p
        WHERE (
                SELECT COUNT(*)
                FROM comments c
                WHERE
                    c.post_id = p.id
                    AND c.deleted_at IS NULL
            ) != p.comment_count
    );