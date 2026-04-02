-- =============================================================================
-- Sori NYC Seed Data — 10 realistic NYC profiles + 10 posts + 52 comments
--
-- Themes: roommate search, visa/immigration, expat loneliness, NYC life
-- Profiles: 5 male / 5 female — grad students, young professionals
-- Dates:   all within the last 30 days (from April 2, 2026)
--
-- Run in: Supabase Dashboard → SQL Editor
-- Safe to re-run: deletes existing data for these UUIDs first.
-- =============================================================================

DO $$
DECLARE
  -- ── User UUIDs ──────────────────────────────────────────────────────────────
  -- Male (5)
  u_junseo   UUID := 'c1000000-0000-0000-0000-000000000021'; -- 이준서 @jun_nyc
  u_jaewon   UUID := 'c1000000-0000-0000-0000-000000000022'; -- 최재원 @jaewon_gs
  u_dohoon   UUID := 'c1000000-0000-0000-0000-000000000023'; -- 김도훈 @dohoon_stern
  u_hyunsoo  UUID := 'c1000000-0000-0000-0000-000000000024'; -- 박현수 @hyunsoo_dev
  u_minho    UUID := 'c1000000-0000-0000-0000-000000000025'; -- 장민호 @minho_md
  -- Female (5)
  u_ayeon    UUID := 'c1000000-0000-0000-0000-000000000026'; -- 서아연 @ayeon_sipa
  u_yujin    UUID := 'c1000000-0000-0000-0000-000000000027'; -- 한유진 @yujin_soho
  u_sohee    UUID := 'c1000000-0000-0000-0000-000000000028'; -- 임소희 @sohee_acc
  u_nayeon   UUID := 'c1000000-0000-0000-0000-000000000029'; -- 강나연 @nayeon_legal
  u_jieun    UUID := 'c1000000-0000-0000-0000-000000000030'; -- 조지은 @jieun_lens

  -- Male/Female 추가 10명
  u_daniel   UUID := 'c1000000-0000-0000-0000-000000000031'; -- Daniel Kim
  u_kevin    UUID := 'c1000000-0000-0000-0000-000000000032'; -- Kevin Lee
  u_eric     UUID := 'c1000000-0000-0000-0000-000000000033'; -- Eric Park
  u_jason    UUID := 'c1000000-0000-0000-0000-000000000034'; -- Jason Choi
  u_brian    UUID := 'c1000000-0000-0000-0000-000000000035'; -- Brian Yoo
  u_emily    UUID := 'c1000000-0000-0000-0000-000000000036'; -- Emily Jung
  u_chloe    UUID := 'c1000000-0000-0000-0000-000000000037'; -- Chloe Kang
  u_hannah   UUID := 'c1000000-0000-0000-0000-000000000038'; -- Hannah Lee
  u_grace    UUID := 'c1000000-0000-0000-0000-000000000039'; -- Grace Shin
  u_olivia   UUID := 'c1000000-0000-0000-0000-000000000040'; -- Olivia Choi

  -- ── Post UUIDs ──────────────────────────────────────────────────────────────
  np01 UUID := 'c2000000-0001-0000-0000-000000000001'; -- HK 룸메이트 (박현수)
  np02 UUID := 'c2000000-0002-0000-0000-000000000002'; -- WH 룸메이트 (서아연)
  np03 UUID := 'c2000000-0003-0000-0000-000000000003'; -- OPT/H1B 비자 (김도훈)
  np04 UUID := 'c2000000-0004-0000-0000-000000000004'; -- F1 비자 갱신 (임소희)
  np05 UUID := 'c2000000-0005-0000-0000-000000000005'; -- 외로움 (서아연)
  np06 UUID := 'c2000000-0006-0000-0000-000000000006'; -- 박사 후기 (이준서)
  np07 UUID := 'c2000000-0007-0000-0000-000000000007'; -- 뉴욕 3년 (조지은)
  np08 UUID := 'c2000000-0008-0000-0000-000000000008'; -- ME 룸메이트 (강나연)
  np09 UUID := 'c2000000-0009-0000-0000-000000000009'; -- 레지던트 (장민호)
  np10 UUID := 'c2000000-0010-0000-0000-000000000010'; -- 시민권 합격 (최재원)
  np11 UUID := 'c2000000-0011-0000-0000-000000000011'; -- LIC 룸메이트 (Emily)
  np12 UUID := 'c2000000-0012-0000-0000-000000000012'; -- Astoria 룸메이트 (Kevin)
  np13 UUID := 'c2000000-0013-0000-0000-000000000013'; -- O-1 비자 (Daniel)
  np14 UUID := 'c2000000-0014-0000-0000-000000000014'; -- H1B 로터리 실패 (Eric)
  np15 UUID := 'c2000000-0015-0000-0000-000000000015'; -- 외로움2 (Grace)
  np16 UUID := 'c2000000-0016-0000-0000-000000000016'; -- NYC 커리어 고민 (Jason)
  np17 UUID := 'c2000000-0017-0000-0000-000000000017'; -- 브루클린 생활팁 (Olivia)
  np18 UUID := 'c2000000-0018-0000-0000-000000000018'; -- 퀸즈 이사 후기 (Hannah)
  np19 UUID := 'c2000000-0019-0000-0000-000000000019'; -- 의대 매칭 준비 (Brian)
  np20 UUID := 'c2000000-0020-0000-0000-000000000020'; -- 학생 비자 CPT (Chloe)

  -- ── Comment UUIDs ───────────────────────────────────────────────────────────
  nc01 UUID := 'c3000000-0001-0000-0000-000000000001';
  nc02 UUID := 'c3000000-0002-0000-0000-000000000002';
  nc03 UUID := 'c3000000-0003-0000-0000-000000000003';
  nc04 UUID := 'c3000000-0004-0000-0000-000000000004';
  nc05 UUID := 'c3000000-0005-0000-0000-000000000005';
  nc06 UUID := 'c3000000-0006-0000-0000-000000000006';
  nc07 UUID := 'c3000000-0007-0000-0000-000000000007';
  nc08 UUID := 'c3000000-0008-0000-0000-000000000008';
  nc09 UUID := 'c3000000-0009-0000-0000-000000000009';
  nc10 UUID := 'c3000000-0010-0000-0000-000000000010';
  nc11 UUID := 'c3000000-0011-0000-0000-000000000011';
  nc12 UUID := 'c3000000-0012-0000-0000-000000000012';
  nc13 UUID := 'c3000000-0013-0000-0000-000000000013';
  nc14 UUID := 'c3000000-0014-0000-0000-000000000014';
  nc15 UUID := 'c3000000-0015-0000-0000-000000000015';
  nc16 UUID := 'c3000000-0016-0000-0000-000000000016';
  nc17 UUID := 'c3000000-0017-0000-0000-000000000017';
  nc18 UUID := 'c3000000-0018-0000-0000-000000000018';
  nc19 UUID := 'c3000000-0019-0000-0000-000000000019';
  nc20 UUID := 'c3000000-0020-0000-0000-000000000020';
  nc21 UUID := 'c3000000-0021-0000-0000-000000000021';
  nc22 UUID := 'c3000000-0022-0000-0000-000000000022';
  nc23 UUID := 'c3000000-0023-0000-0000-000000000023';
  nc24 UUID := 'c3000000-0024-0000-0000-000000000024';
  nc25 UUID := 'c3000000-0025-0000-0000-000000000025';
  nc26 UUID := 'c3000000-0026-0000-0000-000000000026';
  nc27 UUID := 'c3000000-0027-0000-0000-000000000027';
  nc28 UUID := 'c3000000-0028-0000-0000-000000000028';
  nc29 UUID := 'c3000000-0029-0000-0000-000000000029';
  nc30 UUID := 'c3000000-0030-0000-0000-000000000030';
  nc31 UUID := 'c3000000-0031-0000-0000-000000000031';
  nc32 UUID := 'c3000000-0032-0000-0000-000000000032';
  nc33 UUID := 'c3000000-0033-0000-0000-000000000033';
  nc34 UUID := 'c3000000-0034-0000-0000-000000000034';
  nc35 UUID := 'c3000000-0035-0000-0000-000000000035';
  nc36 UUID := 'c3000000-0036-0000-0000-000000000036';
  nc37 UUID := 'c3000000-0037-0000-0000-000000000037';
  nc38 UUID := 'c3000000-0038-0000-0000-000000000038';
  nc39 UUID := 'c3000000-0039-0000-0000-000000000039';
  nc40 UUID := 'c3000000-0040-0000-0000-000000000040';
  nc41 UUID := 'c3000000-0041-0000-0000-000000000041';
  nc42 UUID := 'c3000000-0042-0000-0000-000000000042';
  nc43 UUID := 'c3000000-0043-0000-0000-000000000043';
  nc44 UUID := 'c3000000-0044-0000-0000-000000000044';
  nc45 UUID := 'c3000000-0045-0000-0000-000000000045';
  nc46 UUID := 'c3000000-0046-0000-0000-000000000046';
  nc47 UUID := 'c3000000-0047-0000-0000-000000000047';
  nc48 UUID := 'c3000000-0048-0000-0000-000000000048';
  nc49 UUID := 'c3000000-0049-0000-0000-000000000049';
  nc50 UUID := 'c3000000-0050-0000-0000-000000000050';
  nc51 UUID := 'c3000000-0051-0000-0000-000000000051';
  nc52 UUID := 'c3000000-0052-0000-0000-000000000052';

BEGIN

-- =============================================================================
-- 0. Clean up previous data for these UUIDs (idempotent)
-- =============================================================================
DELETE FROM post_likes WHERE user_id IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);
DELETE FROM comments    WHERE user_id IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);
DELETE FROM posts       WHERE user_id IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);
DELETE FROM profiles    WHERE id       IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);
DELETE FROM auth.users  WHERE id       IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);

-- =============================================================================
-- 1. auth.users — fake entries (no real login, display only)
-- =============================================================================
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES
  (u_junseo,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'david.nyu@sori.fake',    '', '2025-11-01 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-11-01 00:00:00+00', NOW()),
  (u_jaewon,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'john.doe@sori.fake',     '', '2025-11-15 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-11-15 00:00:00+00', NOW()),
  (u_dohoon,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'dohoon.kim@sori.fake',   '', '2025-12-01 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-12-01 00:00:00+00', NOW()),
  (u_hyunsoo, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hyunsoo.park@sori.fake', '', '2025-12-10 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-12-10 00:00:00+00', NOW()),
  (u_minho,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'minho.jang@sori.fake',   '', '2025-12-20 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-12-20 00:00:00+00', NOW()),
  (u_ayeon,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'ayeon.seo@sori.fake',    '', '2026-01-05 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2026-01-05 00:00:00+00', NOW()),
  (u_yujin,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'yujin.han@sori.fake',    '', '2026-01-15 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2026-01-15 00:00:00+00', NOW()),
  (u_sohee,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'sohee.lim@sori.fake',    '', '2026-01-20 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2026-01-20 00:00:00+00', NOW()),
  (u_nayeon,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'nayeon.kang@sori.fake',  '', '2026-02-01 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2026-02-01 00:00:00+00', NOW()),
  (u_jieun,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jieun.jo@sori.fake',     '', '2026-02-10 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2026-02-10 00:00:00+00', NOW()),
  (u_daniel,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'daniel.kim@sori.fake',   '', '2025-10-01 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-10-01 00:00:00+00', NOW()),
  (u_kevin,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'kevin.lee@sori.fake',    '', '2025-10-12 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-10-12 00:00:00+00', NOW()),
  (u_eric,    '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'eric.park@sori.fake',    '', '2025-10-20 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-10-20 00:00:00+00', NOW()),
  (u_jason,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'jason.choi@sori.fake',   '', '2025-11-03 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-11-03 00:00:00+00', NOW()),
  (u_brian,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'brian.yoo@sori.fake',    '', '2025-11-11 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-11-11 00:00:00+00', NOW()),
  (u_emily,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'emily.jung@sori.fake',   '', '2025-11-26 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-11-26 00:00:00+00', NOW()),
  (u_chloe,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'chloe.kang@sori.fake',   '', '2025-12-05 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-12-05 00:00:00+00', NOW()),
  (u_hannah,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'hannah.lee@sori.fake',   '', '2025-12-15 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2025-12-15 00:00:00+00', NOW()),
  (u_grace,   '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'grace.shin@sori.fake',   '', '2026-01-08 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2026-01-08 00:00:00+00', NOW()),
  (u_olivia,  '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'olivia.choi@sori.fake',  '', '2026-01-30 00:00:00+00', '{"provider":"email","providers":["email"]}', '{}', '2026-01-30 00:00:00+00', NOW())
ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 2. profiles
--    location_id = 1 (NYC Metro)
--    nickname    = short display name shown in UI
--    display_name = full name / longer label
--    handle      = @username (unique)
-- =============================================================================
INSERT INTO profiles (id, nickname, display_name, handle, bio, location_id, joined_at) VALUES
  -- ── 남성 5명 ─────────────────────────────────────────────────────────────────
  (u_junseo,
  'David', 'NYU David',
  'nyu_david',
  'NYU/컬럼비아 연구 교류 프로젝트 하는 CS 박사생 📚 논문 쓰다 지치면 모닝사이드 카페 투어. 한/영 섞어서 편하게 대화해요.',
   1, '2025-11-01 00:00:00+00'),

  (u_jaewon,
  'John', 'John Doe',
  'john_doe_wallst',
  'Wall St 금융권 3년차 📈 평일은 숫자, 주말은 러닝. 시민권 준비/커리어 고민 같이 나눠요. 영어 댓글도 환영!',
   1, '2025-11-15 00:00:00+00'),

  (u_dohoon,
  '도훈K', 'Dohoon Kim',
  'dohoon_kim',
  'NYU Stern MBA 1학년 🎓 전 스타트업 PM. 비자/취업 현실 정보 모으는 중. 케이스 인터뷰 같이 연습할 분 찾습니다.',
   1, '2025-12-01 00:00:00+00'),

  (u_hyunsoo,
  'Alex', 'Alex Park',
  'alex_hypark',
  'NYC 시니어 개발자 5년차 💻 React/Python. Hell''s Kitchen 거주. 퇴근 후 맥주와 사이드프로젝트가 취미입니다.',
   1, '2025-12-10 00:00:00+00'),

  (u_minho,
  '민호', 'Minho Jang MD',
  'dr_minho_jang',
  'NYU 내과 레지던트 🏥 교대근무 중에도 버티는 중. 의료/비자/뉴욕 생존팁 서로 공유해요. 플러싱 국밥 러버.',
   1, '2025-12-20 00:00:00+00'),

  -- ── 여성 5명 ─────────────────────────────────────────────────────────────────
  (u_ayeon,
  'Ari', 'Ari Seo',
  'ari_seo_nyc',
  '컬럼비아 국제관계학 석사 🌍 낮엔 논문, 밤엔 뉴욕 산책. 해외생활 외로움과 커리어 고민 같이 이야기하고 싶어요.',
   1, '2026-01-05 00:00:00+00'),

  (u_yujin,
  'Yujin', 'Yujin Han',
  'yujin_han',
  'SoHo 마케팅 직장인 🗞️ K-패션/브랜딩 덕후. 평일은 일, 주말은 갤러리 투어. 뉴욕 생활 4년차.',
   1, '2026-01-15 00:00:00+00'),

  (u_sohee,
  'Sophie', 'Sophie Lim',
  'sophie_lim_nyu',
  'NYU 회계 석사 2학년 📊 CPA 준비 중. 시험 시즌엔 커피와 편의점 과자로 생존합니다. 유학생 정보 공유 환영.',
   1, '2026-01-20 00:00:00+00'),

  (u_nayeon,
  'Nayeon', 'Nayeon Kang',
  'nayeon_kang',
  '맨해튼 로펌 paralegal 📝 LSAT 준비 중. Midtown East 거주. 하우징/커리어/비자 이슈 정리해서 나누는 걸 좋아해요.',
   1, '2026-02-01 00:00:00+00'),

  (u_jieun,
  'Jieun', 'Jieun Jo',
  'jieunjo_lens',
  'Brooklyn 프리랜서 포토그래퍼 📷 브랜드 촬영/인물 촬영 작업합니다. 뉴욕의 빛과 사람을 기록하는 중.',
   1, '2026-02-10 00:00:00+00')

  ,(u_daniel,
  'Daniel', 'Daniel Kim',
  'daniel_kim_nyc',
  'NYU Tisch 출신 영상 디렉터 🎬 브루클린에서 광고/뮤직비디오 촬영. O-1 준비 중이라 같은 케이스 찾고 있어요.',
   1, '2025-10-01 00:00:00+00')

  ,(u_kevin,
  'Kevin', 'Kevin Lee',
  'kevin_lee_astoria',
  'Astoria 거주 데이터 애널리스트 📊 평일엔 SQL, 주말엔 배드민턴. 룸메이트/이사 정보 자주 공유합니다.',
   1, '2025-10-12 00:00:00+00')

  ,(u_eric,
  'Eric', 'Eric Park',
  'eric_park_pm',
  '핀테크 PM 4년차. H1B 로터리 2회 경험자 😵 뉴욕 이직/비자 전략 같이 얘기해요.',
   1, '2025-10-20 00:00:00+00')

  ,(u_jason,
  'Jason', 'Jason Choi',
  'jason_choi_fit',
  'FIT MBA + 패션 이커머스 운영. 커리어 전환 중이라 뉴욕 취업 네트워킹 정보 모으는 중입니다.',
   1, '2025-11-03 00:00:00+00')

  ,(u_brian,
  'Brian', 'Brian Yoo',
  'brian_yoo_med',
  '브롱크스 의대 4학년 🩺 Match 시즌 생존기 공유합니다. 의료 커리어 고민 환영.',
   1, '2025-11-11 00:00:00+00')

  ,(u_emily,
  'Emily', 'Emily Jung',
  'emily_jung_lic',
  'LIC 거주 제품 디자이너 ✨ Figma/UX 덕후. 조용하고 깔끔한 하우스메이트 선호해요.',
   1, '2025-11-26 00:00:00+00')

  ,(u_chloe,
  'Chloe', 'Chloe Kang',
  'chloe_kang_col',
  '컬럼비아 국제정책 석사생. CPT/인턴십 준비하며 커버레터 지옥 체험 중입니다 😅',
   1, '2025-12-05 00:00:00+00')

  ,(u_hannah,
  'Hannah', 'Hannah Lee',
  'hannah_lee_queens',
  'Queens 로컬 마케터 📣 이사/생활비 꿀팁 수집가. 뉴욕에서 가성비 있게 사는 법 공유해요.',
   1, '2025-12-15 00:00:00+00')

  ,(u_grace,
  'Grace', 'Grace Shin',
  'grace_shin_nyc',
  '맨해튼 호텔 업계 근무. 야간 근무 많아서 생활패턴 비슷한 친구 찾는 중. 뉴욕 외로움 토크 환영.',
   1, '2026-01-08 00:00:00+00')

  ,(u_olivia,
  'Olivia', 'Olivia Choi',
  'olivia_choi_bk',
  'DUMBO 거주 콘텐츠 에디터. 브루클린 카페/코워킹 스팟 리뷰가 취미예요 ☕',
   1, '2026-01-30 00:00:00+00')

ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 3. posts (10 total — NYC-focused, within last 30 days)
--    region_id = 1 → NYC Metro
--    category values must match post_categories.value FK
-- =============================================================================
INSERT INTO posts (id, user_id, category, title, content, tags, like_count, comment_count, created_at, region_id) VALUES

  -- ── np01: 룸메이트 구인 ─ Hell's Kitchen (박현수) ─────────────────────────
  (np01, u_hyunsoo, 'realestate',
   '[룸메이트 구해요] Hell''s Kitchen 2BR — 직장인/대학원생 선호',
   E'안녕하세요! 맨해튼 Hell''s Kitchen(10th Ave & 48th St 근처) 2BR에서 룸메이트 한 분 구합니다.\n\n📍 위치: Hell''s Kitchen — A/C/E, 1 라인 도보 10분\n🏠 개인 침실 약 130sqft + 공용 거실·주방\n💰 월세: $1,650 (전기·인터넷 공용비 약 $50 추가)\n📅 입주: 4월 1일 이후 (협의 가능)\n\n함께 사실 분 조건:\n- 직장인 또는 대학원생 선호\n- 비흡연자, 반려동물 없으신 분\n- 집 깨끗하게 쓰시는 분\n- 주중 늦게까지 파티하시는 분은 어려울 것 같아요 ㅎㅎ\n\n저는 IT 회사 시니어 개발자로 출퇴근 규칙적이고 조용히 사는 편이에요. 주말엔 친구들 소소하게 부르는 정도예요.\n\n관심 있으신 분 댓글이나 DM 주세요!',
   ARRAY['룸메이트','헬스키친','맨해튼','구인'], 8, 0,
   NOW() - INTERVAL '30 days 3 hours', 1),

  -- ── np02: 룸메이트 구인 ─ Washington Heights (서아연) ────────────────────
  (np02, u_ayeon, 'realestate',
   '[룸메이트] Washington Heights 방 하나 구해요 — 여성분 환영 🙏',
   E'컬럼비아 다니는 대학원생인데요, 학교 근처 Washington Heights에서 3BR 아파트 방 하나 남아서 구합니다.\n\n📍 위치: Washington Heights (181st St A역 도보 3분)\n🏠 개인 침실 (창문 있음, 붙박이 클로젯)\n💰 월세: $1,200 (all utilities included! 🎉)\n📅 입주: 즉시 가능\n\n현재 사는 사람: 저(컬럼비아 석사 여학생) + 컬럼비아 박사 여학생 1명\n\n함께 사실 분:\n- 여성분 선호 (양해 부탁드려요)\n- 학생·직장인 모두 환영\n- 규칙적인 생활 하시는 분\n- 주방 깨끗하게 쓰시는 분\n\n학교 근처라 조용하고 치안도 괜찮아요. 공원 가까워서 산책하기도 좋고요.\n연락 주세요!',
   ARRAY['룸메이트','워싱턴하이츠','컬럼비아','여성룸메이트'], 11, 0,
   NOW() - INTERVAL '27 days 5 hours', 1),

  -- ── np03: 비자 ─ OPT/H1B (김도훈) ────────────────────────────────────────
  (np03, u_dohoon, 'visa',
   'NYU MBA 졸업 후 OPT — STEM 연장 안 되면 어떡하죠? 😥',
   E'안녕하세요, NYU Stern MBA 다니는 학생입니다.\n\nMBA는 보통 STEM OPT 연장이 안 된다고 알고 있어요 (일부 STEM designation 받은 프로그램 제외). 그러면 OPT 1년밖에 없잖아요.\n\nH1B 로터리 당첨 확률이 30%도 안 되는 상황에서 졸업 후 플랜이 너무 막막합니다. 주변에 MBA 졸업하고 H1B 못 받은 분들 어떻게 하셨나요?\n\n고려 중인 옵션들:\n- 캐나다 취업 후 TN visa로 미국 복귀?\n- O1 비자는 현실적으로 어떤가요?\n- 스폰서 없이 가능한 비자가 있나요?\n\n뉴욕에서 MBA 졸업하신 선배님들 조언 간절히 부탁드립니다. 졸업이 4개월 남았는데 너무 불안하네요.',
   ARRAY['비자','H1B','OPT','MBA','취업'], 29, 0,
   NOW() - INTERVAL '25 days 2 hours', 1),

  -- ── np04: 비자 ─ F1 갱신 (임소희) ───────────────────────────────────────
  (np04, u_sohee, 'visa',
   'F1 비자 만료 — 미국에서 갱신이 안 된다는데 어떻게 하셨어요?',
   E'안녕하세요! 뉴욕에서 대학원 다니고 있는 학생입니다.\n\nF1 비자 만료일이 올 여름이에요. 아는 바로는 F1 비자 스티커 갱신은 미국 밖에서 해야 한다고 하는데요.\n\n궁금한 점들:\n1. 비자 스티커가 만료돼도 I-20 유효하면 미국 내에서 공부 계속 할 수 있나요?\n2. 한국에 잠깐 갔다 와서 갱신하는 게 제일 확실한가요?\n3. 캐나다나 멕시코에서 당일 갱신 받아보신 분 계신가요? 실제로 됐나요?\n\n여름에 한국 가기가 여의치 않아서 가능하면 다른 방법 찾고 있어요. 비슷한 상황 겪어보신 분들 경험 공유해 주시면 너무 감사하겠어요!',
   ARRAY['비자','F1','비자갱신','유학생'], 17, 0,
   NOW() - INTERVAL '22 days 4 hours', 1),

  -- ── np05: 자유게시판 ─ 외로움 (서아연) ───────────────────────────────────
  (np05, u_ayeon, 'general',
   '뉴욕 와서 처음으로... 많이 외롭다는 걸 느꼈어요',
   E'컬럼비아 대학원 2학년인데요, 요즘 갑자기 좀 외로워졌어요.\n\n1학년 때는 새로운 것에 적응하느라 바빠서 몰랐는데, 이제 어느 정도 루틴이 생기고 나니 빈 시간들이 느껴지더라고요. 논문 쓰고, 수업 듣고, 가끔 도서관 카페에서 친구랑 커피 마시고... 그런데 한국에서처럼 깊게 연결된 친구가 없는 느낌이에요.\n\n룸메이트는 중국 친구들이라 문화가 달라서 깊은 대화를 나누기가 어렵고, 학과 사람들은 다 바쁘고요.\n\n한국에 있을 때 당연하게 있던 것들이 너무 그리워요.\n치킨 시켜먹으면서 드라마 보는 것, 새벽에 편의점 가는 것, 아무 이유 없이 만나는 친구들...\n\n여기 계신 분들은 이런 외로움 어떻게 극복하셨나요? 🥺',
   ARRAY['외로움','뉴욕생활','유학생','이민생활'], 38, 0,
   NOW() - INTERVAL '20 days 6 hours', 1),

  -- ── np06: 자유게시판 ─ 박사 후기 (이준서) ──────────────────────────────
  (np06, u_junseo, 'general',
   '뉴욕 PhD 생활 1년 반 솔직 후기 — 좋은 것과 힘든 것',
   E'컬럼비아 CS 박사 2년차인데 솔직한 후기 써볼게요.\n\n✅ 좋은 것들\n- 연구 환경이 진짜 최고예요. 교수님들 수준, 시설, 네트워크 다 넘사벽\n- 뉴욕이라는 도시 자체. 지루할 틈이 없어요. 박물관, 공연, 음식...\n- 장학금 + stipend로 생활은 됨 (빠듯하지만)\n- 다양한 배경의 사람들을 만날 수 있는 환경\n\n❌ 힘든 것들\n- 논문 압박이 상상 이상이에요. advisor 미팅이 제일 무서워요\n- 진도가 안 나오면 나만 뒤처지는 것 같은 느낌\n- 한국 음식이 너무 그리워요. 플러싱 가면 좀 낫긴 한데 비싸고 멀고...\n- 동기들끼리 경쟁하면서도 친해야 하는 어색한 관계\n- 가족·친구들이랑 시차 때문에 연락하기 어려운 것\n\n같은 처지인 분들 있으시면 얘기 나눠요!',
   ARRAY['박사생활','뉴욕','컬럼비아','대학원'], 25, 0,
   NOW() - INTERVAL '17 days 1 hour', 1),

  -- ── np07: 자유게시판 ─ 뉴욕 3년 (조지은) ──────────────────────────────
  (np07, u_jieun, 'general',
   '뉴욕에서 3년... 한국에 돌아가야 할지 모르겠어요',
   E'뉴욕 온 지 3년 됐어요. 사진 찍고 편집하면서 프리랜서로 먹고 살고 있는데요.\n\n처음 왔을 때는 이곳이 세계의 중심 같고, 내가 꿈을 이루고 있다는 느낌이었어요. 그런데 요즘은 솔직히 많이 지쳐요.\n\n수입도 불안정하고, 친구들은 다 바쁘고, 가끔 센트럴파크에서 사진 찍으면서 "나 여기서 뭐 하고 있나" 싶기도 하고요.\n\n한국 돌아간 친구들 보면 월급은 안정적이고, 부모님 근처에 살고, 친구들이랑 자주 만나는 그런 삶이 가끔 진짜 부러워요. 근데 또 한국 돌아가면 후회할 것 같은 느낌도 있고.\n\n뉴욕에서 오래 사신 분들, 이런 감정 어떻게 극복하셨나요? 아니면 그냥 안고 사시나요?',
   ARRAY['뉴욕생활','이민생활','프리랜서','귀국고민'], 33, 0,
   NOW() - INTERVAL '15 days 4 hours', 1),

  -- ── np08: 룸메이트 구인 ─ Midtown East (강나연) ──────────────────────────
  (np08, u_nayeon, 'realestate',
   '[룸메이트] Midtown East 2BR — 직장 여성분 구해요',
   E'Midtown East (2nd Ave & 49th St 근처) 2BR에서 룸메이트 한 분 구합니다.\n\n📍 위치: Midtown East — E/M, 6 라인 도보 5분\n🏠 개인 침실 (창문 있음, 퀸사이즈 침대 구비)\n💰 월세: $1,750 (전기 따로, 인터넷 공용)\n📅 입주: 4월 1일부터\n\n저는 로펌 paralegal이고 집에서 조용히 지내는 편이에요.\n\n함께 사실 분:\n- 직장 여성분 선호 (남성 지원 어려워요, 양해 부탁드려요)\n- 비흡연자\n- 집 깔끔하게 쓰시는 분\n- 야간 파티 NO\n\nMidtown이라 편의시설 다 가깝고 교통도 최고예요. 관심 있으시면 댓글이나 DM 주세요!',
   ARRAY['룸메이트','미드타운','맨해튼','직장여성'], 9, 0,
   NOW() - INTERVAL '12 days 2 hours', 1),

  -- ── np09: 자유게시판 ─ 레지던트 (장민호) ──────────────────────────────
  (np09, u_minho, 'general',
   '뉴욕에서 레지던트 하는 게 이렇게 힘든 줄 몰랐어요 ㅠㅠ',
   E'NYU 내과 레지던트 1년차 중반인데 솔직히 죽겠어요.\n\n36시간 연속 근무 끝나고 집에 오면 그냥 쓰러져요. 먹는 것도 대충, 씻는 것도 대충...\n\n한국에서 의대 다닐 때도 힘들었지만, 뉴욕에서 영어로 레지던트 하는 건 차원이 다른 것 같아요. 환자랑 소통할 때도 문화 차이가 있고, attending 눈치도 봐야 하고.\n\n그나마 한인 선배 레지던트 한 명이 있어서 가끔 플러싱 가서 순대국밥 먹으면 살 것 같아요 ㅋㅋ\n\n근데 진짜 이거 3년 더 버틸 수 있을지 모르겠어요. 비슷한 처지인 분들... 소주 한 잔 같이 해요 😢',
   ARRAY['레지던트','뉴욕의대','의사','이민생활'], 42, 0,
   NOW() - INTERVAL '8 days 3 hours', 1),

  -- ── np10: 비자 ─ 시민권 합격 (최재원) ───────────────────────────────────
  (np10, u_jaewon, 'visa',
   '시민권 N-400 인터뷰 통과했어요!! 경험 공유합니다 🎉🇺🇸',
   E'드디어 시민권 인터뷰 통과했어요!! 준비하시는 분들 도움이 됐으면 해서 공유합니다.\n\n📅 타임라인\n- N-400 접수: 작년 9월\n- 생체 정보 등록: 10월\n- 인터뷰 통지: 올해 1월\n- 인터뷰: 2월 중순\n- 합격 통지: 지난주\n\n📋 인터뷰 당일\n- 맨해튼 USCIS 오피스 (26 Federal Plaza)\n- 담당 심사관이 친절하게 해주셨어요\n- 영어 읽기/쓰기 테스트: 쉬운 문장 하나씩 (매우 쉬움)\n- 공민 테스트: 100문제 중 10개 뽑아서 6개 이상 맞추면 합격 (저는 10/10!)\n- 전체 소요 시간: 40분\n\n💡 준비 팁\n- USCIS 공식 앱으로 100개 문제 다 외우기 (앱 완전 유용해요)\n- 여행 내역·세금 신고 내역 꼼꼼히 체크 (중요!)\n- 인터뷰 때 긴장하지 말고 모르면 솔직하게\n\n다음 달 선서식 예정이에요. 뉴욕에서 10년 만에 미국 시민이 됐네요!',
   ARRAY['시민권','N400','이민','USCIS'], 31, 0,
   NOW() - INTERVAL '5 days 1 hour', 1)

  ,(np11, u_emily, 'realestate',
   '[룸메이트] Long Island City 2BR — 디자이너 직장인 환영',
   E'LIC Court Sq 도보 6분 2BR에서 4월 중순 입주 가능한 룸메이트 구해요.\n\n월세 $1,700 + 유틸 분담, 개인방 창문/클로젯 있음.\n저는 제품 디자이너라 재택이 주 2일 있어요. 집 조용하고 깔끔하게 쓰실 분이면 좋겠습니다.\n\n지하철(E/M/7/G) 접근 좋아서 맨해튼 출퇴근 정말 편해요.',
   ARRAY['룸메이트','LIC','퀸즈','직장인'], 7, 0,
   NOW() - INTERVAL '14 days 2 hours', 1)

  ,(np12, u_kevin, 'realestate',
   'Astoria 1BR 서브렛 구합니다 (2개월)',
   E'5월-6월 2개월만 Astoria 1BR 서브렛 구해요. 예산은 월 $2,200 이하이고 N/W 라인 근처면 좋습니다.\n\n재택 많아서 인터넷 안정성 중요하고, 가구 포함이면 더 좋습니다. 추천 주시면 감사하겠습니다!',
   ARRAY['서브렛','아스토리아','퀸즈'], 5, 0,
   NOW() - INTERVAL '11 days 6 hours', 1)

  ,(np13, u_daniel, 'visa',
   'O-1 비자 포트폴리오 준비, 어떤 자료가 제일 중요했나요?',
   E'영상 디렉터로 O-1 비자 준비 중입니다. 에이전시에서 기사/수상/심사위원 경력/레터를 강조하던데, 실제 승인 받으신 분들은 어떤 자료가 결정적이었나요?\n\n뉴욕에서 변호사 비용도 천차만별이라 경험담 부탁드립니다.',
   ARRAY['O1','비자','포트폴리오','이민변호사'], 14, 0,
   NOW() - INTERVAL '18 days 7 hours', 1)

  ,(np14, u_eric, 'visa',
   'H1B 로터리 2년 연속 탈락... 다음 플랜 뭐가 현실적일까요',
   E'H1B 로터리 2년 연속 탈락했습니다. 지금은 STEM OPT 1년 남은 상태예요.\n\n회사에서는 해외 오피스(토론토) 전환을 제안했는데, 장기적으로 미국 복귀를 노리려면 어떤 전략이 좋을지 고민입니다.\n경험 있으신 분들 진짜 조언 부탁드립니다.',
   ARRAY['H1B','OPT','캐나다오피스'], 19, 0,
   NOW() - INTERVAL '9 days 3 hours', 1)

  ,(np15, u_grace, 'general',
   '뉴욕 밤근무 끝나고 집 오면 너무 공허해요',
   E'호텔 야간 근무 끝나고 새벽에 집 오면 잠도 안 오고, 연락할 사람도 없고 멍해질 때가 많아요.\n뉴욕이 화려한데도 왜 이렇게 혼자인 느낌일까요. 비슷한 루틴 사는 분 계신가요?',
   ARRAY['외로움','야간근무','뉴욕생활'], 22, 0,
   NOW() - INTERVAL '6 days 9 hours', 1)

  ,(np16, u_jason, 'jobs',
   '패션 업계에서 데이터 직무로 커리어 전환 가능할까요?',
   E'현재 패션 이커머스 운영 쪽인데 데이터 분석/그로스 직무로 옮기고 싶습니다.\nSQL, GA4, Looker 쪽 공부 중인데 포트폴리오를 어떤 식으로 보여줘야 뉴욕 채용에서 먹히는지 궁금합니다.',
   ARRAY['커리어전환','패션','데이터'], 13, 0,
   NOW() - INTERVAL '16 days 5 hours', 1)

  ,(np17, u_olivia, 'general',
   '브루클린에서 조용히 일할 카페/코워킹 추천 부탁해요',
   E'DUMBO/윌리엄스버그 근처에서 글쓰기 하기 좋은 공간 찾고 있어요.\n와이파이 안정적이고 콘센트 많은 곳이면 최고입니다.\n유료 코워킹도 괜찮아요.',
   ARRAY['브루클린','카페','코워킹'], 10, 0,
   NOW() - INTERVAL '4 days 8 hours', 1)

  ,(np18, u_hannah, 'realestate',
   'Queens 이사 후기: LIC보다 Sunnyside가 체감 생활비 훨씬 낮네요',
   E'최근 LIC에서 Sunnyside로 옮겼는데 월세/식비/생활비가 생각보다 많이 줄었어요.\n맨해튼 접근성도 7라인으로 크게 나쁘지 않고요.\n뉴욕에서 가성비 거주지 찾는 분들 참고하세요!',
   ARRAY['퀸즈','이사후기','생활비'], 16, 0,
   NOW() - INTERVAL '13 days 4 hours', 1)

  ,(np19, u_brian, 'jobs',
   'USMLE Step2 끝난 분들, Match 인터뷰 준비 어떻게 하셨나요?',
   E'의대 4학년이라 Match 시즌 앞두고 인터뷰 준비 중입니다.\n특히 behavioral 질문(팀 갈등, 실패 경험) 답변 구조를 어떻게 잡아야 하는지 고민이에요.\n미국 병원 인터뷰 경험 있는 분들 팁 부탁드립니다.',
   ARRAY['USMLE','Match','의대'], 12, 0,
   NOW() - INTERVAL '7 days 7 hours', 1)

  ,(np20, u_chloe, 'visa',
   'CPT 인턴십 승인까지 보통 며칠 걸리나요?',
   E'이번 학기 여름 인턴 오퍼를 받았는데 CPT 승인 타임라인이 촉박해서 걱정입니다.\n학교 국제처는 5-10 business days라고 하는데 실제로는 더 걸리는지 궁금해요.\n컬럼비아/NYU 경험담 있으면 부탁드려요!',
   ARRAY['CPT','유학생','인턴십'], 9, 0,
   NOW() - INTERVAL '3 days 11 hours', 1)

ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 4. comments + replies (52 total)
--    댓글은 원글보다 몇 시간~며칠 뒤에 달림
-- =============================================================================
INSERT INTO comments (id, post_id, user_id, parent_id, content, created_at) VALUES

  -- ── np01: Hell's Kitchen 룸메이트 ───────────────────────────────────────
  (nc01, np01, u_ayeon,   NULL,  '위치 너무 좋아 보여요! Hell''s Kitchen 치안 어때요? 저도 이사 고민 중이라서요.', NOW() - INTERVAL '29 days 20 hours'),
  (nc02, np01, u_junseo,  NULL,  '저 학생인데 지원해도 될까요? 컬럼비아 박사 과정인데 조용히 지내는 편이에요. 졸업 전까지 약 2년 있을 예정이에요.', NOW() - INTERVAL '29 days 18 hours'),
  (nc03, np01, u_hyunsoo, nc02,  '네 당연하죠! 학생분도 환영해요. DM 주세요~ 😊', NOW() - INTERVAL '29 days 17 hours'),
  (nc04, np01, u_yujin,   nc01,  'Hell''s Kitchen 저도 근처에 직장이 있는데 치안 꽤 괜찮아요. 밤에 혼자 걸어도 생각보다 안 무서워요.', NOW() - INTERVAL '29 days 15 hours'),

  -- ── np02: Washington Heights 룸메이트 ───────────────────────────────────
  (nc05, np02, u_sohee,   NULL,  '저 관심 있어요!! 저도 NYU 학생인데 월세가 너무 매력적이네요. A 트레인으로 컬럼비아까지 몇 분 걸려요?', NOW() - INTERVAL '26 days 22 hours'),
  (nc06, np02, u_ayeon,   nc05,  'A 트레인으로 컬럼비아-Morningside Heights역까지 15분 정도요 :) NYU는 좀 멀 수 있는데... DM 주세요!', NOW() - INTERVAL '26 days 20 hours'),
  (nc07, np02, u_yujin,   NULL,  'Washington Heights 치안이 좀 걱정돼서요. 혼자 밤에 다니기 많이 불안하지 않아요?', NOW() - INTERVAL '26 days 18 hours'),
  (nc08, np02, u_ayeon,   nc07,  '솔직히 낮에는 완전 괜찮고, 자정 넘어서는 조금 조심하는 편이에요. 181st 역 바로 근처는 생각보다 괜찮아요 😊', NOW() - INTERVAL '26 days 16 hours'),

  -- ── np03: OPT/H1B ───────────────────────────────────────────────────────
  (nc09, np03, u_junseo,  NULL,  '저도 비슷하게 고민했어요 (CS라 STEM OPT는 되지만). 주변에 MBA 졸업 후 캐나다 IT 회사 취업해서 LMIA로 취업비자 받고 미국 재입국한 케이스 있어요. 현실적인 경로예요.', NOW() - INTERVAL '24 days 21 hours'),
  (nc10, np03, u_dohoon,  nc09,  '오 진짜요? LMIA 프로세스가 복잡하다고 들었는데 실제로 가능한 경로인가요? 캐나다 취업이 어렵지는 않던가요?', NOW() - INTERVAL '24 days 19 hours'),
  (nc11, np03, u_junseo,  nc10,  '회사가 스폰서 의지만 있으면 가능해요. 준비 기간이 6~12개월 걸리는 게 단점이고요. LinkedIn에서 캐나다 회사들도 보시면 꽤 있어요.', NOW() - INTERVAL '24 days 17 hours'),
  (nc12, np03, u_jaewon,  NULL,  'O1 생각보다 가능 범위가 넓어요. MBA면 회사에서 수상 이력이나 언론 피처링 등 있으면 신청 가능한 케이스도 꽤 많아요. 이민 변호사 상담 한번 받아보세요. 1시간에 $350~500 정도지만 충분히 가치 있어요.', NOW() - INTERVAL '24 days 15 hours'),
  (nc13, np03, u_hyunsoo, NULL,  'LinkedIn에 "visa sponsorship" 필터 ON 하시면 스폰서 해주는 회사 바로 나와요. 생각보다 많아서 놀라실 거예요.', NOW() - INTERVAL '23 days 20 hours'),

  -- ── np04: F1 비자 갱신 ──────────────────────────────────────────────────
  (nc14, np04, u_dohoon,  NULL,  'F1은 미국 내 비자 갱신 불가지만, I-20 유효하고 학교에 정식 등록돼 있으면 신분(Status)은 유지돼요. 비자 스티커 없이 공부는 계속 가능해요. 다만 출국 후 재입국하려면 유효한 비자 스티커 필요해요.', NOW() - INTERVAL '21 days 22 hours'),
  (nc15, np04, u_sohee,   nc14,  '아 그렇군요! 그럼 여름에 한국 다녀오면서 갱신하면 되겠네요. 확실히 알게 됐어요. 감사해요! 🙏', NOW() - INTERVAL '21 days 20 hours'),
  (nc16, np04, u_nayeon,  NULL,  '법적으로 비자 스티커와 이민 신분은 다른 개념이에요. I-20 유효 + 재학 중이면 legally 괜찮지만, 정확한 본인 상황은 이민법 전문 변호사 상담 꼭 받아보세요. 잘못 이해하면 나중에 문제될 수 있어요.', NOW() - INTERVAL '21 days 18 hours'),
  (nc17, np04, u_ayeon,   NULL,  '작년에 저도 비슷한 상황이었는데 캐나다 토론토 영사관에서 갱신했어요! 아침 일찍 예약하면 당일 처리도 됐어요. 비자 수수료 $160에 버스+숙박 포함해도 한국 왕복보다 훨씬 저렴했어요.', NOW() - INTERVAL '21 days 15 hours'),

  -- ── np05: 외로움 ────────────────────────────────────────────────────────
  (nc18, np05, u_nayeon,  NULL,  '저도 4년째 뉴욕인데 아직도 깊은 친구 사귀기 어려워요. 저는 한인 독서 모임에서 제일 친한 친구를 만났어요. 관심사 기반 모임에 나가보시는 거 추천해요.', NOW() - INTERVAL '19 days 22 hours'),
  (nc19, np05, u_junseo,  NULL,  '외로움도 적응의 한 과정인 것 같아요. 저는 6개월이 제일 힘들었는데 1년 넘어가니까 "뉴요커의 고독"을 나름 즐기게 됐달까요 ㅎㅎ 시간이 약인 것 같아요.', NOW() - INTERVAL '19 days 20 hours'),
  (nc20, np05, u_ayeon,   nc19,  '"뉴요커의 고독"이라는 표현 너무 좋네요 😊 저도 그렇게 생각하면 좀 편해질 것 같아요. 고마워요.', NOW() - INTERVAL '19 days 18 hours'),
  (nc21, np05, u_minho,   NULL,  '저도 그 마음이에요... 레지던트라 시간도 없어서 친구 사귀기가 더 어렵더라고요. 언젠가 같이 플러싱 순대국밥 한 번 가요! 진지하게요 ㅋㅋ', NOW() - INTERVAL '19 days 16 hours'),
  (nc22, np05, u_ayeon,   nc21,  'ㅋㅋㅋ 그거 진짜 좋은데요! 소리에 DM 기능 생기면 연락해요 👍', NOW() - INTERVAL '19 days 14 hours'),
  (nc23, np05, u_yujin,   NULL,  '공감 너무 돼요. 저도 처음엔 그랬어요. 혹시 관심 있으시면 뉴욕 한인 여성분들끼리 소모임 만들어볼까요? 제가 한번 추진해볼게요!', NOW() - INTERVAL '19 days 12 hours'),
  (nc24, np05, u_sohee,   nc23,  '저도 꼭 끼고 싶어요!! 어디서 만나요? 👋', NOW() - INTERVAL '19 days 10 hours'),
  (nc25, np05, u_ayeon,   nc23,  '완전 찬성이요!! DM으로 연락해요 😄', NOW() - INTERVAL '19 days 8 hours'),

  -- ── np06: 박사 후기 ─────────────────────────────────────────────────────
  (nc26, np06, u_ayeon,   NULL,  '공감 100%예요. 진도 안 나올 때 나만 뒤처지는 느낌이 제일 싫어요... 석사지만 비슷한 압박이에요. 같이 힘내요 📚', NOW() - INTERVAL '16 days 22 hours'),
  (nc27, np06, u_dohoon,  NULL,  '가족이랑 시차 때문에 연락하기 어려운 거 너무 공감돼요. 부모님이 낮에 전화하시는데 저는 수업 중이고... 이게 제일 마음이 아파요.', NOW() - INTERVAL '16 days 20 hours'),
  (nc28, np06, u_jaewon,  NULL,  '이런 커뮤니티가 있어서 좋네요. 학교든 회사든 서로 응원하면서 살아요!', NOW() - INTERVAL '16 days 18 hours'),
  (nc29, np06, u_jieun,   NULL,  '연구 환경이 최고라는 부분 솔직히 부러워요 ㅜㅜ 저는 프리랜서라 혼자 다 알아서 해야 하다 보니 네트워크가 너무 그리워요.', NOW() - INTERVAL '16 days 16 hours'),
  (nc30, np06, u_junseo,  nc29,  '학계 네트워크가 생각보다 큰 자산이에요. 지도 교수님 통해서 인턴도 연결되고, 선배들이 끌어주는 경우도 많아요. LinkedIn 적극 활용 추천해요!', NOW() - INTERVAL '16 days 14 hours'),

  -- ── np07: 뉴욕 3년 ──────────────────────────────────────────────────────
  (nc31, np07, u_ayeon,   NULL,  '저도 아직 2년이지만 그 감정 이해해요. 한국 돌아가면 분명히 뉴욕이 그리울 것 같기도 하고… 양쪽 다 그리운 게 제일 힘든 것 같아요.', NOW() - INTERVAL '14 days 22 hours'),
  (nc32, np07, u_junseo,  NULL,  '졸업 후 한국 가야 할지 여기 있어야 할지 저도 매일 고민이에요. 정답이 없는 문제라서 더 어렵죠.', NOW() - INTERVAL '14 days 20 hours'),
  (nc33, np07, u_jieun,   nc32,  '맞아요. 정답이 없다는 게 제일 힘들어요 ㅠㅠ 답이 있으면 그냥 따라가면 될 텐데.', NOW() - INTERVAL '14 days 18 hours'),
  (nc34, np07, u_yujin,   NULL,  '저는 4년 됐는데 처음 2년이 제일 힘들었어요. 뉴욕에서 나만의 찐 루틴을 만들고 나서 달라졌어요. 도시와 내가 맞아들어가는 느낌이랄까요. 브런치 카페, 산책 코스... 작은 것부터 만들어 보세요 🙂', NOW() - INTERVAL '14 days 15 hours'),
  (nc35, np07, u_jieun,   nc34,  '그 표현 너무 좋아요. 저도 브루클린 루틴 다시 만들어봐야겠어요 🙏', NOW() - INTERVAL '14 days 12 hours'),
  (nc36, np07, u_nayeon,  NULL,  '저는 5년째인데 솔직히 한국 돌아가고 싶을 때 분명히 있어요. 근데 또 막상 들어가면 뉴욕 그리울 거라는 걸 경험으로 알아서 ㅋㅋ 양쪽 다 그리운 게 이민자의 숙명인 것 같아요.', NOW() - INTERVAL '14 days 10 hours'),

  -- ── np08: Midtown East 룸메이트 ─────────────────────────────────────────
  (nc37, np08, u_yujin,   NULL,  '저 아는 분이 미드타운 방 찾고 있었는데! 위치 완전 좋네요. 연락처 공유해줘도 될까요?', NOW() - INTERVAL '11 days 22 hours'),
  (nc38, np08, u_nayeon,  nc37,  '네 그 분한테 제 DM으로 연락처 알려주시거나 직접 DM 주시라고 해주세요!', NOW() - INTERVAL '11 days 20 hours'),
  (nc39, np08, u_sohee,   NULL,  '저 관심 있어요!! 여성이고 NYU 학생이에요 — 조건 다 맞는 것 같아요. DM 드려도 될까요? 🥺', NOW() - INTERVAL '11 days 18 hours'),
  (nc40, np08, u_nayeon,  nc39,  '네 DM 주세요! 소개 간략히 적어주시면 좋겠어요 :)', NOW() - INTERVAL '11 days 16 hours'),

  -- ── np09: 레지던트 ──────────────────────────────────────────────────────
  (nc41, np09, u_ayeon,   NULL,  '진짜ㅠㅠ 레지던트가 그렇게까지 힘드신 줄 몰랐어요. 몸 관리 꼭 하세요. 응원해요! 💙', NOW() - INTERVAL '7 days 22 hours'),
  (nc42, np09, u_junseo,  NULL,  '진짜 존경스러워요. 논문 쓰는 게 힘들다고 했는데 레지던트에 비하면 별거 아닌 것 같아요. 플러싱 순대국밥 같이 가요 진짜로!', NOW() - INTERVAL '7 days 20 hours'),
  (nc43, np09, u_minho,   nc42,  'ㅋㅋㅋ 좋아요! 다음 off day에 연락해요. 벌써 기대돼요 🍲', NOW() - INTERVAL '7 days 18 hours'),
  (nc44, np09, u_jaewon,  NULL,  '금융권도 야근이 심하다고 생각했는데 36시간 연속 근무는 진짜... 의대 시스템이 이렇게 혹독한지 몰랐어요. 한국 레지던트랑 많이 달라요?', NOW() - INTERVAL '7 days 16 hours'),
  (nc45, np09, u_minho,   nc44,  '한국도 힘들긴 한데 여기는 언어 장벽에 문화 차이까지 있으니까 배로 힘들어요. 근데 어쩌겠어요, 버텨야죠 ㅎㅎ', NOW() - INTERVAL '7 days 14 hours'),
  (nc46, np09, u_jieun,   NULL,  '힘든 거 솔직하게 올려주셔서 감사해요. 프리랜서의 불안정이 힘들다고 생각했는데 레지던트에 비하면 별거 아닌 것 같기도... 응원합니다 💪', NOW() - INTERVAL '7 days 12 hours'),

  -- ── np10: 시민권 합격 ────────────────────────────────────────────────────
  (nc47, np10, u_hyunsoo, NULL,  '축하드려요!! 타임라인 정말 도움됐어요. 저도 내년에 신청 예정인데 기다리는 시간이 꽤 길군요.', NOW() - INTERVAL '4 days 22 hours'),
  (nc48, np10, u_jaewon,  nc47,  '기다리는 시간이 제일 지치는 것 같아요 ㅋㅋ 그냥 잊고 살다가 갑자기 통지 와서 오히려 놀랐어요. "잊어버리는 것"도 전략이에요.', NOW() - INTERVAL '4 days 20 hours'),
  (nc49, np10, u_junseo,  NULL,  '와 진짜 축하해요!! 저는 박사 끝나고 취업하고 영주권부터 받아야 해서 시민권은 아직 먼 얘기지만, 선배님 보면서 목표 생겨요 😊', NOW() - INTERVAL '4 days 18 hours'),
  (nc50, np10, u_ayeon,   NULL,  '진짜 축하드려요 🎉🇺🇸 10년 만이면 정말 오래 기다리셨겠어요. 공민 테스트 10/10 맞으신 거 대단해요!', NOW() - INTERVAL '4 days 16 hours'),
  (nc51, np10, u_jaewon,  nc50,  'USCIS 공식 앱으로 100번 넘게 반복 연습했어요 ㅋㅋ 준비 제대로 하면 어렵지 않으니까 너무 걱정 안 하셔도 돼요!', NOW() - INTERVAL '4 days 14 hours'),
  (nc52, np10, u_nayeon,  NULL,  '법적 관점에서 N-400 작성 시 가장 중요한 게 여행 내역이랑 세금 신고 내역 꼼꼼히 체크하는 거예요. 날짜 하루 틀려도 인터뷰에서 걸릴 수 있어요. 준비 잘 하신 것 같아요! 선서식 사진 올려주세요 😊', NOW() - INTERVAL '4 days 10 hours')

ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- 5. Randomize timeline
--    - profiles.joined_at: randomized in older range
--    - posts/comments: randomized within last 30 days
-- =============================================================================
UPDATE profiles
SET joined_at = NOW() - ((120 + FLOOR(random() * 240))::int || ' days')::interval
WHERE id IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);

UPDATE posts
SET created_at = NOW()
  - ((1 + FLOOR(random() * 29))::int || ' days')::interval
  - (FLOOR(random() * 23)::int || ' hours')::interval
WHERE id IN (np01, np02, np03, np04, np05, np06, np07, np08, np09, np10, np11, np12, np13, np14, np15, np16, np17, np18, np19, np20);

UPDATE comments c
SET created_at = LEAST(
  NOW() - INTERVAL '5 minutes',
  p.created_at + ((2 + FLOOR(random() * 120))::int || ' hours')::interval
)
FROM posts p
WHERE c.post_id = p.id
  AND c.parent_id IS NULL
  AND c.user_id IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);

UPDATE comments c
SET created_at = LEAST(
  NOW() - INTERVAL '1 minutes',
  pc.created_at + ((15 + FLOOR(random() * 720))::int || ' minutes')::interval
)
FROM comments pc
WHERE c.parent_id = pc.id
  AND c.user_id IN (u_junseo, u_jaewon, u_dohoon, u_hyunsoo, u_minho, u_ayeon, u_yujin, u_sohee, u_nayeon, u_jieun, u_daniel, u_kevin, u_eric, u_jason, u_brian, u_emily, u_chloe, u_hannah, u_grace, u_olivia);

-- =============================================================================
-- 6. Sync comment_count for the new posts
-- =============================================================================
UPDATE posts SET comment_count = (
  SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id
)
WHERE id IN (np01, np02, np03, np04, np05, np06, np07, np08, np09, np10, np11, np12, np13, np14, np15, np16, np17, np18, np19, np20);

END $$;