# Sori Community Seed Data Guide

## 📊 Contents

**SEED_COMMUNITY_DATA.sql** contains realistic test data for community feature development:

### Users (9 total)
- **NY Region (3 users)**
  - 브루클린린 (@brooklyn_lina) — Restaurant enthusiast
  - 맨해튼맨 (@manhattan_mike) — Immigration tips expert
  - 뉴저지조 (@nj_joe) — Job recruiter

- **LA Region (3 users)**
  - 할리우드하나 (@hollywood_hana) — Real estate investor
  - 비치보이 (@beach_boy_la) — Family outing guide
  - 다운타운댄 (@dtla_dan) — Active community member

- **SF Region (3 users)**
  - 실리콘신 (@silicon_shin) — Tech recruiter
  - 베이오션 (@bay_ocean) — Education advocate
  - 골든게이트 (@golden_gate_gina) — Community supporter

### Posts (7 total)

#### NY Posts (3)
1. **"뉴욕 맛있는 한식당 추천"** - Restaurant review (Brooklyn)
2. **"뉴욕 이민 생활 팁"** - Immigration advice (General)
3. **"뉴저지 일자리 정보"** - Accounting job opening (Jobs)

#### LA Posts (2)
1. **"LA 부동산 시장 어떻게 생각하세요?"** - Real estate discussion
2. **"비치 근처 피크닉 스팟 추천"** - Family outing guide (Kids)

#### SF Posts (2)
1. **"실리콘밸리 스타트업 기회"** - Tech job opening
2. **"SF 한글학교 정보"** - Education resource (Kids)

### Engagement (Cross-Region)
- **Comments**: 10 total (users from different regions commenting)
- **Likes**: 26 total (includes cross-region interactions)
- **Comment counts**: Range from 1-4 per post
- **Like counts**: Range from 2-7 per post

## 🚀 How to Apply

### Option 1: Supabase Dashboard (Easiest)
1. Open https://app.supabase.com → Your Project → SQL Editor
2. Copy entire contents of `SEED_COMMUNITY_DATA.sql`
3. Paste and click "Run"

### Option 2: Supabase CLI
```bash
supabase push  # Applies all migrations (or use psql directly)
```

### Option 3: Direct psql (if you have CLI access)
```bash
psql -h [your-host] -U postgres -d postgres -f SEED_COMMUNITY_DATA.sql
```

## ✅ Verification

After applying, verify with these queries:

```sql
-- Check user profiles created
SELECT nickname, location_id FROM profiles 
WHERE id IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  -- ... etc
)
ORDER BY location_id;

-- Check posts exist
SELECT title, region_id, category FROM posts LIMIT 10;

-- Check engagement
SELECT post_id, COUNT(*) as comment_count FROM comments GROUP BY post_id;

-- Check cross-region activity
SELECT p.region_id, COUNT(DISTINCT c.user_id) as unique_commenters 
FROM posts p 
LEFT JOIN comments c ON p.id = c.post_id 
GROUP BY p.region_id;
```

## 🧹 Reset Seed Data

To remove all test data and start fresh:

```sql
-- Delete in cascade order
DELETE FROM comments WHERE user_id LIKE '%1111%' OR user_id LIKE '%2222%' OR ...;
DELETE FROM post_likes WHERE user_id LIKE '%1111%' OR ...;
DELETE FROM posts WHERE user_id LIKE '%1111%' OR ...;
DELETE FROM profiles WHERE id LIKE '%1111%' OR ...;

-- Or simpler approach - re-run the SQL file (has built-in DELETE statements)
```

## 📝 Customization

To modify seed data:

1. **Change region IDs** (top of DO block):
   ```sql
   ny_region_id INT := 1;    -- Change if needed
   la_region_id INT := 2;
   sf_region_id INT := 3;
   ```

2. **Add more users**: Duplicate profile INSERT + generate new UUIDs

3. **Add more posts**: Create new post IDs and INSERT with desired category/region

4. **Add more comments**: Use `gen_random_uuid()` for comment IDs

## 🎯 Use Cases

This seed data is designed for testing:
- ✅ Region filtering in community feed
- ✅ Cross-region engagement/comments
- ✅ Profile region display (location badge)
- ✅ Post detail page with author profiles
- ✅ Like/comment counter accuracy
- ✅ Category badges and sorting
- ✅ User search and discovery

---

**Created**: Latest session  
**Format**: PL/pgSQL block (idempotent, safe to re-run)  
**UUIDs**: Predefined for easy debugging (11111..., 22222..., etc.)  
