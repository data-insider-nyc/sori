-- Add parent_id to comments for 1-level replies
ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES comments(id) ON DELETE CASCADE;

-- Index for fetching replies efficiently
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
