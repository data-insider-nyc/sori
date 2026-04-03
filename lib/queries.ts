/**
 * Server-side cached Supabase queries.
 * Equivalent to Python's @cache(ttl=...) — results are stored on the Vercel
 * server and reused for the configured duration without hitting the DB again.
 *
 * Usage pattern:
 *   - unstable_cache(asyncFn, cacheKey, { revalidate: seconds, tags: [...] })
 *   - Call revalidateTag('tag') from a Server Action to bust on mutation
 */

import { unstable_cache } from "next/cache";
import { supabase } from "./supabase";
import type { Business } from "@/types";

// ─── Businesses ────────────────────────────────────────────────────────────────

/** Featured (premium) businesses for home page — refreshed every 5 minutes. */
export const getFeaturedBusinesses = unstable_cache(
  async (): Promise<Business[]> => {
    const { data } = await supabase
      .from("businesses")
      .select("*")
      .eq("is_premium", true)
      .order("rating", { ascending: false })
      .limit(3);
    return (data ?? []) as Business[];
  },
  ["featured-businesses"],
  { revalidate: 300, tags: ["businesses"] },
);

// ─── Posts ─────────────────────────────────────────────────────────────────────

/** Post detail + author — cached together for 10 minutes. */
export const getCachedPost = unstable_cache(
  async (id: string) => {
    const { data: post } = await supabase
      .from("posts")
      .select("*, author:profiles!user_id(id, nickname, handle, location_id, avatar_url)")
      .eq("id", id)
      .single();
    return post as (typeof post & { author: { id: string; nickname: string; handle: string | null; location_id: number | null } | null }) | null;
  },
  ["post-detail"],
  { revalidate: 600, tags: ["posts"] },
);

/** Hot topics sidebar (top 5 by comment count) — refreshed every 2 minutes. */
export const getHotTopics = unstable_cache(
  async (): Promise<{ id: string; title: string; comment_count: number }[]> => {
    const { data } = await supabase
      .from("posts")
      .select("id, title, comment_count")
      .order("comment_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(5);
    return data ?? [];
  },
  ["hot-topics"],
  { revalidate: 120, tags: ["posts"] },
);

/** Admin pinned posts (simple, no order) — refreshed every 2 minutes. */
export const getPinnedPosts = unstable_cache(
  async (): Promise<{ id: string; title: string; comment_count: number }[]> => {
    const { data } = await supabase
      .from("posts")
      .select("id, title, comment_count")
      .eq("pinned", true)
      .order("pinned_at", { ascending: false })
      .limit(5);
    return data ?? [];
  },
  ["pinned-posts"],
  { revalidate: 120, tags: ["posts"] },
);

