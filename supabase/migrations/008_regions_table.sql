-- =============================================================================
-- Migration 008: Community regions table with sort order
--
-- Move regions from hardcoded const to database.
-- Allows admin to manage regions without code deployment.
-- Sorted by Korean population concentration.
-- =============================================================================

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

-- Seed initial regions (ordered by Korean population + others at end)
-- Use INSERT OR IGNORE to handle re-runs (idempotent)
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

-- ─── Enable RLS ──────────────────────────────────────────────────────────
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- ─── Drop existing policies (if re-running migration) ────────────────────
DROP POLICY IF EXISTS "regions_select_public" ON regions;
DROP POLICY IF EXISTS "regions_write_admin" ON regions;
DROP POLICY IF EXISTS "regions_update_admin" ON regions;
DROP POLICY IF EXISTS "regions_delete_admin" ON regions;

-- ─── Public read-only policy ──────────────────────────────────────────────
-- Anyone can read regions (for filtering, display)
CREATE POLICY "regions_select_public" ON regions
  FOR SELECT
  USING (true);

-- ─── Admin-only write policy ──────────────────────────────────────────────
-- Only admins can insert/update/delete (configured via is_admin role)
CREATE POLICY "regions_write_admin" ON regions
  FOR INSERT WITH CHECK (auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "regions_update_admin" ON regions
  FOR UPDATE USING (auth.jwt() ->> 'is_admin' = 'true');

CREATE POLICY "regions_delete_admin" ON regions
  FOR DELETE USING (auth.jwt() ->> 'is_admin' = 'true');

