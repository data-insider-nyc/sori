"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { PostForm } from "@/components/community/PostForm";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { cn } from "@/lib/utils";
import type { PostFormValues } from "@/components/community/PostForm";

interface Props {
  post: {
    id: string;
    title?: string | null;
    content: string;
    category: string;
    region_id: number | null;
    authorId: string | null;
  };
  userId: string | null;
}

export function PostDetailActions({ post, userId }: Props) {
  const router = useRouter();
  const { isAdmin } = useIsAdmin();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const isAuthor = !!userId && userId === post.authorId;
  const canManage = isAuthor || isAdmin;

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
    router.refresh();
  }

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

      window.location.href = "/community";
    } catch (err: any) {
      setDeleteError(err.message || "삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  if (!canManage) return null;

  return (
    <>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
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
                  onClick={() => {
                    setMenuOpen(false);
                    setShowEdit(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                  수정하기
                </button>
                <div className="h-px bg-gray-50 mx-2" />
              </>
            )}
            <button
              onClick={() => {
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
