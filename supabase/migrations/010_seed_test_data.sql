-- ============================================================
-- SEED: NY / LA / SF 테스트 유저, 게시글, 댓글, 좋아요
-- profiles.id → auth.users FK 우회: session_replication_role
-- ============================================================

SET session_replication_role = replica;

-- ── Clean up ───────────────────────────────────────────────
DELETE FROM comments
WHERE
    user_id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666',
        '77777777-7777-7777-7777-777777777777',
        '88888888-8888-8888-8888-888888888888',
        '99999999-9999-9999-9999-999999999999'
    );

DELETE FROM post_likes
WHERE
    user_id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666',
        '77777777-7777-7777-7777-777777777777',
        '88888888-8888-8888-8888-888888888888',
        '99999999-9999-9999-9999-999999999999'
    );

DELETE FROM posts
WHERE
    user_id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666',
        '77777777-7777-7777-7777-777777777777',
        '88888888-8888-8888-8888-888888888888',
        '99999999-9999-9999-9999-999999999999'
    );

DELETE FROM profiles
WHERE
    id IN (
        '11111111-1111-1111-1111-111111111111',
        '22222222-2222-2222-2222-222222222222',
        '33333333-3333-3333-3333-333333333333',
        '44444444-4444-4444-4444-444444444444',
        '55555555-5555-5555-5555-555555555555',
        '66666666-6666-6666-6666-666666666666',
        '77777777-7777-7777-7777-777777777777',
        '88888888-8888-8888-8888-888888888888',
        '99999999-9999-9999-9999-999999999999'
    );

-- ── Profiles ───────────────────────────────────────────────
-- NY (region_id = 1)
INSERT INTO
    profiles (
        id,
        nickname,
        handle,
        location_id
    )
VALUES (
        '11111111-1111-1111-1111-111111111111',
        '브루클린린',
        '@brooklyn_lina',
        1
    ),
    (
        '22222222-2222-2222-2222-222222222222',
        '맨해튼맨',
        '@manhattan_mike',
        1
    ),
    (
        '33333333-3333-3333-3333-333333333333',
        '뉴저지조',
        '@nj_joe',
        1
    );

-- LA (region_id = 2)
INSERT INTO
    profiles (
        id,
        nickname,
        handle,
        location_id
    )
VALUES (
        '44444444-4444-4444-4444-444444444444',
        '할리우드하나',
        '@hollywood_hana',
        2
    ),
    (
        '55555555-5555-5555-5555-555555555555',
        '비치보이',
        '@beach_boy_la',
        2
    ),
    (
        '66666666-6666-6666-6666-666666666666',
        '다운타운댄',
        '@dtla_dan',
        2
    );

-- SF (region_id = 3)
INSERT INTO
    profiles (
        id,
        nickname,
        handle,
        location_id
    )
VALUES (
        '77777777-7777-7777-7777-777777777777',
        '실리콘신',
        '@silicon_shin',
        3
    ),
    (
        '88888888-8888-8888-8888-888888888888',
        '베이오션',
        '@bay_ocean',
        3
    ),
    (
        '99999999-9999-9999-9999-999999999999',
        '골든게이트',
        '@golden_gate_gina',
        3
    );

-- ── Posts ──────────────────────────────────────────────────
-- NY posts
INSERT INTO
    posts (
        id,
        user_id,
        title,
        content,
        category,
        region_id,
        like_count,
        comment_count
    )
VALUES (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '11111111-1111-1111-1111-111111111111',
        '뉴욕 맛있는 한식당 추천',
        '브루클린에 막 생긴 한식당 진짜 맛있어요! 비빔밥도 좋고 떡볶이도 최고 ☺️',
        'restaurant',
        1,
        3,
        2
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '22222222-2222-2222-2222-222222222222',
        '뉴욕 이민 생활 팁',
        '맨해튼에서 5년 살았는데 초보자들이 알아야 할 팁들 공유합니다. 지하철, 월세, 슈퍼마켓 등등.',
        'general',
        1,
        5,
        3
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        '33333333-3333-3333-3333-333333333333',
        '뉴저지 한인 회계사 채용',
        '뉴저지 쿡카운티에서 한인 회계사 채용 중입니다. 영어 능력과 5년 경력 요구.',
        'jobs',
        1,
        2,
        1
    );

-- LA posts
INSERT INTO
    posts (
        id,
        user_id,
        title,
        content,
        category,
        region_id,
        like_count,
        comment_count
    )
VALUES (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '44444444-4444-4444-4444-444444444444',
        'LA 부동산 시장 어떻게 생각하세요?',
        '최근 LA 집값이 좀 떨어진 것 같은데 투자하기 좋은 타이밍일까요?',
        'realestate',
        2,
        4,
        2
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '55555555-5555-5555-5555-555555555555',
        '비치 근처 피크닉 스팟 추천',
        '주말에 가족이랑 가기 좋은 비치 피크닉 장소 알려드려요! 아이들도 안전하고 좋아요.',
        'kids',
        2,
        6,
        4
    );

-- SF posts
INSERT INTO
    posts (
        id,
        user_id,
        title,
        content,
        category,
        region_id,
        like_count,
        comment_count
    )
VALUES (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '77777777-7777-7777-7777-777777777777',
        '실리콘밸리 스타트업 채용',
        '급성장 중인 스타트업에서 한국 개발자 찾고 있습니다. 비자 스폰 가능, 연봉 협의.',
        'jobs',
        3,
        7,
        2
    ),
    (
        '10101010-1010-1010-1010-101010101010',
        '88888888-8888-8888-8888-888888888888',
        'SF 한글학교 정보 공유',
        '우리 아이 한글 배우게 했는데 정말 좋아해요. 주말마다 다니는데 커뮤니티도 따뜻합니다!',
        'kids',
        3,
        3,
        1
    );

-- ── Comments ───────────────────────────────────────────────
INSERT INTO
    comments (id, post_id, user_id, content)
VALUES (
        gen_random_uuid (),
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '22222222-2222-2222-2222-222222222222',
        '오 어디 있어요? 우리 회사 근처인가요!'
    ),
    (
        gen_random_uuid (),
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '33333333-3333-3333-3333-333333333333',
        '주소 좀 알려주세요! 주말에 가봐야겠어요.'
    ),
    (
        gen_random_uuid (),
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '33333333-3333-3333-3333-333333333333',
        '정말 도움 많이 되었어요! 다른 팁도 있으면 공유 부탁해요.'
    ),
    (
        gen_random_uuid (),
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '44444444-4444-4444-4444-444444444444',
        'NY는 정말 비싸네요. LA로 오세요!'
    ),
    (
        gen_random_uuid (),
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '77777777-7777-7777-7777-777777777777',
        'SF는 더 비싸요 ㅠㅠ'
    ),
    (
        gen_random_uuid (),
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        '22222222-2222-2222-2222-222222222222',
        '좋은 기회네요. 이력서 보내도 될까요?'
    ),
    (
        gen_random_uuid (),
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '66666666-6666-6666-6666-666666666666',
        '저도 비슷하게 생각해요. 내년쯤 구매 생각 중입니다.'
    ),
    (
        gen_random_uuid (),
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '88888888-8888-8888-8888-888888888888',
        'SF에서 LA로 옮기는 사람들이 많아요.'
    ),
    (
        gen_random_uuid (),
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '66666666-6666-6666-6666-666666666666',
        '와 진짜 좋네요! 우리 가족도 가봐야겠다!'
    ),
    (
        gen_random_uuid (),
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '11111111-1111-1111-1111-111111111111',
        '뉴욕에서 LA 방문했는데 여기 진짜 좋더라고요.'
    ),
    (
        gen_random_uuid (),
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '99999999-9999-9999-9999-999999999999',
        '관심 있어요! 더 자세한 정보 있을까요?'
    ),
    (
        gen_random_uuid (),
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '22222222-2222-2222-2222-222222222222',
        'NY에서도 지원 가능한가요?'
    ),
    (
        gen_random_uuid (),
        '10101010-1010-1010-1010-101010101010',
        '11111111-1111-1111-1111-111111111111',
        'SF에도 한글학교 있네요. 뉴욕에도 이런 곳 있었으면!'
    ),
    (
        gen_random_uuid (),
        '10101010-1010-1010-1010-101010101010',
        '44444444-4444-4444-4444-444444444444',
        'LA에도 있어요! 분위기 정말 좋아요.'
    );

-- ── Likes ─────────────────────────────────────────────────
INSERT INTO
    post_likes (post_id, user_id)
VALUES (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '22222222-2222-2222-2222-222222222222'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '33333333-3333-3333-3333-333333333333'
    ),
    (
        'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        '44444444-4444-4444-4444-444444444444'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '33333333-3333-3333-3333-333333333333'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '88888888-8888-8888-8888-888888888888'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '55555555-5555-5555-5555-555555555555'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '77777777-7777-7777-7777-777777777777'
    ),
    (
        'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        '99999999-9999-9999-9999-999999999999'
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        '22222222-2222-2222-2222-222222222222'
    ),
    (
        'cccccccc-cccc-cccc-cccc-cccccccccccc',
        '44444444-4444-4444-4444-444444444444'
    ),
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '55555555-5555-5555-5555-555555555555'
    ),
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '66666666-6666-6666-6666-666666666666'
    ),
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '77777777-7777-7777-7777-777777777777'
    ),
    (
        'dddddddd-dddd-dddd-dddd-dddddddddddd',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '66666666-6666-6666-6666-666666666666'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '99999999-9999-9999-9999-999999999999'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '88888888-8888-8888-8888-888888888888'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '22222222-2222-2222-2222-222222222222'
    ),
    (
        'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
        '33333333-3333-3333-3333-333333333333'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '88888888-8888-8888-8888-888888888888'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '99999999-9999-9999-9999-999999999999'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '44444444-4444-4444-4444-444444444444'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '22222222-2222-2222-2222-222222222222'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '33333333-3333-3333-3333-333333333333'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '55555555-5555-5555-5555-555555555555'
    ),
    (
        'ffffffff-ffff-ffff-ffff-ffffffffffff',
        '66666666-6666-6666-6666-666666666666'
    ),
    (
        '10101010-1010-1010-1010-101010101010',
        '99999999-9999-9999-9999-999999999999'
    ),
    (
        '10101010-1010-1010-1010-101010101010',
        '11111111-1111-1111-1111-111111111111'
    ),
    (
        '10101010-1010-1010-1010-101010101010',
        '66666666-6666-6666-6666-666666666666'
    );

-- ── Restore FK enforcement ─────────────────────────────────
SET session_replication_role = DEFAULT;