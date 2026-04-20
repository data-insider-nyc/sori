-- Add location_changed_at to track 90-day cooldown on location changes.
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS location_changed_at TIMESTAMPTZ;
