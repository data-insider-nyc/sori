-- =============================================================================
-- Migration 007: Metro area location support
--
-- Expands profile.location from city names to metro area values.
-- New metro areas: nyc-metro, la-metro, sf-metro, chicago-metro, dallas-metro, 
-- atlanta-metro, dc-metro, philly-metro, seattle-metro, other
--
-- Set default location to 'other' for existing null profiles.
-- =============================================================================

UPDATE profiles SET location = 'other' WHERE location IS NULL;

ALTER TABLE profiles
  ALTER COLUMN location SET DEFAULT 'other';
