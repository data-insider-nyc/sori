# Supabase

## 폴더 구조

```
supabase/
├── migrations/   # 스키마 변경 이력 (순서대로 적용)
├── snippets/     # 개발용 쿼리 / 시드 데이터
├── seeds/        # 초기 데모 데이터
└── config.toml   # Supabase CLI 설정
```

---

## 배포 워크플로우

> **⚠️ DB migration은 항상 코드 배포보다 먼저!**
> 코드가 새 컬럼을 기대하는데 DB가 아직 구버전이면 배포 직후 런타임 에러가 납니다.

### 순서

```
1. supabase db push        ← production DB에 migration 적용
2. PR → main merge         ← Vercel 자동 배포 (코드)
```

### 처음 production에 연결할 때

```bash
# project-ref는 Supabase Dashboard URL의 ID 부분
# 예: https://rmwelhirlt...supabase.co → ref = rmwelhirlt...
supabase link --project-ref <project-ref>

# 어떤 migration이 remote에 없는지 확인
supabase migration list

# 미적용 migration 전체 push
supabase db push
```

### 이미 연결된 상태에서 새 migration 배포

```bash
supabase db push
```

### migration이 이미 수동으로 적용된 경우 (에러 방지)

```bash
# remote에 이미 있는 migration을 "완료"로 표시하고 건너뜀
supabase migration repair --status applied <migration_name>
```

---

## migrations/

스키마 변경 이력. 파일명 순서대로 적용됩니다.

| 파일 | 내용 |
|------|------|
| `100_initial.sql` | 최초 테이블 생성 (profiles, businesses, posts, comments, post_likes, reviews) |
| `101_nickname_changed_at.sql` | 닉네임 변경 쿨다운 |
| `102_community.sql` | 커뮤니티 기본 구조 |
| `103_region.sql` | 지역 컬럼 초기 버전 |
| `104_soft_delete_posts_comments.sql` | soft delete (deleted_at) |
| `105_filter_deleted_posts_comments.sql` | 삭제된 글 RLS 필터 |
| `106_indexes.sql` | 성능 인덱스 |
| `107_handle_display_name.sql` | handle, display_name 추가 |
| `108_update_comment_trigger.sql` | 댓글 카운트 트리거 개선 |
| `109_indexes_deleted_at.sql` | soft delete 인덱스 |
| `110_metro_areas.sql` | 메트로 지역 초기 마이그레이션 |
| `111_regions_table.sql` | regions 테이블 (이후 삭제됨) |
| `112_consolidate_regions_and_fix_schema.sql` | 스키마 정리 |
| `113_seed_test_data.sql` | 테스트 데이터 |
| `114_post_categories_and_colors.sql` | post_categories 테이블 삭제 → posts.category CHECK constraint |
| `115_admin_role.sql` | is_admin 플래그, 관리자 RLS 정책 |
| `116_avatars_storage.sql` | 아바타 Storage 버킷 + 정책 |
| `117_pinned_posts.sql` | 공지 고정 기능 |
| `118_community_perf_indexes.sql` | 커뮤니티 성능 인덱스 |

### 새 migration 추가 규칙

파일명: `119_feature_name.sql` 형태로 다음 번호를 붙입니다.

**반드시 idempotent(멱등성)하게 작성하세요** — 같은 migration이 두 번 실행돼도 에러 없이 통과해야 합니다:

```sql
-- ✅ 컬럼
ALTER TABLE t ADD COLUMN IF NOT EXISTS col type;

-- ✅ 테이블
CREATE TABLE IF NOT EXISTS t (...);

-- ✅ 정책 (IF NOT EXISTS 없으므로 DROP 먼저)
DROP POLICY IF EXISTS "policy_name" ON table;
CREATE POLICY "policy_name" ON table ...;

-- ✅ 트리거
DROP TRIGGER IF EXISTS trigger_name ON table;
CREATE TRIGGER trigger_name ...;

-- ✅ 인덱스
CREATE INDEX IF NOT EXISTS idx_name ON table(col);

-- ✅ 함수
CREATE OR REPLACE FUNCTION fn_name() ...;
```

---

## 주요 스키마

### 카테고리 / 지역 — **DB 테이블 없음, 코드로 관리**

`post_categories` 테이블과 `regions` 테이블은 삭제됐습니다.  
고정 enum이므로 코드에서 관리합니다:

- **카테고리**: `lib/post-categories.ts` → `CATEGORIES`, `CATEGORY_ICONS`
- **지역**: `lib/regions.ts` → `REGIONS`, `REGION_ICONS`

DB에는 CHECK constraint로 유효값만 강제합니다:

```sql
-- posts.category
CHECK (category IN ('general','food','local','jobs','housing','family','market','immigration','health'))

-- posts.region
CHECK (region IS NULL OR region IN ('nyc','la','sf','chicago','dc','seattle','boston','atlanta','dallas','other'))
```

### RLS 정책 원칙

- 모든 테이블: public read (`SELECT USING (true)`)
- 쓰기: 본인 데이터만 (`auth.uid() = user_id`)
- 관리자: `profiles.is_admin = true` 확인

---

## snippets/

개발 중 자주 쓰는 쿼리와 시드 데이터.

- `SEED NYC.sql` — NYC 지역 테스트 포스트 데이터

---

## seeds/

초기 데모 데이터 (개발/스테이징 전용).

**주의**: `auth.users`에 직접 삽입하므로 반드시 Supabase Dashboard SQL Editor에서 실행 (service role 권한 필요)

### 초기화 (seed 데이터 삭제)

```sql
DELETE FROM auth.users WHERE email LIKE '%@sori.fake';
```

`profiles`, `posts`, `comments`는 CASCADE로 자동 삭제됩니다.
