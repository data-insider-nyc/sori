-- Add handle and display_name to profiles
-- handle: unique @username, lowercase letters/numbers/underscores only
-- display_name: the "nickname" shown in the UI (was previously nickname)
-- handle_changed_at: tracks 90-day cooldown on handle changes

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS display_name        TEXT,
  ADD COLUMN IF NOT EXISTS handle              TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS handle_changed_at   TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle ON profiles(handle);
