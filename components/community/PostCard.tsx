"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { cn, timeAgo, getInitials, avatarTextColor } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/constants";
import { createClient } from "@/lib/supabase-browser";
import type { Post } from "@/types";

interface Props {
  post: Post;
  userId?: string | null;
}

export function PostCard({ post, userId = null }: Props) {
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [count, setCount] = useState(post.like_count);

  async function handleLike() {
    if (!userId) { window.location.href = "/auth/login"; return; }

    const supabase = createClient();
    const prev = liked;
    // Optimistic update
    setLiked(!prev);
    setCount((c) => prev ? c - 1 : c + 1);

    if (prev) {
      await supabase.from("post_likes").delete().match({ post_id: post.id, user_id: userId });
    } else {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: userId });
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-[#FF5C5C]/30 transition-colors">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <div
            style={{ color: avatarTextColor(post.author.nickname) }}
            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold flex-shrink-0"
          >
            {getInitials(post.author.nickname)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{post.author.nickname}</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
              {getCategoryLabel(post.category)}
            </span>
          </div>
          <span className="text-xs text-gray-400">{timeAgo(post.created_at)}</span>
        </div>
      </div>

      {/* Title + content */}
      <Link href={`/community/${post.id}`} className="block group">
        {post.title && (
          <p className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#FF5C5C] transition-colors line-clamp-1">
            {post.title}
          </p>
        )}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{post.content}</p>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
            liked ? "text-[#FF5C5C] bg-[#FFF0F0]" : "text-gray-400 hover:text-[#FF5C5C] hover:bg-[#FFF0F0]",
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-current")} />
          <span className="font-medium">{count}</span>
        </button>

        <Link
          href={`/community/${post.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.comment_count}</span>
        </Link>
      </div>
    </div>
  );
}
