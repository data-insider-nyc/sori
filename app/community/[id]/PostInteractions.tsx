"use client";

import { MessageCircle } from "lucide-react";
import { LikeButton } from "@/components/ui/LikeButton";

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
  isLiked,
  userId,
}: Props) {
  return (
    <div className="flex items-center gap-1 mt-5 pt-4 border-t border-gray-100">
      <LikeButton
        postId={postId}
        initialCount={likeCount}
        initialLiked={isLiked}
        userId={userId}
        showLabel
        realtime
      />

      <div className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-400">
        <MessageCircle className="w-4 h-4" />
        <span>댓글 {commentCount}</span>
      </div>
    </div>
  );
}
