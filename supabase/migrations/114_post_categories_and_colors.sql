-- Migration 114: post categories
-- Categories are fully managed in code (lib/post-categories.ts).
-- No DB table needed — icons, labels, and order live in code as a static enum.
-- A CHECK constraint on posts.category enforces valid values at the DB level.
-- When adding a new category: update lib/post-categories.ts + run a migration
-- to update the CHECK constraint below.

-- Drop legacy post_categories table if it still exists
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_fkey;
DROP TABLE IF EXISTS post_categories;

-- Migrate old category values to new ones
UPDATE posts SET category = CASE
  WHEN category = 'hospital'    THEN 'health'
  WHEN category = 'restaurant'  THEN 'food'
  WHEN category = 'kids'        THEN 'family'
  WHEN category = 'realestate'  THEN 'housing'
  WHEN category = 'classifieds' THEN 'market'
  WHEN category = 'visa'        THEN 'immigration'
  ELSE category
END
WHERE category IN ('hospital', 'restaurant', 'kids', 'realestate', 'classifieds', 'visa');

-- Reset any unrecognized categories to 'general'
UPDATE posts
SET category = 'general'
WHERE category NOT IN ('general','food','local','jobs','housing','family','market','immigration','health');

-- Enforce valid categories at DB level
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_category_check;
ALTER TABLE posts
  ADD CONSTRAINT posts_category_check
  CHECK (category IN ('general','food','local','jobs','housing','family','market','immigration','health'));
