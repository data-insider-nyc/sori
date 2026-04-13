-- ============================================================
-- 성능 체크 쿼리 (EXPLAIN ANALYZE)
-- 삽입 후 아래 쿼리들로 실행 계획 확인
-- ============================================================

-- 1. 기본 피드 (region + category 복합 필터) — 가장 중요
EXPLAIN ANALYZE
SELECT id, title, category, region, like_count, comment_count, created_at
FROM posts
WHERE deleted_at IS NULL
  AND region = 'nyc'
  AND category = 'food'
ORDER BY created_at DESC
LIMIT 20;

-- 2. 텍스트 검색 (trigram GIN 인덱스 사용 여부 확인)
EXPLAIN ANALYZE
SELECT id, title FROM posts
WHERE deleted_at IS NULL
  AND title ILIKE '%맛집%'
ORDER BY created_at DESC
LIMIT 20;

-- 3. 커서 페이지네이션 (2페이지 이후)
EXPLAIN ANALYZE
SELECT id, title, created_at FROM posts
WHERE deleted_at IS NULL
  AND (created_at < '2026-03-01 00:00:00+00'
       OR (created_at = '2026-03-01 00:00:00+00'))
ORDER BY created_at DESC, id DESC
LIMIT 20;