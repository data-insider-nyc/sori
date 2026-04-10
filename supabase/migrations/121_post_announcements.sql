alter table if exists posts
  add column if not exists is_announcement boolean not null default false;

create index if not exists posts_is_announcement_created_at_idx
  on posts (is_announcement, created_at desc)
  where deleted_at is null;
