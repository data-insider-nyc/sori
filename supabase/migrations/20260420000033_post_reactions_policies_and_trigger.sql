-- 120_post_reactions_policies_and_trigger.sql
-- Add RLS policies for post_reactions and a trigger to maintain posts.reaction_counts

-- Ensure reaction_counts column exists on posts (for cached reaction counts)
ALTER TABLE IF EXISTS posts ADD COLUMN IF NOT EXISTS reaction_counts jsonb DEFAULT '{}'::jsonb;

-- Enable row level security on post_reactions and create policies
ALTER TABLE IF EXISTS post_reactions ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (idempotent migration pattern)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_class WHERE relname = 'post_reactions') THEN
    DROP POLICY IF EXISTS "public_select_post_reactions" ON post_reactions;
    DROP POLICY IF EXISTS "insert_own_post_reactions" ON post_reactions;
    DROP POLICY IF EXISTS "delete_own_post_reactions" ON post_reactions;
  END IF;
END$$;

-- Allow public selects
CREATE POLICY "public_select_post_reactions" ON post_reactions
  FOR SELECT
  USING (true);

-- Allow inserts only when auth.uid() equals user_id
CREATE POLICY "insert_own_post_reactions" ON post_reactions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow deletes only when auth.uid() equals user_id
CREATE POLICY "delete_own_post_reactions" ON post_reactions
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create or replace function to maintain posts.reaction_counts
CREATE OR REPLACE FUNCTION public.update_post_reaction_counts()
RETURNS TRIGGER AS $$
DECLARE
  current_count int;
  new_count int;
  rc jsonb;
BEGIN
  IF TG_OP = 'INSERT' THEN
    rc := COALESCE((SELECT reaction_counts FROM posts WHERE id = NEW.post_id), '{}'::jsonb);
    current_count := COALESCE((rc ->> NEW.reaction)::int, 0);
    new_count := current_count + 1;
    UPDATE posts SET reaction_counts = jsonb_set(COALESCE(reaction_counts, '{}'::jsonb), ARRAY[NEW.reaction], to_jsonb(new_count), true) WHERE id = NEW.post_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    rc := COALESCE((SELECT reaction_counts FROM posts WHERE id = OLD.post_id), '{}'::jsonb);
    current_count := COALESCE((rc ->> OLD.reaction)::int, 0);
    new_count := GREATEST(current_count - 1, 0);
    IF new_count = 0 THEN
      -- remove key when count reaches zero
      UPDATE posts SET reaction_counts = (COALESCE(reaction_counts, '{}'::jsonb) - OLD.reaction) WHERE id = OLD.post_id;
    ELSE
      UPDATE posts SET reaction_counts = jsonb_set(COALESCE(reaction_counts, '{}'::jsonb), ARRAY[OLD.reaction], to_jsonb(new_count), true) WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after insert or delete on post_reactions
DROP TRIGGER IF EXISTS trg_post_reaction_counts ON post_reactions;
CREATE TRIGGER trg_post_reaction_counts
AFTER INSERT OR DELETE ON post_reactions
FOR EACH ROW EXECUTE FUNCTION public.update_post_reaction_counts();
