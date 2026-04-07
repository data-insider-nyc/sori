-- Migration 119: Move regions from DB table to code-only
--
-- Converts posts.region_id (INTEGER FK) → posts.region (TEXT)
-- Converts profiles.location_id (INTEGER FK) → profiles.location (TEXT)
-- Drops the regions table entirely.
-- Regions are now a static enum in lib/regions.ts (no DB roundtrip needed).
-- Valid values enforced via CHECK constraint.
-- Fully idempotent — safe to run even if already partially applied.

-- ─── Step 1: Add new TEXT columns (if not already there) ─────────────────────

ALTER TABLE posts    ADD COLUMN IF NOT EXISTS region   TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location TEXT;

-- ─── Step 2: Populate from region_id / location_id (if those columns exist) ──

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'region_id'
  ) THEN
    UPDATE posts SET region = CASE region_id
      WHEN 1  THEN 'nyc'
      WHEN 2  THEN 'la'
      WHEN 3  THEN 'sf'
      WHEN 4  THEN 'chicago'
      WHEN 5  THEN 'boston'
      WHEN 6  THEN 'atlanta'
      WHEN 7  THEN 'dallas'
      WHEN 8  THEN 'dc'
      WHEN 9  THEN 'austin'
      WHEN 10 THEN 'houston'
      WHEN 11 THEN 'seattle'
      WHEN 12 THEN 'other'
      ELSE 'other'
    END
    WHERE region_id IS NOT NULL AND region IS NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location_id'
  ) THEN
    UPDATE profiles SET location = CASE location_id
      WHEN 1  THEN 'nyc'
      WHEN 2  THEN 'la'
      WHEN 3  THEN 'sf'
      WHEN 4  THEN 'chicago'
      WHEN 5  THEN 'boston'
      WHEN 6  THEN 'atlanta'
      WHEN 7  THEN 'dallas'
      WHEN 8  THEN 'dc'
      WHEN 9  THEN 'austin'
      WHEN 10 THEN 'houston'
      WHEN 11 THEN 'seattle'
      WHEN 12 THEN 'other'
      ELSE 'other'
    END
    WHERE location_id IS NOT NULL AND location IS NULL;
  END IF;
END $$;

-- ─── Step 3: Drop old FK columns ─────────────────────────────────────────────

ALTER TABLE posts    DROP COLUMN IF EXISTS region_id;
ALTER TABLE profiles DROP COLUMN IF EXISTS location_id;

-- ─── Step 4: Drop regions table ──────────────────────────────────────────────

DROP POLICY IF EXISTS "regions_select_public" ON regions;
DROP POLICY IF EXISTS "regions_write_admin"   ON regions;
DROP POLICY IF EXISTS "regions_update_admin"  ON regions;
DROP POLICY IF EXISTS "regions_delete_admin"  ON regions;
DROP TABLE IF EXISTS regions;

-- ─── Step 5: Remap removed regions (houston, austin → other) ─────────────────

UPDATE posts    SET region   = 'other' WHERE region   IN ('houston', 'austin');
UPDATE profiles SET location = 'other' WHERE location IN ('houston', 'austin');

-- ─── Step 6: CHECK constraint on posts.region ────────────────────────────────

ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_region_check;
ALTER TABLE posts ADD CONSTRAINT posts_region_check
  CHECK (region IS NULL OR region IN (
    'nyc','la','sf','chicago','dc','seattle','boston','atlanta','dallas','other'
  ));
