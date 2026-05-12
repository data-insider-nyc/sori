-- Increase post-images Storage bucket size limit.
-- We do client-side resize/compression, but allow larger originals as a safety net.

UPDATE storage.buckets
SET file_size_limit = 10485760 -- 10 MB
WHERE id = 'post-images';

