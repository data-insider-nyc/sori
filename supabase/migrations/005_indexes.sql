-- Performance indexes for common query patterns

-- posts: listing by region + category + created_at (community feed)
CREATE INDEX IF NOT EXISTS idx_posts_region_category_created
  ON posts (region, category, created_at DESC);

-- posts: listing by created_at only (no filter)
CREATE INDEX IF NOT EXISTS idx_posts_created_at
  ON posts (created_at DESC);

-- posts: hot topics (comment_count desc)
CREATE INDEX IF NOT EXISTS idx_posts_comment_count
  ON posts (comment_count DESC, created_at DESC);

-- posts: search by title (prefix/contains search)
CREATE INDEX IF NOT EXISTS idx_posts_title_gin
  ON posts USING gin (to_tsvector('simple', coalesce(title, '')));

-- businesses: listing by category + city
CREATE INDEX IF NOT EXISTS idx_businesses_category_city
  ON businesses (category, city);

-- businesses: premium listing
CREATE INDEX IF NOT EXISTS idx_businesses_premium_rating
  ON businesses (is_premium, rating DESC)
  WHERE is_premium = true;

-- reviews: lookup by business_id
CREATE INDEX IF NOT EXISTS idx_reviews_business_id
  ON reviews (business_id, created_at DESC);

-- comments: lookup by post_id
CREATE INDEX IF NOT EXISTS idx_comments_post_id
  ON comments (post_id, created_at ASC);

-- post_likes: lookup by post_id and user_id
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id
  ON post_likes (post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_post
  ON post_likes (user_id, post_id);
