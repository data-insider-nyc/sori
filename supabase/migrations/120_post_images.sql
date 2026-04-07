-- Migration 120: Post image uploads
--
-- Adds images column to posts table (array of Storage URLs).
-- Creates post-images Storage bucket with public read, owner-only write.
-- Max 4 images per post enforced in application code (MAX_IMAGES = 4).
-- Idempotent — safe to re-run.

-- ─── posts.images column ─────────────────────────────────────────────────────

ALTER TABLE posts ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- ─── post-images Storage bucket ──────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'post-images',
  'post-images',
  true,
  5242880, -- 5 MB
  ARRAY['image/jpeg','image/png','image/gif','image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- ─── RLS policies ─────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "post_images_public_read" ON storage.objects;
CREATE POLICY "post_images_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

DROP POLICY IF EXISTS "post_images_own_upload" ON storage.objects;
CREATE POLICY "post_images_own_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS "post_images_own_delete" ON storage.objects;
CREATE POLICY "post_images_own_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
