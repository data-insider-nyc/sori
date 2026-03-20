"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { PostCard }         from "@/components/community/PostCard";
import { HotTopics }        from "@/components/community/HotTopics";
import { CreatePostButton } from "@/components/community/CreatePostButton";
import { POST_CATEGORIES }  from "@/lib/constants";
import { cn }               from "@/lib/utils";
import type { PostCategory, Post } from "@/types";

export default function CommunityPage() {
  const [active, setActive] = useState<PostCategory>("all");
  const [posts, setPosts]   = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase
        .from("posts")
        .select("*, author:profiles(id, nickname, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(30);

      if (active !== "all") query = query.eq("category", active);

      const { data } = await query;
      setPosts((data ?? []) as Post[]);
      setLoading(false);
    }
    load();
  }, [active]);

  return (
    <div className="py-4 lg:py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">커뮤니티</h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">한인들의 생생한 생활 정보</p>
        </div>
        <CreatePostButton />
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          {/* 카테고리 필터 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
            {(Object.entries(POST_CATEGORIES) as [PostCategory, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={cn(
                  "flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold",
                  "border transition-all duration-150",
                  active === key
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* 포스트 */}
          {loading ? (
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
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
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </div>

        {/* 사이드바 (데스크탑) */}
        <aside className="hidden lg:block space-y-6 mt-0">
          <HotTopics />
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-3">📢</div>
            <div className="font-bold text-sm text-gray-900 mb-1">비즈니스 광고 문의</div>
            <div className="text-xs text-gray-400 mb-4">한인 고객에게 직접 도달하세요</div>
            <a href="/advertise"
               className="inline-block bg-[#E8321C] text-white text-sm font-bold
                          px-5 py-2.5 rounded-xl hover:bg-[#C82818] transition-colors">
              광고 시작하기
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
