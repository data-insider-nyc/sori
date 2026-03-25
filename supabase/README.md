# Supabase

## migrations/
DB 스키마 변경 이력. 순서대로 실행하세요.

```
001_initial.sql   — 최초 테이블 생성 (profiles, businesses, posts, comments, post_likes, reviews)
002_nicknames.sql — 닉네임 시스템 (if exists)
003_community.sql — comments.parent_id 추가 (대댓글)
```

### 실행 방법
supabase.com → SQL Editor → 파일 내용 복붙 → Run

## seeds/
초기 데모 데이터. 개발/테스트용 fake 유저 3명 + 게시글 8개 + 댓글.

```
001_demo_data.sql — 데모 유저 3명, 카테고리별 게시글 8개, 댓글+대댓글
```

### 실행 방법
supabase.com → SQL Editor → 파일 내용 복붙 → Run  
**주의**: `auth.users`에 직접 삽입하므로 반드시 Supabase Dashboard SQL Editor에서 실행 (service role 권한 필요)

### 초기화 (seed 데이터 삭제)
```sql
DELETE FROM auth.users WHERE email LIKE '%@sori.fake';
```
profiles, posts, comments는 CASCADE로 자동 삭제됩니다.

## 새 마이그레이션 추가할 때
파일명: `002_add_jobs_table.sql`, `003_add_notifications.sql` 형태로
순서 번호를 붙여서 관리합니다.
