-- Add nickname_changed_at to track 14-day cooldown on nickname changes.
-- NULL means the nickname has never been manually changed (initial setup).
-- Cooldown rule: a user can only change their nickname once every 14 days.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS nickname_changed_at TIMESTAMPTZ;
