-- =============================================================================
-- Migration 118: Community feed performance indexes
--
-- Fixes:
-- 1. idx_posts_region_category_created (migration 106) was on the old `region`
--    TEXT column that was dropped in migration 112. Replaces it with a composite
--    index on the new region_id INTEGER column.
-- 2. Partial indexes filter deleted_at IS NULL upfront so the planner scans
--    fewer rows on every feed query (all feed queries use this condition via RLS).
-- 3. pg_trgm trigram index enables fast ilike '%q%' title search without a
--    full table scan. The existing GIN tsvector index (migration 106) only
--    works with tsquery operators, not ILIKE.
-- =============================================================================

BEGIN;

-- ─── Composite feed index: region_id + category + created_at ─────────────────
-- Covers the most filtered query pattern (region + category tab selected).
-- Partial: excludes soft-deleted rows, matching the public_read_posts RLS policy.
CREATE INDEX IF NOT EXISTS idx_posts_region_id_category_created
  ON posts (region_id, category, created_at DESC)
  WHERE deleted_at IS NULL;

-- ─── Category-only feed index ──────────────────────────────────────────────────
-- Covers category tab selected, no region filter.
CREATE INDEX IF NOT EXISTS idx_posts_category_created
  ON posts (category, created_at DESC)
  WHERE deleted_at IS NULL;

-- ─── Unfiltered feed index ─────────────────────────────────────────────────────
-- Covers "전체 지역 / 전체 토픽" — the default view with no filters.
-- Replaces the non-partial idx_posts_created_at from migration 106.
CREATE INDEX IF NOT EXISTS idx_posts_created_active
  ON posts (created_at DESC)
  WHERE deleted_at IS NULL;

-- ─── Trigram index for fast ilike '%q%' title search ─────────────────────────
-- The tsvector GIN index in migration 106 only works with @@ / tsquery.
-- pg_trgm's gin_trgm_ops index is what makes ILIKE '%term%' fast.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_posts_title_trgm
  ON posts USING gin (title gin_trgm_ops)
  WHERE deleted_at IS NULL;

COMMIT;
