"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { LOCAL_CATEGORIES } from "@/lib/constants";
import { getRegions } from "@/lib/regions";
import { getPostCategories } from "@/lib/post-categories";
import { PostCard } from "@/components/ui/PostCard";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

const PAGE_SIZE = 20;
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// ─── Module-level cache ────────────────────────────────────────────────────────
// Survives component unmount/remount (same browser tab session).
// Like Python's @cache(ttl=120) — "back and forth" navigation is instant.
type CacheEntry = {
  posts: Post[];
  cursor: string | null;
  hasMore: boolean;
  ts: number;
};
const feedCache = new Map<string, CacheEntry>();

function makeCacheKey(region: string, category: string, q: string) {
  return `${region}:${category}:${q}`;
}

/** Call this after creating a new post so the feed refreshes on next visit. */
export function clearFeedCache() {
  feedCache.clear();
}
// ──────────────────────────────────────────────────────────────────────────────

export function CommunityListing() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") ?? "all";
  const region = searchParams.get("region") ?? "all";
  const q = searchParams.get("q") ?? "";

  const key = makeCacheKey(region, category, q);
  const cached = feedCache.get(key);
  const fresh = cached && Date.now() - cached.ts < CACHE_TTL;

  // Initialise from cache so returning users see posts immediately (no skeleton)
  const [posts, setPosts] = useState<Post[]>(fresh ? cached.posts : []);
  const [loading, setLoading] = useState(!fresh);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(fresh ? cached.hasMore : false);
  const [cursor, setCursor] = useState<string | null>(
    fresh ? cached.cursor : null,
  );
  const [userId, setUserId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(q);
  const [regions, setRegions] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Load regions + categories from DB
  useEffect(() => {
    getRegions().then(setRegions);
    getPostCategories().then(setCategories);
  }, []);

  // Resolve auth (non-blocking — posts load in parallel)
  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null));
  }, []);

  // Load when filters change — use cache if fresh, otherwise fetch
  useEffect(() => {
    const entry = feedCache.get(makeCacheKey(region, category, q));
    const isFresh = entry && Date.now() - entry.ts < CACHE_TTL;
    if (isFresh) {
      setPosts(entry.posts);
      setHasMore(entry.hasMore);
      setCursor(entry.cursor);
      setLoading(false);
      return;
    }
    setPosts([]);
    setCursor(null);
    setHasMore(false);
    load({ afterCursor: null, append: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, region, q]);

  // Overlay like status once userId is known (non-blocking)
  useEffect(() => {
    if (!userId || posts.length === 0) return;
    overlayLikes(posts, userId).then((updated) => {
      setPosts(updated);
      const entry = feedCache.get(key);
      if (entry) feedCache.set(key, { ...entry, posts: updated });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  async function overlayLikes(list: Post[], uid: string): Promise<Post[]> {
    const { data: likes } = await createClient()
      .from("post_likes")
      .select("post_id")
      .eq("user_id", uid)
      .in(
        "post_id",
        list.map((p) => p.id),
      );
    const liked = new Set((likes ?? []).map((l: any) => l.post_id));
    return list.map((p) => ({ ...p, is_liked: liked.has(p.id) }));
  }

  async function load({
    afterCursor,
    append,
  }: {
    afterCursor: string | null;
    append: boolean;
  }) {
    if (append) setLoadingMore(true);
    else setLoading(true);

    const supabase = createClient();

    // Single query: posts + author profile via FK join (no separate profiles round-trip)
    let query = supabase
      .from("posts")
      .select("*, author:profiles!user_id(id, nickname, handle, location_id, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (category !== "all") query = query.eq("category", category);
    if (region !== "all") {
      // Get region ID from region value
      const regionId = regions.find((r) => r.value === region)?.id;
      if (regionId) query = query.eq("region_id", regionId);
    }
    if (q.trim()) query = query.ilike("title", `%${q.trim()}%`);
    if (afterCursor) query = query.lt("created_at", afterCursor);

    const { data: raw } = await query;
    const rows = (raw ?? []) as any[];

    if (rows.length === 0) {
      if (!append) setPosts([]);
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    // Dedupe by id
    const seen = new Set<string>();
    const deduped = rows.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    const list: Post[] = deduped.map((p) => ({
      ...p,
      author: p.author ?? { id: p.user_id, nickname: "알 수 없음" },
      is_liked: false, // overlaid asynchronously after userId resolves
    }));

    const newPosts = append ? [...posts, ...list] : list;
    const newCursor = deduped[deduped.length - 1].created_at;
    const newHasMore = deduped.length === PAGE_SIZE;

    setPosts(newPosts);
    setHasMore(newHasMore);
    setCursor(newCursor);
    setLoading(false);
    setLoadingMore(false);

    // Cache first page only
    if (!append) {
      feedCache.set(makeCacheKey(region, category, q), {
        posts: list,
        cursor: newCursor,
        hasMore: newHasMore,
        ts: Date.now(),
      });
    }

    // Overlay likes if userId already resolved
    if (userId) {
      overlayLikes(newPosts, userId).then((updated) => {
        setPosts(updated);
        if (!append) {
          feedCache.set(makeCacheKey(region, category, q), {
            posts: updated,
            cursor: newCursor,
            hasMore: newHasMore,
            ts: Date.now(),
          });
        }
      });
    }
  }

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete(key);
    else params.set(key, value);
    router.replace(`/community?${params.toString()}`);
  }

  function handleSearchChange(val: string) {
    setSearchInput(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setParam("q", val), 300);
  }

  return (
    <div className="lg:col-span-2">
      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none">
          🔍
        </span>
        <input
          type="search"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="게시글 검색..."
          className="input-field pl-10"
        />
      </div>

      {/* Region tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-1">
        <button
          onClick={() => setParam("region", "all")}
          className={cn(
            "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border transition-all",
            region === "all"
              ? "bg-[#FF5C5C] text-white border-[#FF5C5C]"
              : "bg-white text-gray-500 border-gray-200 hover:border-[#FF5C5C] hover:text-[#FF5C5C]",
          )}
        >
          전체 지역
        </button>
        {regions.map((r) => (
          <button
            key={r.value}
            onClick={() => setParam("region", r.value)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-bold border transition-all",
              region === r.value
                ? "bg-[#FF5C5C] text-white border-[#FF5C5C]"
                : "bg-white text-gray-500 border-gray-200 hover:border-[#FF5C5C] hover:text-[#FF5C5C]",
            )}
          >
            {r.emoji} {r.label}
          </button>
        ))}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
        <button
          onClick={() => setParam("category", "all")}
          className={cn(
            "flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all",
            category === "all"
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-white text-gray-500 border-gray-200 hover:border-gray-400",
          )}
        >
          전체 토픽
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setParam("category", cat.value)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all",
              category === cat.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400",
            )}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Feed */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-36 bg-gray-100 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">💬</div>
          <p className="font-medium">게시글이 없어요.</p>
          <p className="text-sm mt-1">
            {q ? `"${q}" 검색 결과가 없어요.` : "첫 번째 글을 써보세요!"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} userId={userId} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={() => load({ afterCursor: cursor, append: true })}
                disabled={loadingMore}
                className="btn-outline inline-flex items-center gap-2"
              >
                {loadingMore && (
                  <span className="w-4 h-4 border-2 border-gray-400/40 border-t-gray-500 rounded-full animate-spin" />
                )}
                더 보기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
