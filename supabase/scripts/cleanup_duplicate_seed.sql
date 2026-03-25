-- =============================================================================
-- Cleanup Duplicate Seed Data
-- Run in: Supabase Dashboard → SQL Editor
--
-- Removes all rows created by demo accounts (identified by their fixed UUIDs).
-- Run this BEFORE re-running 001_demo_data.sql to eliminate duplicates.
-- =============================================================================

DO $$
DECLARE
  demo_users UUID[] := ARRAY[
    'a1000000-0000-0000-0000-000000000001'::UUID,  -- 따뜻한고양이
    'b2000000-0000-0000-0000-000000000002'::UUID,  -- 멋진독수리
    'c3000000-0000-0000-0000-000000000003'::UUID,  -- 행복한토끼
    'd4000000-0000-0000-0000-000000000004'::UUID,  -- 빠른여우
    'e5000000-0000-0000-0000-000000000005'::UUID,  -- 조용한곰
    'f6000000-0000-0000-0000-000000000006'::UUID,  -- 용감한매
    '07000000-0000-0000-0000-000000000007'::UUID   -- 차분한늑대
  ];
BEGIN
  DELETE FROM post_likes WHERE user_id = ANY(demo_users);
  DELETE FROM comments    WHERE user_id = ANY(demo_users);
  DELETE FROM posts       WHERE user_id = ANY(demo_users);
  DELETE FROM profiles    WHERE id       = ANY(demo_users);
  DELETE FROM auth.users  WHERE id       = ANY(demo_users);

  RAISE NOTICE 'Demo data cleaned up. Now re-run 001_demo_data.sql.';
END $$;
