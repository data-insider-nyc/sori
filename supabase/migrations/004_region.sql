-- =============================================================================
-- Migration 004: Community region support
--
-- posts.region = NULL  → global/nationwide post (자유게시판, 비자, 취업 등)
-- posts.region = 'nyc' → scoped to NY/NJ metro only
-- Supported region values: nyc | la | chicago | dallas
-- =============================================================================

ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS region TEXT DEFAULT NULL;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS default_region TEXT DEFAULT 'nyc';

CREATE INDEX IF NOT EXISTS idx_posts_region ON posts(region);
