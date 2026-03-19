-- =============================================
-- Sori App — Supabase Schema
-- supabase.com → SQL Editor → 전체 복붙 → Run
-- =============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── profiles ────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname    TEXT NOT NULL,
  avatar_url  TEXT,
  location    TEXT,
  bio         TEXT,
  joined_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─── businesses ──────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  name_en       TEXT,
  category      TEXT NOT NULL,
  subcategory   TEXT,
  description   TEXT,
  address       TEXT NOT NULL DEFAULT '',
  city          TEXT NOT NULL,
  state         TEXT NOT NULL DEFAULT 'NJ',
  zip           TEXT DEFAULT '',
  phone         TEXT,
  website       TEXT,
  email         TEXT,
  hours         JSONB,
  languages     TEXT[] DEFAULT '{ko}',
  is_verified   BOOLEAN DEFAULT FALSE,
  is_premium    BOOLEAN DEFAULT FALSE,
  rating        NUMERIC(3,2) DEFAULT 0,
  review_count  INT DEFAULT 0,
  images        TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_city     ON businesses(city);
CREATE INDEX IF NOT EXISTS idx_businesses_premium  ON businesses(is_premium DESC);

-- ─── reviews ─────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id  UUID REFERENCES businesses(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating       INT CHECK (rating BETWEEN 1 AND 5),
  content      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id, user_id)
);

CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE businesses SET
    rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)),
    review_count = (SELECT COUNT(*) FROM reviews WHERE business_id = COALESCE(NEW.business_id, OLD.business_id)),
    updated_at = NOW()
  WHERE id = COALESCE(NEW.business_id, OLD.business_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_business_rating ON reviews;
CREATE TRIGGER trg_update_business_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_business_rating();

-- ─── posts ───────────────────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category      TEXT NOT NULL DEFAULT 'general',
  title         TEXT,
  content       TEXT NOT NULL,
  tags          TEXT[] DEFAULT '{}',
  images        TEXT[] DEFAULT '{}',
  location      TEXT,
  like_count    INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created  ON posts(created_at DESC);

-- ─── post_likes ──────────────────────────────
CREATE TABLE IF NOT EXISTS post_likes (
  post_id   UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id   UUID REFERENCES profiles(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, user_id)
);

CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_like_count ON post_likes;
CREATE TRIGGER trg_post_like_count
AFTER INSERT OR DELETE ON post_likes
FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- ─── comments ────────────────────────────────
CREATE TABLE IF NOT EXISTS comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  like_count  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_post_comment_count ON comments;
CREATE TRIGGER trg_post_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- ─── Row Level Security ───────────────────────
ALTER TABLE profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews    ENABLE ROW LEVEL SECURITY;

-- 기존 policy 삭제 후 재생성 (중복 방지)
DROP POLICY IF EXISTS "public_read_businesses" ON businesses;
DROP POLICY IF EXISTS "public_read_posts"      ON posts;
DROP POLICY IF EXISTS "public_read_comments"   ON comments;
DROP POLICY IF EXISTS "public_read_reviews"    ON reviews;
DROP POLICY IF EXISTS "public_read_profiles"   ON profiles;
DROP POLICY IF EXISTS "own_post"               ON posts;
DROP POLICY IF EXISTS "own_comment"            ON comments;
DROP POLICY IF EXISTS "own_like"               ON post_likes;
DROP POLICY IF EXISTS "own_review"             ON reviews;
DROP POLICY IF EXISTS "own_profile"            ON profiles;

-- 공개 읽기
CREATE POLICY "public_read_businesses" ON businesses FOR SELECT USING (true);
CREATE POLICY "public_read_posts"      ON posts      FOR SELECT USING (true);
CREATE POLICY "public_read_comments"   ON comments   FOR SELECT USING (true);
CREATE POLICY "public_read_reviews"    ON reviews    FOR SELECT USING (true);
CREATE POLICY "public_read_profiles"   ON profiles   FOR SELECT USING (true);

-- 본인 데이터만 쓰기
CREATE POLICY "own_post"    ON posts      FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_comment" ON comments   FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_like"    ON post_likes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_review"  ON reviews    FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "own_profile" ON profiles   FOR ALL USING (auth.uid() = id);

-- ─── Seed Data (초기 비즈니스 6개) ───────────
INSERT INTO businesses (name, name_en, category, subcategory, city, state, phone, languages, is_verified, is_premium, rating, review_count) VALUES
  ('포트리 한인 내과',        'Fort Lee Korean Internal Medicine', 'hospital',   '가정의학과·내과', 'Fort Lee',       'NJ', '2015550101', '{ko,en}', true,  true,  4.9, 127),
  ('김앤파트너스 법률사무소',  'Kim & Partners Law',               'lawyer',     '이민법·형사법',  'Manhattan',      'NY', '2125550202', '{ko,en}', true,  true,  4.7, 89),
  ('이성민 CPA 회계사무소',   'Lee Sung Min CPA',                 'accountant', '세금·법인회계',  'Palisades Park', 'NJ', '2015550303', '{ko,en}', true,  false, 4.8, 54),
  ('우리집 한식당',           'Our Home Korean Restaurant',       'restaurant', '한식·국밥',      'Flushing',       'NY', '7185550404', '{ko}',    true,  false, 4.6, 203),
  ('서울 헤어살롱',           'Seoul Hair Salon',                 'beauty',     '미용실',         'Palisades Park', 'NJ', '2015550505', '{ko,en}', false, false, 4.5, 38),
  ('한인 부동산 그룹',        'Korean Real Estate Group',         'realestate', '주거용·상업용',  'Fort Lee',       'NJ', '2015550606', '{ko,en}', true,  false, 4.4, 22)
ON CONFLICT DO NOTHING;

-- =============================================
-- 완료! Table Editor에서 테이블 확인하세요.
-- =============================================
