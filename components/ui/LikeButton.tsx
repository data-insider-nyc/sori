"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";
import { recordLikeToggle } from "@/lib/post-like-store";

interface LikeButtonProps {
  postId: string;
  initialCount: number;
  initialLiked: boolean;
  userId: string | null;
  /** Show "좋아요 / 좋아요 취소" label next to the icon (PostInteractions style) */
  showLabel?: boolean;
  /** Subscribe to realtime post updates to keep count in sync with other users */
  realtime?: boolean;
  className?: string;
}

export function LikeButton({
  postId,
  initialCount,
  initialLiked,
  userId,
  showLabel = false,
  realtime = false,
  className,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);

  // Sync when parent re-renders with fresh data (e.g., overlayLikes resolves)
  useEffect(() => {
    setLiked(initialLiked);
    setCount(initialCount);
  }, [initialLiked, initialCount]);

  // Optional realtime subscription — used in post detail page
  useEffect(() => {
    if (!realtime) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`like-button-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts",
          filter: `id=eq.${postId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          if (typeof updated.like_count === "number") setCount(updated.like_count);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [postId, realtime]);

  async function handleLike() {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }

    const wasLiked = liked;
    // Optimistic update
    setLiked(!wasLiked);
    setCount((c) => (wasLiked ? c - 1 : c + 1));

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        console.error("[LikeButton] toggle like failed", body);
        // Revert optimistic update on failure
        setLiked(wasLiked);
        setCount((c) => (wasLiked ? c + 1 : c - 1));
        return;
      }

      if (typeof body.like_count === "number") {
        setCount(body.like_count);
        recordLikeToggle(postId, body.like_count, !wasLiked);
      } else {
        recordLikeToggle(postId, wasLiked ? count - 1 : count + 1, !wasLiked);
      }
    } catch (err) {
      console.error("[LikeButton] toggle like err", err);
      setLiked(wasLiked);
      setCount((c) => (wasLiked ? c + 1 : c - 1));
    }
  }

  return (
    <button
      onClick={handleLike}
      className={cn(
        "flex items-center gap-1.5 transition-all",
        liked
          ? "text-[#FF5C5C] bg-[#FFF0F0]"
          : "text-gray-400 hover:text-[#FF5C5C] hover:bg-[#FFF0F0]",
        showLabel
          ? "px-4 py-2 rounded-xl text-sm font-medium"
          : "px-3 py-1.5 rounded-lg text-sm",
        className,
      )}
    >
      <Heart className={cn("w-4 h-4", liked && "fill-current")} />
      {!showLabel && <span className="font-medium">{count}</span>}
      {showLabel && (
        <>
          {count > 0 && <span>{count}</span>}
          <span>{liked ? "좋아요 취소" : "좋아요"}</span>
        </>
      )}
    </button>
  );
}
