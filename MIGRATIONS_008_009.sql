-- =============================================================================
-- Consolidated Migrations 008-009: Regions system (PRODUCTION)
--
-- Safe for all environments - creates regions table and normalizes schema
-- Does NOT include test data
-- =============================================================================

-- Migration 008: Community regions table
CREATE TABLE IF NOT EXISTS regions (
    id          INTEGER PRIMARY KEY,
    value       TEXT UNIQUE NOT NULL,
    label       TEXT NOT NULL,
    emoji       TEXT NOT NULL,
    status      TEXT NOT NULL DEFAULT 'soon',
    sort_order  INTEGER NOT NULL DEFAULT 999,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO regions (id, value, label, emoji, status, sort_order) VALUES
    (1,  'nyc',      'NYC Metro (NY / NJ)',          '🗽', 'open',  1),
    (2,  'la',       'Los Angeles',                  '🌴', 'soon',  2),
    (3,  'sf',       'San Francisco Bay Area',       '🌉', 'soon',  3),
    (4,  'chicago',  'Chicago',                      '🏙️', 'soon',  4),
    (5,  'boston',   'Boston',                       '🎓', 'soon',  5),
    (6,  'atlanta',  'Atlanta',                      '🍑', 'soon',  6),
    (7,  'dallas',   'Dallas / Fort Worth',          '⭐', 'soon',  7),
    (8,  'dc',       'Washington DC',                '🏛️', 'soon',  8),
    (9,  'austin',   'Austin',                       '🎸', 'soon',  9),
    (10, 'houston',  'Houston',                      '🤠', 'soon', 10),
    (11, 'seattle',  'Seattle',                      '🏔️', 'soon', 11),
    (12, 'other',    'Others',                       '🌍', 'open', 999)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "regions_select_public" ON regions;
DROP POLICY IF EXISTS "regions_write_admin" ON regions;
DROP POLICY IF EXISTS "regions_update_admin" ON regions;
DROP POLICY IF EXISTS "regions_delete_admin" ON regions;

CREATE POLICY "regions_select_public" ON regions
  FOR SELECT
  USING (true);

CREATE POLICY "regions_write_admin" ON regions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "regions_update_admin" ON regions
  FOR UPDATE USING (auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "regions_delete_admin" ON regions
  FOR DELETE USING (auth.jwt() ->> 'is_admin' = 'true');

-- Migration 009: Normalize schema
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS region_id INTEGER REFERENCES regions(id) ON UPDATE CASCADE ON DELETE SET NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'region'
  ) THEN
    EXECUTE 'UPDATE posts SET region_id = (
      SELECT id FROM regions WHERE regions.value = posts.region
    ) WHERE region IS NOT NULL AND region_id IS NULL';
    
    ALTER TABLE posts DROP COLUMN region;
  END IF;
END $$;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS location_id INTEGER;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    EXECUTE 'UPDATE profiles SET location_id = (
      SELECT id FROM regions WHERE regions.value = profiles.location
    ) WHERE location IS NOT NULL AND location_id IS NULL';
    
    ALTER TABLE profiles DROP COLUMN location;
  END IF;
END $$;

UPDATE profiles SET location_id = 12 WHERE location_id IS NULL;

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

ALTER TABLE posts DROP COLUMN IF EXISTS location;
ALTER TABLE profiles DROP COLUMN IF EXISTS default_region;

CREATE INDEX IF NOT EXISTS idx_posts_region_id ON posts(region_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_location_id ON profiles(location_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle) WHERE handle IS NOT NULL;
