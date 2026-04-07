"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart, MessageCircle, CornerDownRight } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { getCategoryLabel, getCategoryIcon } from "@/lib/post-categories";
import { timeAgo } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Props {
  userId: string;
  initialPostCount: number;
  initialCommentCount: number;
}

interface PostRow {
  id: string;
  title: string;
  category: string;
  like_count: number;
  comment_count: number;
  created_at: string;
}

interface CommentRow {
  id: string;
  content: string;
  created_at: string;
  post_id: string;
  postTitle: string;
  postCategory: string;
}

export function ProfileActivity({
  userId,
  initialPostCount,
  initialCommentCount,
}: Props) {
  const [tab, setTab] = useState<"posts" | "comments">("posts");
  const [posts, setPosts] = useState<PostRow[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);
  const [fetchedComments, setFetchedComments] = useState(false);

  // Fetch posts on mount
  useEffect(() => {
    async function loadPosts() {
      const supabase = createClient();
      const { data } = await supabase
        .from("posts")
        .select("id, title, category, like_count, comment_count, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      setPosts((data ?? []) as PostRow[]);
      setLoadingPosts(false);
    }
    loadPosts();
  }, [userId]);

  // Fetch comments lazily when tab is switched
  useEffect(() => {
    if (tab !== "comments" || fetchedComments) return;
    async function loadComments() {
      setLoadingComments(true);
      const supabase = createClient();

      const { data: rawComments } = await supabase
        .from("comments")
        .select("id, content, created_at, post_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (!rawComments || rawComments.length === 0) {
        setComments([]);
        setLoadingComments(false);
        setFetchedComments(true);
        return;
      }

      // Batch fetch parent posts
      const postIds = [
        ...new Set(rawComments.map((c: any) => c.post_id as string)),
      ];
      const { data: relatedPosts } = await supabase
        .from("posts")
        .select("id, title, category")
        .in("id", postIds);
      const postMap = Object.fromEntries(
        (relatedPosts ?? []).map((p: any) => [p.id, p]),
      );

      const merged: CommentRow[] = rawComments.map((c: any) => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        post_id: c.post_id,
        postTitle: postMap[c.post_id]?.title ?? "(삭제된 글)",
        postCategory: postMap[c.post_id]?.category ?? "general",
      }));

      setComments(merged);
      setLoadingComments(false);
      setFetchedComments(true);
    }
    loadComments();
  }, [tab, userId, fetchedComments]);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setTab("posts")}
          className={cn(
            "flex-1 py-3.5 text-sm font-bold transition-colors",
            tab === "posts"
              ? "text-[#FF5C5C] border-b-2 border-[#FF5C5C]"
              : "text-gray-400 hover:text-gray-600",
          )}
        >
          작성한 글
          <span
            className={cn(
              "ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full",
              tab === "posts"
                ? "bg-[#FFF0F0] text-[#FF5C5C]"
                : "bg-gray-100 text-gray-400",
            )}
          >
            {initialPostCount}
          </span>
        </button>
        <button
          onClick={() => setTab("comments")}
          className={cn(
            "flex-1 py-3.5 text-sm font-bold transition-colors",
            tab === "comments"
              ? "text-[#FF5C5C] border-b-2 border-[#FF5C5C]"
              : "text-gray-400 hover:text-gray-600",
          )}
        >
          작성한 댓글
          <span
            className={cn(
              "ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full",
              tab === "comments"
                ? "bg-[#FFF0F0] text-[#FF5C5C]"
                : "bg-gray-100 text-gray-400",
            )}
          >
            {initialCommentCount}
          </span>
        </button>
      </div>

      {/* Posts tab */}
      {tab === "posts" && (
        <div>
          {loadingPosts ? (
            <LoadingSkeleton />
          ) : posts.length === 0 ? (
            <EmptyState text="아직 작성한 글이 없어요." />
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              <ul className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/community/${post.id}`}
                      className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">
                        {(() => { const Icon = getCategoryIcon(post.category); return <Icon className="w-4 h-4 text-gray-400" strokeWidth={2} />; })()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-0.5">
                          {post.title}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400">
                          <span>{getCategoryLabel(post.category)}</span>
                          <span>{timeAgo(post.created_at)}</span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" /> {post.like_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />{" "}
                            {post.comment_count}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Comments tab */}
      {tab === "comments" && (
        <div>
          {loadingComments ? (
            <LoadingSkeleton />
          ) : comments.length === 0 ? (
            <EmptyState text="아직 작성한 댓글이 없어요." />
          ) : (
            <div className="max-h-[420px] overflow-y-auto">
              <ul className="divide-y divide-gray-50">
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <Link
                      href={`/community/${comment.post_id}`}
                      className="block px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Which post */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <CornerDownRight className="w-3 h-3 text-gray-300 flex-shrink-0" />
                        <span className="text-xs text-gray-400 line-clamp-1 flex items-center gap-1">
                          {(() => { const Icon = getCategoryIcon(comment.postCategory); return <Icon className="w-3 h-3 flex-shrink-0" strokeWidth={2} />; })()}
                          <span className="font-medium text-gray-500">
                            {comment.postTitle}
                          </span>
                        </span>
                      </div>
                      {/* Comment content */}
                      <p className="text-sm text-gray-700 line-clamp-2 mb-1">
                        {comment.content}
                      </p>
                      <p className="text-xs text-gray-400">
                        {timeAgo(comment.created_at)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-5 space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="text-center py-12 text-gray-400">
      <div className="text-3xl mb-2">📭</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}
