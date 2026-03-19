# Supabase

## migrations/
DB 스키마 변경 이력. 순서대로 실행하세요.

```
001_initial.sql   — 최초 테이블 생성 + seed 데이터
```

### 실행 방법
supabase.com → SQL Editor → 파일 내용 복붙 → Run

## 새 마이그레이션 추가할 때
파일명: `002_add_jobs_table.sql`, `003_add_notifications.sql` 형태로
순서 번호를 붙여서 관리합니다.
