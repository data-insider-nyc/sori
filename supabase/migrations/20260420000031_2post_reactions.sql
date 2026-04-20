-- 119_post_reactions.sql
-- Add post_reactions table to record emoji reactions per-user per-post

CREATE TABLE IF NOT EXISTS post_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_post_reactions_post_id ON post_reactions(post_id);
CREATE INDEX IF NOT EXISTS idx_post_reactions_user_post ON post_reactions(user_id, post_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_post_reactions_user_post_reaction ON post_reactions(user_id, post_id, reaction);
