-- Drop unused duplicate display_name column from profiles.
-- The UI and queries use `nickname` as the display label.

ALTER TABLE profiles
  DROP COLUMN IF EXISTS display_name;

