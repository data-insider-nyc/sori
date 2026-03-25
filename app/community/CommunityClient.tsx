"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { COMMUNITY_CATEGORIES } from "@/lib/constants";
import { PostCard } from "@/components/community/PostCard";
import { cn } from "@/lib/utils";
import type { Post } from "@/types";

export function CommunityClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get("category") ?? "all";

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Resolve current user once
  useEffect(() => {
    const supabase = createClient();
    supabase.auth
      .getUser()
      .then(({ data: { user } }) => setUserId(user?.id ?? null));
  }, []);

  // Fetch posts whenever category or userId changes
  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();

      // 1. Fetch posts (no FK join — avoids schema cache issues)
      let query = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(15);

      if (category !== "all") query = query.eq("category", category);

      const { data: raw } = await query;
      const rawPosts = raw ?? [];

      if (rawPosts.length === 0) {
        setPosts([]);
        setLoading(false);
        return;
      }

      // 2. Batch-fetch author profiles
      const userIds = [
        ...new Set(rawPosts.map((p: any) => p.user_id as string)),
      ];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, nickname")
        .in("id", userIds);
      const profileMap = Object.fromEntries(
        (profiles ?? []).map((p: any) => [p.id, p]),
      );

      // 3. Batch-fetch liked post IDs
      let likedSet = new Set<string>();
      if (userId) {
        const { data: likes } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", userId)
          .in(
            "post_id",
            rawPosts.map((p: any) => p.id),
          );
        likedSet = new Set((likes ?? []).map((l: any) => l.post_id));
      }

      // 4. Merge
      const list: Post[] = rawPosts.map((p: any) => ({
        ...p,
        author: profileMap[p.user_id] ?? {
          id: p.user_id,
          nickname: "알 수 없음",
        },
        is_liked: likedSet.has(p.id),
      }));

      setPosts(list);
      setLoading(false);
    }
    load();
  }, [category, userId]);

  function setCategory(cat: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (cat === "all") params.delete("category");
    else params.set("category", cat);
    router.replace(`/community?${params.toString()}`);
  }

  return (
    <div className="lg:col-span-2">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
        <button
          onClick={() => setCategory("all")}
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
            onClick={() => setCategory(cat.value)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold border transition-all",
              category === cat.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-500 border-gray-200 hover:border-gray-400",
            )}
          >
            {cat.label}
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
          <p className="font-medium">아직 게시글이 없어요.</p>
          <p className="text-sm mt-1">첫 번째 글을 써보세요!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}
