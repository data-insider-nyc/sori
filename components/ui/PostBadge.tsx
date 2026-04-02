"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { getRegions } from "@/lib/regions";
import { getPostCategories } from "@/lib/post-categories";
import { getRegionColor, getCategoryColor } from "@/lib/colors";
import type { Post } from "@/types";

interface Props {
  post: Post;
  userId?: string | null;
}

export function PostBadge({ post }: Props) {
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

  return (
    <div className="flex items-center gap-1.5 ml-auto">
      {/* Region badge — first */}
      {regionLabel && (
        <span
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
            getRegionColor(regionValue).bg,
            getRegionColor(regionValue).text,
          )}
        >
          {regionEmoji} {regionLabel}
        </span>
      )}
      {/* Category badge — second */}
      <span
        className={cn(
          "text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0",
          getCategoryColor(post.category).bg,
          getCategoryColor(post.category).text,
        )}
      >
        {catEmoji} {catLabel}
      </span>
      <span className="text-xs text-gray-400 flex-shrink-0">
        {timeAgo(post.created_at)}
      </span>
    </div>
  );
}
