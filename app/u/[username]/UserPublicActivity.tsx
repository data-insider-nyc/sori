"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { getCategoryLabel, getCategoryEmoji } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

interface Props {
  userId: string;
  postCount: number;
}

interface PostRow {
  id: string;
  title: string;
  category: string;
  like_count: number;
  comment_count: number;
  created_at: string;
}

export function UserPublicActivity({ userId, postCount }: Props) {
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPosts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("posts")
        .select("id, title, category, like_count, comment_count, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      setPosts((data ?? []) as PostRow[]);
      setLoading(false);
    }
    loadPosts();
  }, [userId]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex border-b border-gray-100 px-5 py-3.5">
        <span className="text-sm font-bold text-[#FF5C5C]">
          작성한 글
          <span className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#FFF0F0] text-[#FF5C5C]">
            {postCount}
          </span>
        </span>
      </div>

      {loading ? (
        <div className="p-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">📭</div>
          <p className="text-sm">아직 작성한 글이 없어요.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/community/${post.id}`}
                className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-base flex-shrink-0 mt-0.5">
                  {getCategoryEmoji(post.category)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-0.5">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{getCategoryLabel(post.category)}</span>
                    <span>{timeAgo(post.created_at)}</span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3" /> {post.like_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" /> {post.comment_count}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
