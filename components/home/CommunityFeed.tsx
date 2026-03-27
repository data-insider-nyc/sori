"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { PostCard } from "@/components/community/PostCard";
import type { Post } from "@/types";

export function CommunityFeed() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: raw } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(8);

      const rawPosts = raw ?? [];
      const seen = new Set<string>();
      const dedupedPosts = rawPosts.filter((p: any) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
      if (dedupedPosts.length === 0) { setPosts([]); setLoading(false); return; }

      const userIds = [...new Set(dedupedPosts.map((p: any) => p.user_id as string))];
      const { data: profiles } = await supabase
        .from("profiles").select("id, nickname").in("id", userIds);
      const profileMap = Object.fromEntries((profiles ?? []).map((p: any) => [p.id, p]));

      const list: Post[] = dedupedPosts.map((p: any) => ({
        ...p,
        author: profileMap[p.user_id] ?? { id: p.user_id, nickname: "알 수 없음" },
      }));

      setPosts(list);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="space-y-4">
      {[1, 2].map((i) => (
        <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  if (posts.length === 0) return (
    <div className="text-center py-10 text-gray-400">
      <p className="text-3xl mb-2">💬</p>
      <p className="text-sm">아직 게시글이 없어요. 첫 번째 글을 써보세요!</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
