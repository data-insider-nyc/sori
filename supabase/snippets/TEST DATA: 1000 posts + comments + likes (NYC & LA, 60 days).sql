-- ============================================================
-- TEST DATA: 1000 posts + comments + likes (NYC & LA, 60 days)
-- Run in: Supabase Dashboard → SQL Editor
-- ============================================================
DO $$
DECLARE
  categories    text[] := ARRAY['general','food','local','jobs','housing','family','market','immigration','health'];
  regions       text[] := ARRAY['nyc','la'];
  titles_nyc    text[] := ARRAY[
    '포트리 맛집 추천해주세요', '플러싱 부동산 요즘 어때요?', 'NYC 한인 커뮤니티 모임 있나요',
    '뉴욕 비자 갱신 경험 공유', '뉴저지 육아용품 팔아요', '맨해튼 직장 구합니다',
    'NYC 이민 변호사 추천', '뉴욕 한식당 랭킹', '브루클린 이사 후기',
    'NJ 중고차 거래 경험', '뉴욕 병원 추천해주세요', '한인 학교 어디가 좋아요?',
    'JFK 공항 근처 숙소', '맨해튼 월세 너무 비싸죠?', '플러싱 마켓 추천',
    '뉴욕 생활비 얼마나 들어요', 'NYC 운전면허 취득 후기', '한인타운 새 식당 오픈',
    '퀸즈 동네 안전한가요?', '뉴저지 학군 추천'
  ];
  titles_la     text[] := ARRAY[
    'LA 한인타운 맛집 추천', '코리아타운 월세 어때요?', 'LA 운전 너무 힘들죠',
    'LA 한인 모임 있나요', '산타모니카 해변 후기', 'LA 비자 인터뷰 경험',
    'LA 병원 추천해주세요', '코리아타운 중고 거래', 'LA 직장 구하기 팁',
    '한인 부동산 에이전트 추천', 'LA 날씨 너무 좋아요', '코리아타운 새 카페',
    'LA 한식 배달 앱', '글렌데일 동네 어때요?', 'LA 육아 정보 공유',
    '토런스 이민 후기', 'LA 이사 업체 추천', '코리아타운 주차 꿀팁',
    'LA 한인 마트 비교', 'OC 한인 커뮤니티'
  ];
  contents      text[] := ARRAY[
    '혹시 경험 있으신 분들 댓글로 알려주세요. 요즘 많이 고민 중입니다.',
    '이 동네 오래 사셨던 분들 조언 부탁드려요. 정말 도움이 될 것 같아요.',
    '비슷한 상황이신 분 계신가요? 같이 이야기 나눠요.',
    '저도 처음이라 잘 모르겠는데 여기서 물어봐도 될까요?',
    '후기 읽고 많이 참고가 됐습니다. 감사해요!',
    '정말 유용한 정보 감사해요. 저도 비슷한 경험 했어요.',
    '이 글 보고 용기 얻어서 저도 도전해봤는데 잘 됐어요.',
    '어디서 더 자세한 정보 얻을 수 있을까요?',
    '여러분 생각은 어떠세요? 댓글 남겨주세요.',
    '저는 작년에 비슷한 경험을 했는데 많이 달라졌더라고요.'
  ];
  comment_texts text[] := ARRAY[
    '저도 궁금했는데 감사해요!', '좋은 정보 공유 감사합니다.',
    '저도 비슷한 경험이 있어요.', '더 자세한 내용 알 수 있을까요?',
    '혹시 연락처 남겨주실 수 있나요?', '도움이 많이 됐어요!',
    '저도 이 동네 살아요. 공감이에요.', '추천해주신 곳 다녀왔는데 정말 좋았어요.',
    '이런 정보 어디서 찾으셨나요?', '저도 알고 싶었던 내용이에요.',
    '한번 가봐야겠네요.', '감사합니다. 큰 도움이 됐어요.',
    '다른 분들은 어떻게 생각하세요?', '저는 좀 다른 경험을 했는데요.',
    '이 글 저장해뒀어요. 나중에 참고할게요.'
  ];

  profile_ids  uuid[];
  post_id      uuid;
  author_id    uuid;
  commenter_id uuid;
  post_ts      timestamptz;
  comment_ts   timestamptz;
  num_comments int;
  num_likes    int;
  cat          text;
  reg          text;
  title        text;
  body         text;
  i            int;
  j            int;
BEGIN
  SELECT array_agg(id) INTO profile_ids FROM profiles;

  FOR i IN 1..10000 LOOP
    cat          := categories[1 + floor(random() * array_length(categories,1))::int];
    reg          := regions[1 + floor(random() * 2)::int];
    post_ts      := now() - (random() * interval '60 days');
    num_comments := 3 + floor(random() * 18)::int;   -- 3–20
    num_likes    := floor(random() * 200)::int;        -- 0–199
    author_id    := profile_ids[1 + floor(random() * array_length(profile_ids,1))::int];

    IF reg = 'nyc' THEN
      title := titles_nyc[1 + floor(random() * array_length(titles_nyc,1))::int] || ' #' || i;
    ELSE
      title := titles_la[1 + floor(random() * array_length(titles_la,1))::int] || ' #' || i;
    END IF;
    body := contents[1 + floor(random() * array_length(contents,1))::int];

    INSERT INTO posts (user_id, category, region, title, content, like_count, comment_count, created_at)
    VALUES (author_id, cat, reg, title, body, num_likes, 0, post_ts)
    RETURNING id INTO post_id;

    -- trigger (SECURITY DEFINER, just fixed) will increment comment_count per insert
    FOR j IN 1..num_comments LOOP
      commenter_id := profile_ids[1 + floor(random() * array_length(profile_ids,1))::int];
      comment_ts   := post_ts + (random() * (now() - post_ts));
      INSERT INTO comments (post_id, user_id, content, created_at)
      VALUES (post_id, commenter_id,
              comment_texts[1 + floor(random() * array_length(comment_texts,1))::int],
              comment_ts);
    END LOOP;
  END LOOP;
END $$;

-- Quick sanity check after running:
-- SELECT region, category, count(*), avg(comment_count), avg(like_count)
-- FROM posts WHERE created_at > now() - interval '60 days'
-- GROUP BY region, category ORDER BY region, category;