"use client";

import { useState, useEffect, useCallback } from "react";
import { CornerDownRight, Trash2 } from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";
import { UserPopover } from "@/components/community/UserPopover";
import { ProfileAvatar } from "@/components/ui/ProfileCard";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import type { Comment } from "@/types";

interface Props {
  postId: string;
  userId: string | null;
}

const COMMENT_MAX = 500;
const REPLY_MAX = 300;
const CACHE_TTL = 3 * 60 * 1000; // 3 minutes

// Module-level cache keyed by postId
type CommentCacheEntry = { comments: Comment[]; ts: number };
const commentCache = new Map<string, CommentCacheEntry>();

export function CommentSection({ postId, userId }: Props) {
  const { isAdmin } = useIsAdmin();
  const cached = commentCache.get(postId);
  const fresh = cached && Date.now() - cached.ts < CACHE_TTL;

  const [comments, setComments] = useState<Comment[]>(
    fresh ? cached.comments : [],
  );
  const [loading, setLoading] = useState(!fresh);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const supabase = createClient();

  const fetchComments = useCallback(
    async ({ bust = false }: { bust?: boolean } = {}) => {
      const entry = commentCache.get(postId);
      const isFresh = !bust && entry && Date.now() - entry.ts < CACHE_TTL;
      if (isFresh) {
        setComments(entry.comments);
        setLoading(false);
        return;
      }

      // Single query: comments + author via FK join (no separate profiles round-trip)
      const { data: raw } = await supabase
        .from("comments")
        .select("*, author:profiles!user_id(id, nickname, handle, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

      const rawComments = raw ?? [];
      if (rawComments.length === 0) {
        setComments([]);
        commentCache.set(postId, { comments: [], ts: Date.now() });
        setLoading(false);
        return;
      }

      // Build tree
      const all: Comment[] = rawComments.map((c: any) => ({
        ...c,
        author: c.author ?? { id: c.user_id ?? "", nickname: "알 수 없음" },
      }));

      const top = all.filter((c) => !c.parent_id);
      const replies = all.filter((c) => c.parent_id);
      const tree = top.map((c) => ({
        ...c,
        replies: replies.filter((r) => r.parent_id === c.id),
      }));

      commentCache.set(postId, { comments: tree, ts: Date.now() });
      setComments(tree);
      setLoading(false);
    },
    [postId],
  );

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function submitComment() {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    if (!commentText.trim()) return;
    setSubmitting(true);
    setCommentError("");
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ post_id: postId, content: commentText.trim() }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setCommentError(body.error || "댓글 등록에 실패했어요. 다시 시도해주세요.");
        setSubmitting(false);
        return;
      }
      setCommentText("");
      await fetchComments({ bust: true });
    } catch (err) {
      console.error(err);
      setCommentError("댓글 등록에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitReply(parentId: string) {
    if (!userId) {
      window.location.href = "/auth/login";
      return;
    }
    if (!replyText.trim()) return;
    setSubmitting(true);
    setCommentError("");
    try {
      const res = await fetch(`/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ post_id: postId, content: replyText.trim(), parent_id: parentId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setCommentError(body.error || "답글 등록에 실패했어요. 다시 시도해주세요.");
        setSubmitting(false);
        return;
      }
      setReplyText("");
      setReplyingTo(null);
      await fetchComments({ bust: true });
    } catch (err) {
      console.error(err);
      setCommentError("답글 등록에 실패했어요. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  async function deleteComment(commentId: string) {
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) {
        console.error("Failed to delete comment", await res.text().catch(() => ""));
      }
    } catch (err) {
      console.error(err);
    }
    await fetchComments({ bust: true });
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
      <h2 className="text-sm font-bold text-gray-900 mb-5">
        댓글{" "}
        {comments.reduce((acc, c) => acc + 1 + (c.replies?.length ?? 0), 0)}개
      </h2>

      {/* Comment input */}
      <div className="mb-6">
        <div className="relative">
          <textarea
            value={commentText}
            onChange={(e) =>
              setCommentText(e.target.value.slice(0, COMMENT_MAX))
            }
            placeholder={
              userId
                ? "댓글을 남겨보세요..."
                : "로그인 후 댓글을 작성할 수 있어요"
            }
            rows={3}
            disabled={!userId}
            className="input-field resize-none text-sm"
          />
          <span className="absolute bottom-2 right-3 text-[11px] text-gray-300">
            {COMMENT_MAX - commentText.length}
          </span>
        </div>
        {commentError && (
          <p className="text-xs text-red-500 mt-1">{commentError}</p>
        )}
        <div className="flex justify-end mt-2">
          <button
            onClick={submitComment}
            disabled={!commentText.trim() || submitting}
            className="btn-coral text-sm !py-1.5 !px-4 disabled:opacity-40"
          >
            댓글 등록
          </button>
        </div>
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-sm text-gray-400 py-8">
          첫 번째 댓글을 남겨보세요 💬
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                userId={userId}
                isAdmin={isAdmin}
                onDelete={deleteComment}
                onReply={() =>
                  setReplyingTo(replyingTo === comment.id ? null : comment.id)
                }
              />

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 mt-2 space-y-2">
                  {comment.replies.map((reply) => (
                    <CommentItem
                      key={reply.id}
                      comment={reply}
                      userId={userId}
                      isAdmin={isAdmin}
                      onDelete={deleteComment}
                      isReply
                    />
                  ))}
                </div>
              )}

              {/* Reply input */}
              {replyingTo === comment.id && (
                <div className="ml-8 mt-2">
                  <div className="relative">
                    <textarea
                      value={replyText}
                      onChange={(e) =>
                        setReplyText(e.target.value.slice(0, REPLY_MAX))
                      }
                      placeholder="대댓글을 입력하세요..."
                      rows={2}
                      className="input-field resize-none text-sm"
                      autoFocus
                    />
                    <span className="absolute bottom-2 right-3 text-[11px] text-gray-300">
                      {REPLY_MAX - replyText.length}
                    </span>
                  </div>
                  <div className="flex justify-end gap-2 mt-1.5">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="text-xs text-gray-400 hover:text-gray-600 px-3 py-1.5"
                    >
                      취소
                    </button>
                    <button
                      onClick={() => submitReply(comment.id)}
                      disabled={!replyText.trim() || submitting}
                      className="btn-coral text-xs !py-1.5 !px-3 disabled:opacity-40"
                    >
                      등록
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommentItem({
  comment,
  userId,
  isAdmin = false,
  onDelete,
  onReply,
  isReply = false,
}: {
  comment: Comment;
  userId: string | null;
  isAdmin?: boolean;
  onDelete: (id: string) => void;
  onReply?: () => void;
  isReply?: boolean;
}) {
  return (
    <div className={cn("flex gap-2.5", isReply && "items-start")}>
      {isReply && (
        <CornerDownRight className="w-3.5 h-3.5 text-gray-300 mt-2 flex-shrink-0" />
      )}
      <UserPopover
        userId={comment.author.id}
        nickname={comment.author.nickname}
      >
        <ProfileAvatar
          nickname={comment.author.nickname}
          avatarUrl={comment.author.avatar_url}
          size="sm"
          className="w-7 h-7 text-xs"
        />
      </UserPopover>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <UserPopover
            userId={comment.author.id}
            nickname={comment.author.nickname}
          >
            <span className="text-xs font-semibold text-gray-900 cursor-pointer hover:text-[#FF5C5C] transition-colors">
              {comment.author.nickname}
            </span>
          </UserPopover>
          {comment.author.handle && (
            <span className="text-[10px] text-gray-400">
              @{comment.author.handle}
            </span>
          )}
          <span className="text-[10px] text-gray-400">
            {timeAgo(comment.created_at)}
          </span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">
          {comment.content}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {!isReply && onReply && (
            <button
              onClick={onReply}
              className="text-[11px] text-gray-400 hover:text-[#FF5C5C] transition-colors"
            >
              답글
            </button>
          )}
          {(userId === comment.author.id || isAdmin) && (
            <button
              onClick={() => onDelete(comment.id)}
              className="text-[11px] text-gray-300 hover:text-red-400 transition-colors flex items-center gap-0.5"
            >
              <Trash2 className="w-2.5 h-2.5" />
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
