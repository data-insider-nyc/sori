"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import { cn, timeAgo, getInitials, avatarColor } from "@/lib/utils";
import { POST_CATEGORIES } from "@/lib/constants";
import type { Post } from "@/types";

export function PostCard({ post }: { post: Post }) {
  const [liked, setLiked]       = useState(post.is_liked ?? false);
  const [count, setCount]       = useState(post.like_count);
  const categoryLabel           = POST_CATEGORIES[post.category];

  function handleLike() {
    setLiked((p) => !p);
    setCount((p) => liked ? p - 1 : p + 1);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0", avatarColor(post.author.nickname))}>
          {getInitials(post.author.nickname)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{post.author.nickname}</span>
            <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{categoryLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>{timeAgo(post.created_at)}</span>
            {post.location && (
              <><span>·</span><span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{post.location}</span></>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <Link href={`/community/${post.id}`}>
        <p className="text-sm text-gray-800 leading-relaxed hover:text-gray-600 transition-colors">
          {post.content}
        </p>
      </Link>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {post.tags.map((t) => <span key={t} className="tag">#{t}</span>)}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
            liked ? "text-[#FF5C5C] bg-[#FFF0F0]" : "text-gray-400 hover:text-[#FF5C5C] hover:bg-[#FFF0F0]"
          )}
        >
          <Heart className={cn("w-4 h-4", liked && "fill-current")} />
          <span className="font-medium">{count}</span>
        </button>

        <Link href={`/community/${post.id}`}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">{post.comment_count}</span>
        </Link>

        <button
          onClick={() => navigator.share?.({ url: `/community/${post.id}` })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-green-500 hover:bg-green-50 transition-all ml-auto"
        >
          <Share2 className="w-4 h-4" />
          <span className="font-medium">공유</span>
        </button>
      </div>
    </div>
  );
}
