-- ============================================================================
-- Sori App - Supabase Migrations (CLEAN RUN - FINAL)
-- 
-- Copy entire content and paste into Supabase Dashboard → SQL Editor → Run
-- ============================================================================

-- ============================================================================
-- Migration 008: Community regions table (sorted by Korean population)
-- ============================================================================
CREATE TABLE IF NOT EXISTS regions (
    value       TEXT PRIMARY KEY,
    label       TEXT NOT NULL,
    emoji       TEXT NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 999,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Seed initial regions (ordered by Korean population + others at end)
-- IF THIS FAILS WITH "duplicate key", skip to Migration 009
INSERT INTO regions (value, label, emoji, sort_order) VALUES
    ('nyc',      'NYC Metro (NY / NJ)',          '🗽', 1),
    ('la',       'Los Angeles',                  '🌴', 2),
    ('sf',       'San Francisco Bay Area',       '🌉', 3),
    ('chicago',  'Chicago',                      '🏙️', 4),
    ('boston',   'Boston',                       '🎓', 5),
    ('atlanta',  'Atlanta',                      '🍑', 6),
    ('dallas',   'Dallas / Fort Worth',          '⭐', 7),
    ('dc',       'Washington DC',                '🏛️', 8),
    ('austin',   'Austin',                       '🎸', 9),
    ('houston',  'Houston',                      '🤠', 10),
    ('seattle',  'Seattle',                      '🏔️', 11),
    ('other',    'Others',                       '🌍', 999)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Migration 009: Fix regions consistency + add critical FKs & indexes
-- ============================================================================

-- FIX 1: Add FK constraint on posts.region (data integrity)
ALTER TABLE posts
  ADD CONSTRAINT fk_posts_region
  FOREIGN KEY (region)
  REFERENCES regions(value)
  ON UPDATE CASCADE
  ON DELETE SET NULL;

-- FIX 2: Remove legacy posts.location field
ALTER TABLE posts
  DROP COLUMN IF EXISTS location;

-- FIX 3: Add performance indexes on foreign keys
CREATE INDEX IF NOT EXISTS idx_posts_user_id 
  ON posts(user_id);

CREATE INDEX IF NOT EXISTS idx_comments_user_id 
  ON comments(user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id 
  ON reviews(user_id);

-- FIX 4: Add index on profiles.handle for @mention lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle 
  ON profiles(handle) WHERE handle IS NOT NULL;

-- FIX 5: Ensure profiles.location always has valid FK
UPDATE profiles 
SET location = 'other' 
WHERE location IS NOT NULL 
  AND location NOT IN (SELECT value FROM regions);

UPDATE profiles SET location = 'other' WHERE location IS NULL;

ALTER TABLE profiles
  ALTER COLUMN location SET NOT NULL,
  ALTER COLUMN location SET DEFAULT 'other';

-- Add FK constraint if not already added
ALTER TABLE profiles
  ADD CONSTRAINT fk_profiles_location
  FOREIGN KEY (location)
  REFERENCES regions(value)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;

-- FIX 6: Remove legacy default_region from profiles
ALTER TABLE profiles
  DROP COLUMN IF EXISTS default_region;


