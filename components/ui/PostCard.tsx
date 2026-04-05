"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MessageCircle, MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { getRegions } from "@/lib/regions";
import { getPostCategories } from "@/lib/post-categories";
import { UserPopover } from "../community/UserPopover";
import { ProfileCard } from "@/components/ui/ProfileCard";
import type { Post } from "@/types";
import { PostBadge } from "./PostBadge";
import { PostForm } from "@/components/community/PostForm";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import type { PostFormValues } from "@/components/community/PostForm";
import { LikeButton } from "@/components/ui/LikeButton";

interface Props {
  post: Post;
  userId?: string | null;
}

export function PostCard({ post, userId = null }: Props) {
  const { isAdmin } = useIsAdmin();
  const [regionValue, setRegionValue] = useState("");
  const [regionLabel, setRegionLabel] = useState("");
  const [regionEmoji, setRegionEmoji] = useState("");
  const [catLabel, setCatLabel] = useState<string>(post.category);
  const [catEmoji, setCatEmoji] = useState<string>("💬");

  // Menu / modal state
  const [menuOpen, setMenuOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [menuOpen]);

  function openEdit(e?: React.MouseEvent) {
    e?.stopPropagation();
    setMenuOpen(false);
    setShowEdit(true);
  }

  async function handleEditSave(values: PostFormValues) {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: values.title || null,
          content: values.content,
          category: values.category,
          region_id: values.region_id,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "수정에 실패했습니다.");
      }
      setShowEdit(false);
      window.location.reload();
    } catch (err: any) {
      console.error("[PostCard] edit failed", err);
      throw err;
    }
  }

  const [deleteError, setDeleteError] = useState("");

  async function handleDelete() {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/posts/${post.id}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "삭제에 실패했습니다.");
      }

      setShowDeleteConfirm(false);
      if (window.location.pathname.startsWith(`/community/${post.id}`)) {
        window.location.href = "/community";
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      console.error("Delete failed:", err);
      setDeleteError(err.message || "삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  const isAuthor = userId === post.author.id;

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-[#FF5C5C]/30 transition-colors">
        {/* Author row */}
        <div className="flex items-center justify-between mb-3">
          <UserPopover userId={post.author.id} nickname={post.author.nickname}>
            <ProfileCard
              nickname={post.author.nickname}
              handle={post.author.handle}
              avatarUrl={post.author.avatar_url}
              size="sm"
            />
          </UserPopover>
          <div className="flex items-center gap-2">
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
                {isAuthor && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEdit(e);
                      }}
                      className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                      수정하기
                    </button>
                    <div className="h-px bg-gray-50 mx-2" />
                  </>
                )}

                {/* Admin pin/unpin */}
                {isAdmin && (
                  <>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        setMenuOpen(false);
                        try {
                          const res = await fetch(`/api/posts/${post.id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ pinned: !post.pinned }),
                          });
                          if (!res.ok) {
                            const body = await res.json().catch(() => ({}));
                            throw new Error(
                              body.error || "핀 변경에 실패했습니다.",
                            );
                          }
                          // refresh to reflect pinned state in sidebar
                          window.location.reload();
                        } catch (err) {
                          console.error("Pin toggle failed", err);
                          alert("핀 변경에 실패했습니다.");
                        }
                      }}
                      className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <svg
                        className="w-3.5 h-3.5 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2l2 6h6l-4.5 3.5L18 20l-6-3.5L6 20l1.5-8.5L3 8h6l2-6z"
                          stroke="currentColor"
                          strokeWidth="0"
                          fill="currentColor"
                        />
                      </svg>
                      {post.pinned ? "추천 해제" : "운영진 추천"}
                    </button>
                    <div className="h-px bg-gray-50 mx-2" />
                  </>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setShowDeleteConfirm(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PostBadge post={post} />
          {(isAuthor || isAdmin) && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen((v) => !v);
                }}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  menuOpen
                    ? "bg-gray-100 text-gray-700"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-700",
                )}
                aria-label="게시글 메뉴"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

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
          <LikeButton
            postId={post.id}
            initialCount={post.like_count}
            initialLiked={post.is_liked ?? false}
            userId={userId}
          />
          <Link
            href={`/community/${post.id}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">{post.comment_count}</span>
          </Link>
        </div>
      </div>

      {/* ── Edit modal ─────────────────────────────── */}
      {showEdit && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEdit(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">글 수정</h2>
              <button
                onClick={() => setShowEdit(false)}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-5">
              <PostForm
                initialValues={{
                  title: post.title ?? "",
                  content: post.content ?? "",
                  category: post.category as any,
                  region_id: post.region_id ?? null,
                }}
                onSubmit={handleEditSave}
                onCancel={() => setShowEdit(false)}
                submitLabel="저장하기"
                compact
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Delete confirmation modal ──────────────── */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => !deleting && setShowDeleteConfirm(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="font-bold text-gray-900 mb-1.5">
              게시글을 삭제할까요?
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              삭제된 글과 댓글은 복구할 수 없습니다.
            </p>
            {deleteError && (
              <p className="text-xs text-red-500 mb-3">{deleteError}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="btn-outline flex-1 text-sm"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 text-sm font-semibold bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50"
              >
                {deleting ? "삭제 중..." : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
