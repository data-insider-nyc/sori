-- Migration 011: post_categories table + FK to posts
-- Colors and icons are managed in code (lib/colors.ts, lib/post-categories.ts), NOT in DB.
-- Safe to re-run (idempotent)

-- ── Create post_categories table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_categories (
    id SERIAL PRIMARY KEY,
    value TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0
);

-- Drop legacy emoji column if it exists (icons moved to code)
ALTER TABLE post_categories DROP COLUMN IF EXISTS emoji;

INSERT INTO
    post_categories (
        value,
        label,
        sort_order
    )
VALUES ('general', '자유', 1),
    ('food', '맛집', 2),
    ('local', '생활', 3),
    ('jobs', '커리어', 4),
    ('housing', '부동산', 5),
    ('family', '육아', 6),
    ('market', '중고', 7),
    ('immigration', '비자', 8),
    ('health', '병원', 9)
ON CONFLICT (value) DO
UPDATE
SET
    label = EXCLUDED.label,
    sort_order = EXCLUDED.sort_order;

-- ── FK: posts.category → post_categories.value ────────────────────────────────
-- Map old category values to new ones before enforcing the FK
UPDATE posts SET category = CASE
  WHEN category = 'hospital'   THEN 'health'
  WHEN category = 'restaurant' THEN 'food'
  WHEN category = 'kids'       THEN 'family'
  WHEN category = 'realestate' THEN 'housing'
  WHEN category = 'classifieds'THEN 'market'
  WHEN category = 'visa'       THEN 'immigration'
  ELSE category
END
WHERE category IN ('hospital', 'restaurant', 'kids', 'realestate', 'classifieds', 'visa');

-- Reset any remaining unrecognized categories to 'general'
UPDATE posts
SET category = 'general'
WHERE category NOT IN (SELECT value FROM post_categories);

-- Add FK constraint (skip if already exists)
DO $do$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'posts_category_fkey'
      AND table_name = 'posts'
  ) THEN
    ALTER TABLE posts
      ADD CONSTRAINT posts_category_fkey
      FOREIGN KEY (category) REFERENCES post_categories(value)
      ON UPDATE CASCADE;
  END IF;
END $do$;

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "post_categories_select_public" ON post_categories;

CREATE POLICY "post_categories_select_public" ON post_categories FOR
SELECT USING (true);