-- =============================================================================
-- Migration 009: Normalize regions to INTEGER PK + add critical FKs & indexes
--
-- Changes from TEXT PK to INTEGER PK for efficiency and proper normalization.
-- This migration:
-- 1. Adds region_id column (INTEGER) to posts, migrates data from TEXT region
-- 2. Adds location_id column (INTEGER) to profiles, migrates data from TEXT location
-- 3. Removes legacy TEXT columns and default_region
-- 4. Adds performance indexes
-- 5. Fully idempotent - safe to re-run
-- =============================================================================

-- ─── FIX 1: Add region_id column to posts (INTEGER FK, if not exists) ──────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS region_id INTEGER REFERENCES regions(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- Migrate data: posts.region (TEXT) → posts.region_id (INTEGER)
-- Only if posts.region column still exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'region'
  ) THEN
    EXECUTE 'UPDATE posts SET region_id = (
      SELECT id FROM regions WHERE regions.value = posts.region
    ) WHERE region IS NOT NULL AND region_id IS NULL';
    
    -- Now drop the old column
    ALTER TABLE posts DROP COLUMN region;
  END IF;
END $$;

-- ─── FIX 2: Add location_id column to profiles (INTEGER FK, if not exists) ──────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS location_id INTEGER;

-- Migrate data: profiles.location (TEXT) → profiles.location_id (INTEGER)
-- Only if profiles.location column still exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    EXECUTE 'UPDATE profiles SET location_id = (
      SELECT id FROM regions WHERE regions.value = profiles.location
    ) WHERE location IS NOT NULL AND location_id IS NULL';
    
    -- Now drop the old column
    ALTER TABLE profiles DROP COLUMN location;
  END IF;
END $$;

-- Set default to 'other' region (id=12) for any NULL location_id
UPDATE profiles SET location_id = 12 WHERE location_id IS NULL;

-- Make location_id NOT NULL with FK constraint (if not already)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_name = 'profiles'
    AND constraint_name = 'fk_profiles_location_id'
  ) THEN
    ALTER TABLE profiles
      ALTER COLUMN location_id SET NOT NULL,
      ALTER COLUMN location_id SET DEFAULT 12,
      ADD CONSTRAINT fk_profiles_location_id
      FOREIGN KEY (location_id)
      REFERENCES regions(id) ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END $$;

-- ─── FIX 3: Remove legacy posts.location field (if exists) ────────────────
ALTER TABLE posts
  DROP COLUMN IF EXISTS location;

-- ─── FIX 4: Add performance indexes on foreign keys ──────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_region_id 
  ON posts(region_id);

CREATE INDEX IF NOT EXISTS idx_posts_user_id 
  ON posts(user_id);

CREATE INDEX IF NOT EXISTS idx_comments_user_id 
  ON comments(user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id 
  ON reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_location_id 
  ON profiles(location_id);

-- ─── FIX 5: Add index on profiles.handle for @mention lookups ────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle 
  ON profiles(handle) WHERE handle IS NOT NULL;

-- ─── FIX 6: Remove legacy default_region from profiles ─────────────────────
ALTER TABLE profiles
  DROP COLUMN IF EXISTS default_region;
