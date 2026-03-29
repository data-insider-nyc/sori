"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { getRegions } from "@/lib/regions";
import { getPostCategories } from "@/lib/post-categories";
import { getRegionColor, getCategoryColor } from "@/lib/colors";
import { createClient } from "@/lib/supabase-browser";
import { UserPopover } from "../community/UserPopover";
import { ProfileCard } from "@/components/ui/ProfileCard";
import type { Post } from "@/types";
import { PostBadge } from "./PostBadge";

interface Props {
  post: Post;
  userId?: string | null;
}

export function PostCard({ post, userId = null }: Props) {
  const [liked, setLiked] = useState(post.is_liked ?? false);
  const [count, setCount] = useState(post.like_count);
  const [regionValue, setRegionValue] = useState("");
  const [regionLabel, setRegionLabel] = useState("");
  const [regionEmoji, setRegionEmoji] = useState("");
  const [catLabel, setCatLabel] = useState<string>(post.category);
  const [catEmoji, setCatEmoji] = useState<string>("💬");

  useEffect(() => {
    (async () => {
      const [regions, cats] = await Promise.all([
        getRegions(),
        getPostCategories(),
      ]);

      if (post.region_id) {
        const region = regions.find((r) => r.id === post.region_id);
        if (region) {
          setRegionValue(region.value);
          setRegionLabel(region.label);
          setRegionEmoji(region.emoji);
        }
      }

      const cat = cats.find((c) => c.value === post.category);
      if (cat) {
        setCatLabel(cat.label);
        setCatEmoji(cat.emoji);
      }
    })();
  }, [post.region_id, post.category]);

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
        .match({ post_id: post.id, user_id: userId });
    } else {
      await supabase
        .from("post_likes")
        .insert({ post_id: post.id, user_id: userId });
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-[#FF5C5C]/30 transition-colors">
      {/* Author row */}
      <UserPopover userId={post.author.id} nickname={post.author.nickname}>
        <div className="flex items-center justify-between mb-3">
          <ProfileCard
            nickname={post.author.nickname}
            handle={post.author.handle}
            size="sm"
          />
          <PostBadge post={post} />
        </div>
      </UserPopover>

      {/* Title + content */}
      <Link href={`/community/${post.id}`} className="block group">
        {post.title && (
          <p className="font-bold text-gray-900 text-sm mb-1 group-hover:text-[#FF5C5C] transition-colors line-clamp-1">
            {post.title}
          </p>
        )}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {post.content}
        </p>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 mt-4 pt-3 border-t border-gray-50">
        <button
          onClick={handleLike}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all",
            liked
              ? "text-[#FF5C5C] bg-[#FFF0F0]"
              : "text-gray-400 hover:text-[#FF5C5C] hover:bg-[#FFF0F0]",
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
