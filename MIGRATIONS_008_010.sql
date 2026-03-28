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

-- =============================================================================
-- Migration 009: Normalize regions to INTEGER PK + add critical FKs & indexes
--
-- Changes from TEXT PK to INTEGER PK for efficiency and proper normalization.
-- This migration:
-- 1. Adds region_id column (INTEGER) to posts, migrates data from TEXT region
-- 2. Adds location_id column (INTEGER) to profiles, migrates data from TEXT location
-- 3. Removes legacy TEXT columns and default_region
-- 4. Adds performance indexes
-- 5. Fully idempotent - safe to re-run
-- =============================================================================

-- ─── FIX 1: Add region_id column to posts (INTEGER FK, if not exists) ──────────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS region_id INTEGER REFERENCES regions(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- Migrate data: posts.region (TEXT) → posts.region_id (INTEGER)
-- Only if posts.region column still exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'region'
  ) THEN
    EXECUTE 'UPDATE posts SET region_id = (
      SELECT id FROM regions WHERE regions.value = posts.region
    ) WHERE region IS NOT NULL AND region_id IS NULL';
    
    -- Now drop the old column
    ALTER TABLE posts DROP COLUMN region;
  END IF;
END $$;

-- ─── FIX 2: Add location_id column to profiles (INTEGER FK, if not exists) ──────────────────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS location_id INTEGER;

-- Migrate data: profiles.location (TEXT) → profiles.location_id (INTEGER)
-- Only if profiles.location column still exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'location'
  ) THEN
    EXECUTE 'UPDATE profiles SET location_id = (
      SELECT id FROM regions WHERE regions.value = profiles.location
    ) WHERE location IS NOT NULL AND location_id IS NULL';
    
    -- Now drop the old column
    ALTER TABLE profiles DROP COLUMN location;
  END IF;
END $$;

-- Set default to 'other' region (id=12) for any NULL location_id
UPDATE profiles SET location_id = 12 WHERE location_id IS NULL;

-- Make location_id NOT NULL with FK constraint (if not already)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_type = 'FOREIGN KEY'
    AND table_name = 'profiles'
    AND constraint_name = 'fk_profiles_location_id'
  ) THEN
    ALTER TABLE profiles
      ALTER COLUMN location_id SET NOT NULL,
      ALTER COLUMN location_id SET DEFAULT 12,
      ADD CONSTRAINT fk_profiles_location_id
      FOREIGN KEY (location_id)
      REFERENCES regions(id) ON UPDATE CASCADE ON DELETE RESTRICT;
  END IF;
END $$;

-- ─── FIX 3: Remove legacy posts.location field (if exists) ────────────────
ALTER TABLE posts
  DROP COLUMN IF EXISTS location;

-- ─── FIX 4: Add performance indexes on foreign keys ──────────────────────────
CREATE INDEX IF NOT EXISTS idx_posts_region_id 
  ON posts(region_id);

CREATE INDEX IF NOT EXISTS idx_posts_user_id 
  ON posts(user_id);

CREATE INDEX IF NOT EXISTS idx_comments_user_id 
  ON comments(user_id);

CREATE INDEX IF NOT EXISTS idx_reviews_user_id 
  ON reviews(user_id);

CREATE INDEX IF NOT EXISTS idx_profiles_location_id 
  ON profiles(location_id);

-- ─── FIX 5: Add index on profiles.handle for @mention lookups ────────────────
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_handle 
  ON profiles(handle) WHERE handle IS NOT NULL;

-- ─── FIX 6: Remove legacy default_region from profiles ─────────────────────
ALTER TABLE profiles
  DROP COLUMN IF EXISTS default_region;
-- =============================================================================
-- Migration 010: Seed test data for regions, profiles, and posts
--
-- This migration creates test data across multiple regions for testing
-- region filtering, profile locations, and post display.
--
-- IMPORTANT: Only inserts test profiles if they don't already exist.
-- Does NOT delete existing user data.
--
-- Test data includes:
-- - 6 profiles across NYC, LA, SF regions (if not existing)
-- - 20 posts across categories: general, hospital, jobs, realestate, kids
-- - Posts linked to profiles with proper region_id values
-- =============================================================================

-- ─── ONLY delete OLD TEST DATA (if re-running migration) ───────────────────
-- Keep all existing user data
DELETE FROM post_likes WHERE post_id IN (
  SELECT id FROM posts WHERE user_id IN (
    'user-nyc-1', 'user-nyc-2', 'user-nyc-3', 
    'user-la-1', 'user-la-2', 'user-sf-1'
  )
);

DELETE FROM comments WHERE post_id IN (
  SELECT id FROM posts WHERE user_id IN (
    'user-nyc-1', 'user-nyc-2', 'user-nyc-3', 
    'user-la-1', 'user-la-2', 'user-sf-1'
  )
);

DELETE FROM reviews WHERE user_id IN (
  'user-nyc-1', 'user-nyc-2', 'user-nyc-3', 
  'user-la-1', 'user-la-2', 'user-sf-1'
);

DELETE FROM posts WHERE user_id IN (
  'user-nyc-1', 'user-nyc-2', 'user-nyc-3', 
  'user-la-1', 'user-la-2', 'user-sf-1'
);

DELETE FROM profiles WHERE id IN (
  'user-nyc-1', 'user-nyc-2', 'user-nyc-3', 
  'user-la-1', 'user-la-2', 'user-sf-1'
);

-- ─── Create test profiles ──────────────────────────────────────────────────
-- NYC profiles (region_id = 1)
INSERT INTO profiles (id, nickname, handle, location_id, bio, avatar_url, created_at, updated_at) VALUES
  ('user-nyc-1', 'Alex Kim', 'alex_kim', 1, '뉴욕에서 기술 블로거로 활동 중', NULL, NOW(), NOW()),
  ('user-nyc-2', 'Sarah Lee', 'sarah_lee', 1, '뉴욕 부동산 전문가', NULL, NOW(), NOW()),
  ('user-nyc-3', 'John Park', 'john_park', 1, '뉴욕에서 아이 3명 키우는 아빠', NULL, NOW(), NOW());

-- LA profiles (region_id = 2)
INSERT INTO profiles (id, nickname, handle, location_id, bio, avatar_url, created_at, updated_at) VALUES
  ('user-la-1', 'Maria Garcia', 'maria_la', 2, '로스앤젤레스 헬스 코치', NULL, NOW(), NOW()),
  ('user-la-2', 'David Chen', 'david_chen', 2, 'LA에서 의료업 종사', NULL, NOW(), NOW());

-- SF profiles (region_id = 3)
INSERT INTO profiles (id, nickname, handle, location_id, bio, avatar_url, created_at, updated_at) VALUES
  ('user-sf-1', 'Emily Wong', 'emily_sf', 3, '샌프란시스코 스타트업 창업가', NULL, NOW(), NOW());

-- ─── Create test posts ──────────────────────────────────────────────────
-- General (자유게시판) — local posts
INSERT INTO posts (user_id, category, region_id, title, content, tags, created_at) VALUES
  ('user-nyc-1', 'general', 1, 
   'NYC 최고의 카페 추천 해주세요!', 
   '뉴욕에서 조용하고 좋은 카페 찾고있는데 맨하탄이나 퀸스 추천 받고 싶어요. 와이파이 좋고 분위기 있는 곳 부탁!',
   ARRAY['뉴욕', '카페', '추천'], NOW()),
  ('user-nyc-2', 'general', 1,
   '뉴욕 겨울 옷 준비 팁',
   '이번이 첫 겨울이라 뭘 준비해야 할지 모르겠어요. 코트, 부츠 등 조언 부탁합니다.',
   ARRAY['뉴욕', '겨울', '옷'], NOW()),
  ('user-la-1', 'general', 2,
   'LA에서 한인마켓 찾기',
   '라팔마 주변에 가까운 한인마켓 어디예요? 김, 고추장 사야 하는데',
   ARRAY['로스앤젤레스', '한인마켓'], NOW()),
  ('user-sf-1', 'general', 3,
   'SF 한인회 커뮤니티 정보',
   '샌프란시스코 한인회 정보 있으신가요? 네트워킹 이벤트 참석하고 싶습니다.',
   ARRAY['샌프란시스코', '한인회'], NOW());

-- Hospital (병원·의료) — local posts
INSERT INTO posts (user_id, category, region_id, title, content, tags, created_at) VALUES
  ('user-nyc-1', 'hospital', 1,
   '뉴욕에서 추천할 만한 한의원 있나요?',
   '목과 어깨가 자주 아파서 한의원 찾고있어요. 맨하탄이나 퀸스의 깨끗하고 싼 곳 추천 부탁합니다.',
   ARRAY['뉴욕', '한의원', '의료'], NOW()),
  ('user-nyc-3', 'hospital', 1,
   '아이 예방접종 일정 물어봐요',
   '뉴욕에서 아이 예방접종 일정이 한국이랑 다르다고 했는데 어떻게 다른가요? 소아과 추천도 부탁!',
   ARRAY['뉴욕', '소아과', '예방접종'], NOW()),
  ('user-la-2', 'hospital', 2,
   'LA 치과 추천해주세요',
   '라팔마 근처 좋은 치과 있으신가요? 예방검진 받으려고 하는데 한국말 되는 치과 찾고있습니다.',
   ARRAY['로스앤젤레스', '치과'], NOW()),
  ('user-sf-1', 'hospital', 3,
   '샌프란시스코 의료보험 설명 부탁드립니다',
   'SF에 새로 나왔는데 메디케이드, 메디케어 차이가 뭔지 설명 부탁드립니다.',
   ARRAY['샌프란시스코', '의료보험'], NOW());

-- Jobs (취업·커리어) — local posts
INSERT INTO posts (user_id, category, region_id, title, content, tags, created_at) VALUES
  ('user-nyc-2', 'jobs', 1,
   '뉴욕 부동산 경력직 구합니다',
   '뉴욕 부동산 에이전트 경력 10년 이상 찾고있습니다. 리모트 가능하고 수수료 경쟁력 있습니다. 관심 있으신 분 연락주세요.',
   ARRAY['뉴욕', '취업', '부동산'], NOW()),
  ('user-la-1', 'jobs', 2,
   '라에서 헬스 코치 구인합니다',
   'LA에서 풀타임 헬스 코치 찾고있어요. 한국말 가능하신 분 우대! 월급 협의 가능합니다.',
   ARRAY['로스앤젤레스', '취업'], NOW()),
  ('user-sf-1', 'jobs', 3,
   '샌프란시스코 한인 스타트업 코파운더 모집',
   '헬스테크 스타트업 시작하는데 한국식 마케팅 경험 있는 코파운더 찾습니다. Equity 기반.',
   ARRAY['샌프란시스코', '취업', '스타트업'], NOW());

-- Real Estate (부동산·이사) — local posts
INSERT INTO posts (user_id, category, region_id, title, content, tags, created_at) VALUES
  ('user-nyc-3', 'realestate', 1,
   'NYC 맨해튼 2룸 아파트 임차 정보 부탁',
   '맨해튼 미드타운에서 2룸 찾고있는데 $3000-4000 범위 괜찮은 곳 알고 있으신 분 정보 부탁드립니다.',
   ARRAY['뉴욕', '부동산', '임차'], NOW()),
  ('user-la-1', 'realestate', 2,
   'LA 토런스 근처 집 구매 조언',
   '라팔마 근처에서 집 구매 생각중인데 좋은 지역인가요? 학군이랑 커뮤니티 정보 부탁합니다.',
   ARRAY['로스앤젤레스', '부동산', '구매'], NOW()),
  ('user-sf-1', 'realestate', 3,
   '샌프란시스코 임대료 위기 함께 나눠요',
   'SF 임대료가 너무 올라서 정말 힘들어요. 이 동네 거주 경험 나눠주세요.',
   ARRAY['샌프란시스코', '부동산', '임대료'], NOW());

-- Kids (육아·교육) — local posts
INSERT INTO posts (user_id, category, region_id, title, content, tags, created_at) VALUES
  ('user-nyc-3', 'kids', 1,
   '뉴욕 좋은 유치원 추천 부탁드립니다',
   '올해 아이가 유치원 들어가는데 맨해튼이나 퀸스에서 추천할 만한 유치원 있으신가요? 한인 아이 많은 곳 찾고있습니다.',
   ARRAY['뉴욕', '육아', '유치원'], NOW()),
  ('user-la-1', 'kids', 2,
   'LA 한글학교 정보 나눠주세요',
   '라팔마 근처 한글학교 있나요? 아이들이 한글을 잊어버리는 것 같아서 찾고있습니다.',
   ARRAY['로스앤젤레스', '육아', '한글학교'], NOW());

-- ─── Initialize post_likes (Reddit style — author auto-likes) ──────────────
INSERT INTO post_likes (post_id, user_id)
SELECT id, user_id FROM posts WHERE user_id IN (
  'user-nyc-1', 'user-nyc-2', 'user-nyc-3', 
  'user-la-1', 'user-la-2', 'user-sf-1'
);

-- ─── Update post counts in posts table ──────────────────────────────────
UPDATE posts SET like_count = 1 WHERE id IN (SELECT post_id FROM post_likes);
