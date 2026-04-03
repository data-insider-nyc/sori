-- 117_pinned_posts.sql
-- Add simple pinned fields to posts for admin-pin feature

alter table if exists posts add column if not exists pinned boolean default false;
alter table if exists posts add column if not exists pinned_by uuid;
alter table if exists posts add column if not exists pinned_at timestamptz;

-- Optional index to speed up querying pinned posts
create index if not exists idx_posts_pinned_at on posts(pinned, pinned_at desc);
