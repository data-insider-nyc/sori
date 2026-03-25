"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { COMMUNITY_CATEGORIES, REGIONS } from "@/lib/constants";
import { PostCard } from "@/components/community/PostCard";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

const PAGE_SIZE = 20;

export function CommunityClient() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const category = searchParams.get("category") ?? "all";
  const region   = searchParams.get("region")   ?? "all";
  const q        = searchParams.get("q")        ?? "";

  const [posts,       setPosts]       = useState<Post[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore,     setHasMore]     = useState(false);
  const [cursor,      setCursor]      = useState<string | null>(null);
  const [userId,      setUserId]      = useState<string | null>(null);
  const [userReady,   setUserReady]   = useState(false);
  const [searchInput, setSearchInput] = useState(q);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Resolve auth once before first fetch
  useEffect(() => {
    createClient().auth
      .getUser()
      .then(({ data: { user } }) => {
        setUserId(user?.id ?? null);
        setUserReady(true);
      });
  }, []);

  // Fresh load whenever filters or auth state change
  useEffect(() => {
    if (!userReady) return;
    setPosts([]);
    setCursor(null);
    setHasMore(false);
    load({ afterCursor: null, append: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, region, q, userId, userReady]);

  // Keep search input in sync when URL changes externally (e.g. back/forward)
  useEffect(() => { setSearchInput(q); }, [q]);

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
    let query = supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(PAGE_SIZE);

    if (category !== "all") query = query.eq("category", category);
    if (region   !== "all") query = query.or(`region.is.null,region.eq.${region}`);
    if (q.trim())           query = query.ilike("title", `%${q.trim()}%`);
    if (afterCursor)        query = query.lt("created_at", afterCursor);

    const { data: raw } = await query;
    const rawPosts = raw ?? [];

    // Dedupe by id
    const seen = new Set<string>();
    const deduped = rawPosts.filter((p: any) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });

    if (deduped.length === 0) {
      if (!append) setPosts([]);
      setHasMore(false);
      setLoading(false);
      setLoadingMore(false);
      return;
    }

    // Batch-fetch author profiles
    const userIds = [...new Set(deduped.map((p: any) => p.user_id as string))];
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, nickname")
      .in("id", userIds);
    const profileMap = Object.fromEntries(
      (profiles ?? []).map((p: any) => [p.id, p]),
    );

    // Batch-fetch liked post IDs
    let likedSet = new Set<string>();
    if (userId) {
      const { data: likes } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", deduped.map((p: any) => p.id));
      likedSet = new Set((likes ?? []).map((l: any) => l.post_id));
    }

    const list: Post[] = deduped.map((p: any) => ({
      ...p,
      author:   profileMap[p.user_id] ?? { id: p.user_id, nickname: "알 수 없음" },
      is_liked: likedSet.has(p.id),
    }));

    if (append) setPosts((prev) => [...prev, ...list]);
    else setPosts(list);

    setHasMore(deduped.length === PAGE_SIZE);
    setCursor(deduped[deduped.length - 1].created_at);
    setLoading(false);
    setLoadingMore(false);
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
          🌐 전체
        </button>
        {REGIONS.map((r) =>
          r.status === "open" ? (
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
          ) : (
            <div
              key={r.value}
              className="flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed select-none"
              title="준비 중인 지역이에요"
            >
              {r.emoji} {r.label}
              <span className="text-[10px] font-semibold bg-gray-200 text-gray-400 rounded-full px-1.5 py-0.5 leading-none">
                준비중
              </span>
            </div>
          ),
        )}
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
          전체
        </button>
        {COMMUNITY_CATEGORIES.map((cat) => (
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
            <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
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



