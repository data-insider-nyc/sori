"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { PostCard } from "@/components/ui/PostCard";
import type { Post } from "@/types";

export function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const [{ data: raw }, { data: { session } }] =
        await Promise.all([
          supabase
            .from("posts")
            .select(
              "id, title, content, category, region, user_id, like_count, comment_count, created_at, pinned, pinned_at, author:profiles!user_id(id, nickname, handle, location, avatar_url)",
            )
            .order("created_at", { ascending: false })
            .limit(8),
          supabase.auth.getSession(),
        ]);

      setUserId(session?.user?.id ?? null);

      const rawPosts = raw ?? [];
      const seen = new Set<string>();
      const list: Post[] = rawPosts
        .filter((p: any) => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        })
        .map((p: any) => ({
          ...p,
          author: p.author ?? { id: p.user_id, nickname: "알 수 없음" },
        }));

      setPosts(list);
      setLoading(false);
    }
    load();
  }, []);

  if (loading)
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );

  if (posts.length === 0)
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-3xl mb-2">💬</p>
        <p className="text-sm">아직 게시글이 없어요. 첫 번째 글을 써보세요!</p>
      </div>
    );

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} userId={userId} />
      ))}
    </div>
  );
}

