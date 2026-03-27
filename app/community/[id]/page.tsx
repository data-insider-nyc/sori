import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { getCachedPost } from "@/lib/queries";
import { getCategoryLabel, getCategoryEmoji } from "@/lib/constants";
import { getInitials, avatarTextColor, timeAgo } from "@/lib/utils";
import { PostInteractions } from "./PostInteractions";
import { CommentSection }   from "./CommentSection";
import { UserPopover } from "@/components/community/UserPopover";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getCachedPost(id);
  if (!post) return { title: "게시글 | 소리" };

  const description = post.content
    ? post.content.slice(0, 120).replace(/\n/g, " ")
    : `${getCategoryLabel(post.category)} — 소리 커뮤니티`;

  return {
    title: post.title,
    description,
    openGraph: {
      title: `${post.title} | 소리 커뮤니티`,
      description,
      url: `/community/${id}`,
      type: "article",
    },
    twitter: { card: "summary", title: post.title, description },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // post + author from cache (10 min TTL) — eliminates 2 separate DB round-trips
  const post = await getCachedPost(id);
  if (!post) notFound();

  const author = post.author ?? null;

  // Auth + isLiked are user-specific — always fresh
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isLiked = false;
  if (user) {
    const { data: like } = await supabase
      .from("post_likes")
      .select("post_id")
      .match({ post_id: id, user_id: user.id })
      .maybeSingle();
    isLiked = !!like;
  }

  return (
    <div className="py-6 max-w-2xl mx-auto">
      <Link href="/community" className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 inline-block">
        ← 커뮤니티
      </Link>

      {/* Post card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
        {/* Category badge */}
        <span className="inline-flex items-center gap-1 text-xs bg-[#FFF0F0] text-[#FF5C5C] font-semibold px-2.5 py-1 rounded-full mb-4">
          {getCategoryEmoji(post.category)} {getCategoryLabel(post.category)}
        </span>

        {/* Title */}
        <h1 className="text-xl font-black text-gray-900 mb-3 leading-snug">{post.title}</h1>

        {/* Author */}
        {author && (
          <UserPopover userId={author.id} nickname={author.nickname}>
            <div className="flex items-center gap-2.5 mb-5 w-fit cursor-pointer">
              <div
                  style={{ color: avatarTextColor(author.nickname) }}
                  className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                >
                  {getInitials(author.nickname)}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{author.nickname}</p>
                <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
              </div>
            </div>
          </UserPopover>
        )}
        {!author && (
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-gray-400">
              ?
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">알 수 없음</p>
              <p className="text-xs text-gray-400">{timeAgo(post.created_at)}</p>
            </div>
          </div>
        )}

        {/* Content */}
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* Like / comment counts */}
        <PostInteractions
          postId={post.id}
          likeCount={post.like_count}
          commentCount={post.comment_count}
          isLiked={isLiked}
          userId={user?.id ?? null}
        />
      </div>

      {/* Comments */}
      <CommentSection postId={post.id} userId={user?.id ?? null} />
    </div>
  );
}
