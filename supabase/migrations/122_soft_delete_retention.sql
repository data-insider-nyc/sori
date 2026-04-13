-- Purge helper for soft-deleted community data.
-- Call manually or via scheduler (e.g., pg_cron) when ready.

BEGIN;

CREATE OR REPLACE FUNCTION purge_soft_deleted_community(retention_days integer DEFAULT 45)
RETURNS TABLE (purged_posts integer, purged_comments integer)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  cutoff timestamptz := now() - make_interval(days => retention_days);
  deleted_comments integer := 0;
  deleted_posts integer := 0;
BEGIN
  -- Delete comments first to keep counts deterministic even without relying on FK cascade order.
  DELETE FROM comments
  WHERE deleted_at IS NOT NULL
    AND deleted_at < cutoff;
  GET DIAGNOSTICS deleted_comments = ROW_COUNT;

  -- Deleting posts cascades related post_likes via FK.
  DELETE FROM posts
  WHERE deleted_at IS NOT NULL
    AND deleted_at < cutoff;
  GET DIAGNOSTICS deleted_posts = ROW_COUNT;

  RETURN QUERY SELECT deleted_posts, deleted_comments;
END;
$$;

COMMENT ON FUNCTION purge_soft_deleted_community (integer) IS 'Hard-deletes soft-deleted posts/comments older than retention_days.';

COMMIT;