"use client";

import { cn, recencyLabel, timeAgo } from "@/lib/utils";
import { getRegionLabel, getRegionIcon } from "@/lib/regions";
import { getCategoryLabel, getCategoryIcon } from "@/lib/post-categories";
import { getRegionColor, getCategoryColor } from "@/lib/colors";
import type { Post } from "@/types";

interface Props {
  post: Post;
  timeVariant?: "relative" | "bucket";
}

export function PostBadge({ post, timeVariant = "relative" }: Props) {
  const CatIcon = getCategoryIcon(post.category);
  const RegionIcon = post.region ? getRegionIcon(post.region) : null;
  const timeLabel =
    timeVariant === "bucket"
      ? recencyLabel(post.created_at)
      : timeAgo(post.created_at);

  return (
    <div className="flex items-center gap-1.5 ml-auto">
      {post.region && RegionIcon && (
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-1",
            getRegionColor(post.region).bg,
            getRegionColor(post.region).text,
          )}
        >
          <RegionIcon className="w-3 h-3" strokeWidth={2} />
          {getRegionLabel(post.region)}
        </span>
      )}
      <span
        className={cn(
          "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 inline-flex items-center gap-1",
          getCategoryColor(post.category).bg,
          getCategoryColor(post.category).text,
        )}
      >
        <CatIcon className="w-3 h-3" strokeWidth={2} />
        {getCategoryLabel(post.category)}
      </span>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {timeLabel}
      </span>
    </div>
  );
}

