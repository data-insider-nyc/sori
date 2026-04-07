"use client";

import { useEffect, useRef, useState } from "react";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { PostForm } from "@/components/community/PostForm";
import type { PostFormValues } from "@/components/community/PostForm";

interface Props {
  postId: string;
  /** Author's profile id — used to determine if current user can edit */
  authorId: string | null;
  /** Currently authenticated user id */
  userId: string | null;
  /** Whether the post is currently pinned */
  pinned?: boolean;
  /** Prepopulate the edit form */
  initialValues: {
    title?: string | null;
    content: string;
    category: string;
    region?: string | null;
  };
  /** Called after a successful edit. Use router.refresh() on detail page,
   *  window.location.reload() on listing. */
  onAfterEdit?: () => void;
  /** Called after a successful delete. Redirect or reload as needed. */
  onAfterDelete?: () => void;
  /** Called after a successful pin toggle. */
  onAfterPin?: () => void;
}

export function PostMenu({
  postId,
  authorId,
  userId,
  pinned = false,
  initialValues,
  onAfterEdit,
  onAfterDelete,
  onAfterPin,
}: Props) {
  const { isAdmin } = useIsAdmin();
  const isAuthor = !!userId && userId === authorId;
  const canManage = isAuthor || isAdmin;

  const [menuOpen, setMenuOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

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

  async function handleEditSave(values: PostFormValues) {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    const res = await fetch(`/api/posts/${postId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: values.title || null,
        content: values.content,
        category: values.category,
        region: values.region,
      }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || "수정에 실패했습니다.");
    }
    setShowEdit(false);
    onAfterEdit?.();
  }

  async function handlePinToggle() {
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pinned: !pinned }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "핀 변경에 실패했습니다.");
      }
      onAfterPin?.();
    } catch (err) {
      console.error("Pin toggle failed", err);
      alert("핀 변경에 실패했습니다.");
    }
  }

  async function handleDelete() {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    setDeleting(true);
    setDeleteError("");
    try {
      const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "삭제에 실패했습니다.");
      }
      setShowDeleteConfirm(false);
      onAfterDelete?.();
    } catch (err: any) {
      setDeleteError(err.message || "삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  if (!canManage) return null;

  return (
    <>
      {/* ── Trigger + dropdown (both in relative container for correct positioning) ── */}
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

        {menuOpen && (
          <div className="absolute right-0 top-full mt-1.5 w-36 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden py-1">
            {isAuthor && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    setShowEdit(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                  수정하기
                </button>
                <div className="h-px bg-gray-100 mx-2" />
              </>
            )}

            {isAdmin && (
              <>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    await handlePinToggle();
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
                      strokeWidth="0"
                      fill="currentColor"
                    />
                  </svg>
                  {pinned ? "추천 해제" : "운영진 추천"}
                </button>
                <div className="h-px bg-gray-100 mx-2" />
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

      {/* ── Edit modal ── */}
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
                  title: initialValues.title ?? "",
                  content: initialValues.content,
                  category: initialValues.category as any,
                  region: initialValues.region ?? null,
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

      {/* ── Delete confirmation modal ── */}
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
            <h3 className="font-bold text-gray-900 mb-1.5">게시글을 삭제할까요?</h3>
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
