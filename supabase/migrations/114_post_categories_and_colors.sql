-- Migration 011: post_categories table + FK to posts
-- Colors are managed in code (lib/colors.ts), NOT in DB.
-- Safe to re-run (idempotent)

-- ── Create post_categories table ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS post_categories (
  id         SERIAL PRIMARY KEY,
  value      TEXT UNIQUE NOT NULL,
  label      TEXT NOT NULL,
  emoji      TEXT NOT NULL,
  sort_order INT  NOT NULL DEFAULT 0
);

INSERT INTO post_categories (value, label, emoji, sort_order) VALUES
  ('general',    '자유게시판',  '💬', 1),
  ('restaurant', '식당·카페',   '🍜', 2),
  ('hospital',   '병원·의료',   '🏥', 3),
  ('jobs',       '취업·커리어', '💼', 4),
  ('realestate', '부동산·이사', '🏠', 5),
  ('kids',       '육아·교육',   '👶', 6),
  ('classifieds','중고거래',    '🛍️', 7),
  ('visa',       '비자·이민',   '✈️', 8)
ON CONFLICT (value) DO UPDATE SET
  label      = EXCLUDED.label,
  emoji      = EXCLUDED.emoji,
  sort_order = EXCLUDED.sort_order;

-- ── FK: posts.category → post_categories.value ────────────────────────────────
-- Fix any orphaned categories before adding constraint
UPDATE posts SET category = 'general'
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
CREATE POLICY "post_categories_select_public"
  ON post_categories FOR SELECT USING (true);
