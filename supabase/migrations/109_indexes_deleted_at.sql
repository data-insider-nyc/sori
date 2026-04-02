-- Add indexes to speed up queries that filter out soft-deleted rows
BEGIN;

CREATE INDEX IF NOT EXISTS idx_posts_deleted_at ON posts(deleted_at);
CREATE INDEX IF NOT EXISTS idx_comments_deleted_at ON comments(deleted_at);
CREATE INDEX IF NOT EXISTS idx_comments_post_deleted_at ON comments(post_id, deleted_at);

COMMIT;
