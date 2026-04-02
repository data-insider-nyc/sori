-- Add soft-delete columns for posts and comments
BEGIN;

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS deleted_at timestamptz DEFAULT NULL;

COMMIT;
