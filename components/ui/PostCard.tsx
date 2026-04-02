"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
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

    // close any open menus after action
    const menu = document.getElementById(`post-menu-${post.id}`);
    if (menu && !menu.classList.contains("hidden")) menu.classList.add("hidden");
  }

  const [showEdit, setShowEdit] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title || "");
  const [editContent, setEditContent] = useState(post.content || "");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  async function handleDelete() {
    if (!userId) return (window.location.href = "/auth/login");
    if (!confirm("Delete this post? This action cannot be undone.")) return;

    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed");

      // navigate away or reload
      if (window.location.pathname.startsWith(`/community/${post.id}`)) {
        window.location.href = "/";
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Failed to delete post:", err);
      alert("삭제에 실패했습니다. 콘솔을 확인하세요.");
    }
  }

  async function openEdit(e?: React.MouseEvent) {
    e?.stopPropagation();
    setEditTitle(post.title || "");
    setEditContent(post.content || "");
    setEditError("");
    setShowEdit(true);
  }

  async function handleEditSave(e?: React.FormEvent) {
    e?.preventDefault();
    if (!userId) return (window.location.href = "/auth/login");
    setEditSaving(true);
    setEditError("");
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle || null, content: editContent }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed");
      // refresh page to reflect changes
      setShowEdit(false);
      window.location.reload();
    } catch (err: any) {
      console.error("Failed to save post:", err);
      setEditError(err.message || "Failed to save");
    } finally {
      setEditSaving(false);
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
          <div className="flex items-center gap-2">
            <PostBadge post={post} />
            {userId === post.author.id && (
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const menu = document.getElementById(`post-menu-${post.id}`);
                    if (menu) menu.classList.toggle("hidden");
                  }}
                  className="p-2 rounded-md hover:bg-gray-50"
                  aria-label="post menu"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-600" />
                </button>

                <div
                  id={`post-menu-${post.id}`}
                  className="hidden absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-lg shadow-sm z-50"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const menu = document.getElementById(`post-menu-${post.id}`);
                      if (menu) menu.classList.add("hidden");
                      openEdit(e);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Edit2 className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const menu = document.getElementById(`post-menu-${post.id}`);
                      if (menu) menu.classList.add("hidden");
                      handleDelete();
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            )}
          </div>
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

      {/* Edit modal */}
      {showEdit && (
        <div
          onClick={() => setShowEdit(false)}
          className="fixed inset-0 bg-black/40 flex items-start justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-xl p-6 border border-gray-100"
          >
            <h2 className="text-lg font-medium mb-3">Edit post</h2>
            <form onSubmit={handleEditSave} className="space-y-3">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Title (optional)"
                className="input-field"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={6}
                className="input-field"
                placeholder="Write something..."
              />
              {editError && <p className="text-sm text-red-500">{editError}</p>}
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowEdit(false)} className="btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={editSaving} className="btn-coral">
                  {editSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
