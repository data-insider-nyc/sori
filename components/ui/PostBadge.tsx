"use client";

import { useState, useEffect } from "react";
import { cn, timeAgo } from "@/lib/utils";
import { getRegions } from "@/lib/regions";
import { getPostCategories, FALLBACK_CATEGORIES } from "@/lib/post-categories";
import { getRegionColor, getCategoryColor } from "@/lib/colors";
import type { Post } from "@/types";
import type { Region } from "@/lib/regions";
import type { PostCategory } from "@/lib/post-categories";

interface Props {
  post: Post;
  userId?: string | null;
  /** Pre-fetched lookup data from the parent feed — avoids per-card async effect.
   *  When omitted (e.g. detail page), falls back to the module-level cached fetch. */
  regions?: Region[];
  categories?: PostCategory[];
}

export function PostBadge({ post, regions: regionsProp, categories: categoriesProp }: Props) {
  const propsProvided = regionsProp !== undefined && categoriesProp !== undefined;

  // Synchronous derivation when parent passes data (feed list — zero flash).
  // Falls back to local state + async fetch when used standalone (detail page).
  const [regions, setRegions] = useState<Region[]>(regionsProp ?? []);
  const [categories, setCategories] = useState<PostCategory[]>(
    categoriesProp ?? FALLBACK_CATEGORIES,
  );

  useEffect(() => {
    if (propsProvided) return; // props are being managed by parent — skip async fetch
    Promise.all([getRegions(), getPostCategories()]).then(([r, c]) => {
      setRegions(r);
      setCategories(c);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep in sync if parent updates props after mount
  useEffect(() => {
    if (regionsProp !== undefined) setRegions(regionsProp);
  }, [regionsProp]);
  useEffect(() => {
    if (categoriesProp !== undefined) setCategories(categoriesProp);
  }, [categoriesProp]);

  const region = post.region_id ? regions.find((r) => r.id === post.region_id) : undefined;
  const cat = categories.find((c) => c.value === post.category);

  const regionValue = region?.value ?? "";
  const regionLabel = region?.label ?? "";
  const regionEmoji = region?.emoji ?? "";
  const catLabel = cat?.label ?? post.category;
  const catEmoji = cat?.emoji ?? "💬";

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
