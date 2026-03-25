-- =============================================================================
-- Sori Demo Seed Data
-- Run in: Supabase Dashboard → SQL Editor
--
-- Creates 7 fake users + profiles, 18 posts across all categories,
-- and 20+ comments (including 1-level replies).
--
-- Safe to re-run: deletes existing demo data first, then re-inserts cleanly.
-- This prevents duplicates even if a previous run used different UUIDs.
-- =============================================================================

DO $$
DECLARE
  -- ── User UUIDs ──────────────────────────────────────────────────────────────
  uid_a UUID := 'a1000000-0000-0000-0000-000000000001';  -- 따뜻한고양이  Fort Lee
  uid_b UUID := 'b2000000-0000-0000-0000-000000000002';  -- 멋진독수리    Palisades Park
  uid_c UUID := 'c3000000-0000-0000-0000-000000000003';  -- 행복한토끼    Flushing
  uid_d UUID := 'd4000000-0000-0000-0000-000000000004';  -- 빠른여우      Manhattan
  uid_e UUID := 'e5000000-0000-0000-0000-000000000005';  -- 조용한곰      Fort Lee
  uid_f UUID := 'f6000000-0000-0000-0000-000000000006';  -- 용감한매      Palisades Park
  uid_g UUID := '07000000-0000-0000-0000-000000000007';  -- 차분한늑대    Flushing

  -- ── Post UUIDs ──────────────────────────────────────────────────────────────
  p01 UUID := '11111111-0001-0000-0000-000000000001';
  p02 UUID := '11111111-0002-0000-0000-000000000002';
  p03 UUID := '11111111-0003-0000-0000-000000000003';
  p04 UUID := '11111111-0004-0000-0000-000000000004';
  p05 UUID := '11111111-0005-0000-0000-000000000005';
  p06 UUID := '11111111-0006-0000-0000-000000000006';
  p07 UUID := '11111111-0007-0000-0000-000000000007';
  p08 UUID := '11111111-0008-0000-0000-000000000008';
  p09 UUID := '11111111-0009-0000-0000-000000000009';
  p10 UUID := '11111111-0010-0000-0000-000000000010';
  p11 UUID := '11111111-0011-0000-0000-000000000011';
  p12 UUID := '11111111-0012-0000-0000-000000000012';
  p13 UUID := '11111111-0013-0000-0000-000000000013';
  p14 UUID := '11111111-0014-0000-0000-000000000014';
  p15 UUID := '11111111-0015-0000-0000-000000000015';
  p16 UUID := '11111111-0016-0000-0000-000000000016';
  p17 UUID := '11111111-0017-0000-0000-000000000017';
  p18 UUID := '11111111-0018-0000-0000-000000000018';

  -- ── Comment UUIDs ───────────────────────────────────────────────────────────
  c01 UUID := '22222222-0001-0000-0000-000000000001';
  c02 UUID := '22222222-0002-0000-0000-000000000002';
  c03 UUID := '22222222-0003-0000-0000-000000000003';
  c04 UUID := '22222222-0004-0000-0000-000000000004';
  c05 UUID := '22222222-0005-0000-0000-000000000005';
  c06 UUID := '22222222-0006-0000-0000-000000000006';
  c07 UUID := '22222222-0007-0000-0000-000000000007';
  c08 UUID := '22222222-0008-0000-0000-000000000008';
  c09 UUID := '22222222-0009-0000-0000-000000000009';
  c10 UUID := '22222222-0010-0000-0000-000000000010';
  c11 UUID := '22222222-0011-0000-0000-000000000011';
  c12 UUID := '22222222-0012-0000-0000-000000000012';
  c13 UUID := '22222222-0013-0000-0000-000000000013';
  c14 UUID := '22222222-0014-0000-0000-000000000014';
  c15 UUID := '22222222-0015-0000-0000-000000000015';
  c16 UUID := '22222222-0016-0000-0000-000000000016';
  c17 UUID := '22222222-0017-0000-0000-000000000017';
  c18 UUID := '22222222-0018-0000-0000-000000000018';
  c19 UUID := '22222222-0019-0000-0000-000000000019';
  c20 UUID := '22222222-0020-0000-0000-000000000020';
  c21 UUID := '22222222-0021-0000-0000-000000000021';
  c22 UUID := '22222222-0022-0000-0000-000000000022';

BEGIN

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. Clean up previous demo data (prevents duplicates on re-run)
-- ─────────────────────────────────────────────────────────────────────────────
DELETE FROM post_likes WHERE user_id IN (uid_a, uid_b, uid_c, uid_d, uid_e, uid_f, uid_g);
DELETE FROM comments    WHERE user_id IN (uid_a, uid_b, uid_c, uid_d, uid_e, uid_f, uid_g);
DELETE FROM posts       WHERE user_id IN (uid_a, uid_b, uid_c, uid_d, uid_e, uid_f, uid_g);
DELETE FROM profiles    WHERE id       IN (uid_a, uid_b, uid_c, uid_d, uid_e, uid_f, uid_g);
DELETE FROM auth.users  WHERE id       IN (uid_a, uid_b, uid_c, uid_d, uid_e, uid_f, uid_g);

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. auth.users (fake — no login possible, data only)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) VALUES
  (uid_a, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'demo_a@sori.fake', '', NOW(), '{"provider":"email","providers":["email"]}', '{}',
   NOW() - INTERVAL '45 days', NOW()),
  (uid_b, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'demo_b@sori.fake', '', NOW(), '{"provider":"email","providers":["email"]}', '{}',
   NOW() - INTERVAL '38 days', NOW()),
  (uid_c, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'demo_c@sori.fake', '', NOW(), '{"provider":"email","providers":["email"]}', '{}',
   NOW() - INTERVAL '30 days', NOW()),
  (uid_d, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'demo_d@sori.fake', '', NOW(), '{"provider":"email","providers":["email"]}', '{}',
   NOW() - INTERVAL '25 days', NOW()),
  (uid_e, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'demo_e@sori.fake', '', NOW(), '{"provider":"email","providers":["email"]}', '{}',
   NOW() - INTERVAL '20 days', NOW()),
  (uid_f, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'demo_f@sori.fake', '', NOW(), '{"provider":"email","providers":["email"]}', '{}',
   NOW() - INTERVAL '15 days', NOW()),
  (uid_g, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
   'demo_g@sori.fake', '', NOW(), '{"provider":"email","providers":["email"]}', '{}',
   NOW() - INTERVAL '10 days', NOW())
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. profiles
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO profiles (id, nickname, location, bio, joined_at) VALUES
  (uid_a, '따뜻한고양이', 'Fort Lee, NJ',        '포트리 5년차. 맛집 탐방 중.',          NOW() - INTERVAL '45 days'),
  (uid_b, '멋진독수리',   'Palisades Park, NJ',   '팰팍 거주. 커리어 상담 환영.',         NOW() - INTERVAL '38 days'),
  (uid_c, '행복한토끼',   'Flushing, NY',         '플러싱 육아맘. 정보 공유해요!',        NOW() - INTERVAL '30 days'),
  (uid_d, '빠른여우',     'Manhattan, NY',        '맨해튼 직장인. 주말엔 NJ.',            NOW() - INTERVAL '25 days'),
  (uid_e, '조용한곰',     'Fort Lee, NJ',         '포트리 3년차. 조용히 정보 수집 중.',   NOW() - INTERVAL '20 days'),
  (uid_f, '용감한매',     'Palisades Park, NJ',   '팰팍 이민 10년차. 뭐든 물어보세요.', NOW() - INTERVAL '15 days'),
  (uid_g, '차분한늑대',   'Flushing, NY',         '플러싱 자영업자.',                     NOW() - INTERVAL '10 days')
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. posts (18 total — 2-3 per category)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO posts (id, user_id, category, title, content, tags, like_count, comment_count, created_at, region) VALUES

  -- 자유게시판 (3) — global: region = NULL
  (p01, uid_a, 'general', '포트리 새로 이사왔는데 살기 어때요?',
   '안녕하세요! 다음 달에 포트리로 이사오게 됐는데 동네 분위기가 어떤지 궁금해서요. 마트, 병원, 학교 접근성이나 전반적인 생활 환경이 궁금합니다. 주차는 어떤가요? 한인 커뮤니티가 활발한지도요. 미리 감사드려요!',
   ARRAY['포트리','이사','정착'], 8, 3, NOW() - INTERVAL '8 days', NULL),

  (p02, uid_d, 'general', '소리 앱 처음 써보는데 좋네요 👍',
   '한인 커뮤니티 앱이 이렇게 깔끔하게 나온 건 처음 본 것 같아요. 비즈니스 디렉토리도 유용하고 게시판도 있으니 앞으로 자주 올게요. 개발팀 화이팅!',
   ARRAY['소리','앱리뷰'], 15, 2, NOW() - INTERVAL '2 days', NULL),

  (p03, uid_e, 'general', '뉴저지 순대국밥 맛집 아시는 분?',
   '한국에서 먹던 순대국밥이 너무 그리운데요. 포트리나 팰팍 근처에 제대로 된 곳 없을까요? 뼈국물 제대로 우린 진한 거 먹고 싶어요.',
   ARRAY['맛집','순대국밥','포트리','팰팍'], 11, 4, NOW() - INTERVAL '1 day', NULL),

  -- 병원·의료 (3) — local: region = 'nyc'
  (p04, uid_c, 'hospital', '팰팍 소아과 추천해주실 분?',
   '아이가 6살인데 소아과를 새로 찾고 있어요. 지금까지 포트리 쪽 갔는데 너무 멀어서 팰팍에서 괜찮은 곳 있으면 알려주세요. 한국어 가능한 선생님이면 더 좋겠어요. 예방접종이나 감기 정도 보는 일반 소아과입니다.',
   ARRAY['팰팍','소아과','한인병원'], 6, 3, NOW() - INTERVAL '5 days', 'nyc'),

  (p05, uid_f, 'hospital', '한국어 되는 정신과 알고 계신가요?',
   '이민 생활 스트레스가 좀 쌓여서 상담을 받아볼까 하는데요. 뉴저지나 맨해튼에 한국어로 상담 가능한 정신과나 심리상담소 아시는 분 계신가요? 보험 적용 가능하면 더 좋겠어요.',
   ARRAY['정신과','심리상담','한인병원'], 18, 5, NOW() - INTERVAL '3 days', 'nyc'),

  (p06, uid_b, 'hospital', '치과 검진 포트리 근처 좋은 곳 있나요?',
   '미국 온 지 3년 됐는데 한번도 치과를 못 갔어요 ㅜㅜ 이제 가야 할 것 같은데 포트리 근처에 한인 치과 있으면 알려주세요. 보험은 Delta Dental 있어요.',
   ARRAY['치과','포트리','Delta Dental'], 9, 2, NOW() - INTERVAL '6 days', 'nyc'),

  -- 취업·커리어 (2) — global: region = NULL
  (p07, uid_b, 'jobs', 'H1B 비자 없이 미국에서 일할 방법?',
   'F1 비자로 학교 다니고 있는데 졸업 후 취업 준비 중입니다. OPT 기간이 1년밖에 안 돼서 걱정인데 H1B 스폰을 해주는 회사를 찾는 게 현실적인 방법인가요? 아니면 다른 방법이 있는지 경험자 분들 의견 부탁드려요.',
   ARRAY['취업','H1B','OPT','비자'], 9, 3, NOW() - INTERVAL '10 days', NULL),

  (p08, uid_g, 'jobs', '뉴욕 IT 취업 준비 현실 후기',
   '저 작년에 맨해튼 스타트업에 소프트웨어 엔지니어로 입사했어요. 준비 과정을 공유해드릴게요.\n\n1. 코딩 테스트: LeetCode 하루 2문제씩 6개월\n2. 이력서: 미국식으로 1페이지, 수치화된 성과 필수\n3. 네트워킹: LinkedIn 적극 활용, 한인 개발자 모임 참여\n\n질문 있으신 분 댓글 달아주세요!',
   ARRAY['IT취업','뉴욕','개발자','취업후기'], 24, 6, NOW() - INTERVAL '12 days', NULL),

  -- 부동산·이사 (3) — local: region = 'nyc'
  (p09, uid_a, 'realestate', '포트리 vs 팰팍 어디가 더 살기 좋아요?',
   '뉴저지 쪽으로 이사를 생각 중인데 포트리랑 팰팍 중 어디가 더 나을지 고민이에요. 둘 다 한인이 많은 건 알겠는데, 집값, 학군, 통근 편의성 면에서 어떤가요? 맨해튼 출퇴근 예정입니다.',
   ARRAY['부동산','포트리','팰팍','이사'], 17, 5, NOW() - INTERVAL '14 days', 'nyc'),

  (p10, uid_d, 'realestate', '포트리 원룸/1BR 월세 시세 어떻게 되나요?',
   '맨해튼 월세가 너무 올라서 포트리로 이사를 고려 중이에요. 요즘 원룸이나 1BR 월세 시세가 어느 정도인지 아시는 분 알려주세요. 주차 포함인지 별도인지도요.',
   ARRAY['부동산','포트리','월세','이사'], 13, 4, NOW() - INTERVAL '4 days', 'nyc'),

  (p11, uid_e, 'realestate', '뉴저지 집 구매 경험 공유해요',
   '작년에 처음으로 뉴저지 집을 샀어요. 한인 부동산 에이전트랑 같이 했는데 도움이 많이 됐어요. 모기지 프리어프루벌부터 클로징까지 약 3개월 걸렸고요. 궁금한 거 있으시면 댓글로 물어보세요!',
   ARRAY['부동산','집구매','모기지','뉴저지'], 21, 7, NOW() - INTERVAL '20 days', 'nyc'),

  -- 육아·교육 (2) — local: region = 'nyc'
  (p12, uid_c, 'kids', '플러싱 한국어 학원 어디 좋아요?',
   '아이가 한국어를 잘 못해서 학원을 보내려고 하는데요. 플러싱 근처에 괜찮은 한국어/한글 학원 아시는 분 계신가요? 주말반 있으면 더 좋고요. 나이는 8살입니다.',
   ARRAY['플러싱','한국어학원','교육','육아'], 7, 2, NOW() - INTERVAL '7 days', 'nyc'),

  (p13, uid_f, 'kids', '뉴저지 초등학교 입학 절차 알려주세요',
   '올해 아이가 학교 입학인데 미국 공립 초등학교 입학 절차가 한국이랑 달라서 헷갈려요. 필요한 서류가 뭔지, 언제까지 신청해야 하는지, 영어를 못하면 ESL 지원이 있는지 아시는 분 계신가요?',
   ARRAY['초등학교','입학','뉴저지','교육'], 14, 4, NOW() - INTERVAL '9 days', 'nyc'),

  -- 비자·이민 (2) — global: region = NULL
  (p14, uid_b, 'visa', '영주권 취득 후 한국 장기 체류 괜찮나요?',
   '그린카드 받은 지 2년 됐는데 한국에 6개월 이상 있어도 괜찮을지 궁금해요. 여러 말이 있어서요. 혹시 비슷한 경험 있으신 분 계신가요? USCIS에 따르면 1년 이상은 포기로 간주한다고 하던데 실제로는 어떤지 궁금합니다.',
   ARRAY['영주권','그린카드','비자'], 11, 3, NOW() - INTERVAL '15 days', NULL),

  (p15, uid_g, 'visa', 'ESTA로 입국 후 비자 신청 가능한가요?',
   '친척이 ESTA로 미국에 와 있는데 여기서 비자 신청을 하고 싶다고 해요. ESTA로 입국한 상태에서 미국 내에서 F1이나 다른 비자로 변경 신청이 가능한가요? 아니면 한국 돌아가서 해야 하나요?',
   ARRAY['ESTA','비자변경','이민'], 8, 2, NOW() - INTERVAL '11 days', NULL),

  -- 중고거래 (3) — local: region = 'nyc'
  (p16, uid_c, 'classifieds', '[판매] 유아용 카시트 — Graco 4Ever $80',
   '아이가 커서 더 이상 사용 안 하는 카시트 판매합니다.\n\n- 브랜드: Graco 4Ever 4-in-1\n- 상태: 깨끗함 (사용감 약간 있음)\n- 가격: $80 (원가 $300)\n- 위치: 플러싱\n- 직거래만 가능\n\n관심 있으시면 댓글이나 DM 주세요!',
   ARRAY['중고거래','카시트','유아용품','플러싱'], 4, 2, NOW() - INTERVAL '3 days', 'nyc'),

  (p17, uid_d, 'classifieds', '[구매] 아이패드 프로 12.9인치 M1 구해요',
   '아이패드 프로 12.9인치 M1 (2021) 구합니다. 상태 좋은 거면 가격 협의 가능해요. 128GB or 256GB 둘 다 괜찮아요. 맨해튼 직거래 선호합니다.',
   ARRAY['중고거래','아이패드','구매'], 2, 1, NOW() - INTERVAL '1 day', 'nyc'),

  (p18, uid_e, 'classifieds', '[판매] 삼성 65인치 QLED TV $350',
   '이사 가면서 TV 처분합니다.\n\n- 삼성 65인치 QLED (2022년형)\n- 상태: 매우 좋음, 흠집 없음\n- 가격: $350 (원가 $1,200)\n- 포트리 직거래\n- 자차로 픽업 가능하신 분만\n\n연락 주세요!',
   ARRAY['중고거래','TV','삼성','포트리'], 6, 3, NOW() - INTERVAL '2 days', 'nyc')

ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. comments + replies
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO comments (id, post_id, user_id, parent_id, content, created_at) VALUES

  -- p01 (포트리 이사) — 3 comments
  (c01, p01, uid_b, NULL, '저도 포트리 살아요! H마트랑 한아름이 있어서 마트는 정말 편해요. 주차는 아파트 단지 들어오면 대부분 있어요.', NOW() - INTERVAL '7 days 20 hours'),
  (c02, p01, uid_c, NULL, '학교는 Fort Lee 공립학교들이 괜찮아요. 한인 비율 높아서 아이들도 적응 잘 해요.', NOW() - INTERVAL '7 days 18 hours'),
  (c03, p01, uid_a, c01, '오 H마트 가깝다니 최고네요! 감사합니다 😊', NOW() - INTERVAL '7 days 16 hours'),

  -- p03 (순대국밥) — 4 comments
  (c04, p03, uid_f, NULL, '포트리 Main St에 "한성관" 이라고 있는데 거기 뼈국물 진해요. 강추!', NOW() - INTERVAL '23 hours'),
  (c05, p03, uid_g, NULL, '팰팍에 "명동국밥"도 괜찮아요. 주말엔 웨이팅 있으니 일찍 가세요.', NOW() - INTERVAL '22 hours'),
  (c06, p03, uid_e, c04,  '거기 저도 좋아해요! 공기밥 추가하면 진짜 맛있음 ㅎㅎ', NOW() - INTERVAL '20 hours'),
  (c07, p03, uid_d, c05,  '명동국밥 메뉴 다양한가요? 순대 단품도 되는지요?', NOW() - INTERVAL '18 hours'),

  -- p04 (소아과) — 3 comments
  (c08, p04, uid_a, NULL, '팰팍 메인 쪽에 한인 소아과 몇 군데 있어요. 구글에 "Palisades Park Korean pediatrics" 치면 나와요.', NOW() - INTERVAL '4 days 22 hours'),
  (c09, p04, uid_f, NULL, 'Kim Pediatrics 한번 알아보세요. 한국어 되고 예약도 빨리 잡혀요.', NOW() - INTERVAL '4 days 20 hours'),
  (c10, p04, uid_c, c09,  '감사해요! 바로 알아볼게요 🙏', NOW() - INTERVAL '4 days 18 hours'),

  -- p05 (정신과) — 5 comments
  (c11, p05, uid_d, NULL, '저도 비슷한 고민으로 찾다가 맨해튼 Midtown에 한인 심리상담소 찾았어요. 보험 적용 돼요. DM 드릴게요!', NOW() - INTERVAL '2 days 20 hours'),
  (c12, p05, uid_e, NULL, '이민 생활 힘드시죠. 저는 온라인 상담을 받았는데 한국 상담사랑 연결해주는 플랫폼이 있어요. 비용도 저렴해요.', NOW() - INTERVAL '2 days 15 hours'),
  (c13, p05, uid_f, c11,  '저도 그쪽 알아보고 싶어요. 어떻게 찾으셨어요?', NOW() - INTERVAL '2 days 10 hours'),

  -- p08 (IT 취업 후기) — 6 comments
  (c14, p08, uid_b, NULL, '너무 귀한 정보 감사해요! 혹시 이력서 리뷰 해주실 수 있나요?', NOW() - INTERVAL '11 days 18 hours'),
  (c15, p08, uid_c, NULL, 'LeetCode 6개월이라니... 저는 1달 하다 포기했는데 의지력이 대단하세요.', NOW() - INTERVAL '11 days 15 hours'),
  (c16, p08, uid_g, c14,  '저도 동의해요! 한인 개발자 모임 정보도 공유해주시면 좋겠어요.', NOW() - INTERVAL '11 days 10 hours'),

  -- p09 (포트리 vs 팰팍) — 5 comments
  (c17, p09, uid_c, NULL, '맨해튼 출퇴근이시면 포트리가 훨씬 편해요. 버스 직통으로 GWB 건너면 되니까요.', NOW() - INTERVAL '13 days 15 hours'),
  (c18, p09, uid_d, NULL, '학군은 포트리가 조금 더 좋다고 알고 있어요. 집값은 비슷하거나 팰팍이 조금 저렴한 편이고요.', NOW() - INTERVAL '13 days 12 hours'),
  (c19, p09, uid_a, c17,  '맞아요. 저도 맨해튼 출퇴근인데 포트리에서 버스로 40분 정도예요. 생각보다 안 걸려요.', NOW() - INTERVAL '13 days 10 hours'),

  -- p11 (집 구매 경험) — 3 comments
  (c20, p11, uid_b, NULL, '어느 지역에 사셨나요? 학군 좋은 곳 추천해주실 수 있나요?', NOW() - INTERVAL '19 days 20 hours'),
  (c21, p11, uid_f, NULL, '모기지 금리는 어떻게 잡으셨어요? 요즘 높아서 고민이에요.', NOW() - INTERVAL '19 days 15 hours'),
  (c22, p11, uid_e, c20,  '저 Cliffside Park 샀어요! 포트리 바로 옆이라 학군도 비슷하고 가격이 좀 더 저렴해요.', NOW() - INTERVAL '19 days 10 hours')

ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. Sync comment_count (trigger handles live inserts, but seed needs manual sync)
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE posts SET comment_count = (
  SELECT COUNT(*) FROM comments WHERE post_id = posts.id
);

END $$;
