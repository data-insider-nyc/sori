"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { PostCard } from "@/components/community/PostCard";
import type { Post } from "@/types";

export function CommunityFeed() {
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("posts")
        .select("*, author:profiles(id, nickname, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(5);
      setPosts((data ?? []) as Post[]);
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
