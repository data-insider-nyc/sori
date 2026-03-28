"use client";

import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  postId: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  userId: string | null;
}

export function PostInteractions({
  postId,
  likeCount,
  commentCount,
  isLiked: initialLiked,
  userId,
}: Props) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(likeCount);

  async function handleLike() {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }

    const supabase = createClient();
    const prev = liked;
    setLiked(!prev);
    setCount((c) => (prev ? c - 1 : c + 1));

    if (prev) {
      await supabase
        .from("post_likes")
        .delete()
        .match({ post_id: postId, user_id: userId });
    } else {
      await supabase
        .from("post_likes")
        .insert({ post_id: postId, user_id: userId });
    }
  }

  return (
    <div className="flex items-center gap-1 mt-5 pt-4 border-t border-gray-100">
      <button
        onClick={handleLike}
        className={cn(
          "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all",
          liked
            ? "text-[#FF5C5C] bg-[#FFF0F0]"
            : "text-gray-400 hover:text-[#FF5C5C] hover:bg-[#FFF0F0]",
        )}
      >
        <Heart className={cn("w-4 h-4", liked && "fill-current")} />
        {count > 0 && <span>{count}</span>}
        <span>{liked ? "좋아요 취소" : "좋아요"}</span>
      </button>

      <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400">
        <MessageCircle className="w-4 h-4" />
        <span>댓글 {commentCount}</span>
      </div>
    </div>
  );
}
