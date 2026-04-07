 BEGIN; WITH admin_posts AS (  SELECT p.id AS post_id  FROM posts p  JOIN profiles pr ON pr.id = p.user_id
  WHERE pr.is_admin = true AND p.deleted_at IS NULL ), users AS (  SELECT id FROM profiles WHERE is_admin =
  false ORDER BY random() LIMIT 50 ), crossed AS (  SELECT ap.post_id, u.id AS user_id,  row_number() OVER
  (PARTITION BY ap.post_id ORDER BY random()) AS rn  FROM admin_posts ap CROSS JOIN users u ) INSERT INTO
  comments (post_id, user_id, content, created_at) SELECT  post_id,  user_id,  concat('[테스트] ', '댓글 
  #', rn,
  ' — ', substring(md5(random()::text),1,8)) AS content,  now() - (INTERVAL '1 minute' *
  (floor(random()*1440))) -- 최근 24시간 내 랜덤 시각 FROM crossed WHERE rn <= 10; COMMIT;