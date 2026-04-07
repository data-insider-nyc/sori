import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-server";
import { getCachedPost } from "@/lib/queries";
import { getCategoryLabel, getCategoryIcon } from "@/lib/post-categories";
import { timeAgo } from "@/lib/utils";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { PostInteractions } from "./PostInteractions";
import { CommentSection } from "./CommentSection";
import { UserPopover } from "@/components/community/UserPopover";
import { PostBadge } from "@/components/ui/PostBadge";
import { PostDetailActions } from "./PostDetailActions";

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

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // post + author from cache (10 min TTL) — eliminates 2 separate DB round-trips
  const post = await getCachedPost(id);
  if (!post) notFound();

  const author = post.author ?? null;

  // Auth + isLiked are user-specific — always fresh
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      <Link
        href="/community"
        className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-6 inline-block"
      >
        ← 커뮤니티
      </Link>

      {/* Post card */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <PostBadge post={post} />
          <PostDetailActions
            post={{
              id: post.id,
              title: post.title,
              content: post.content,
              category: post.category,
              region: post.region,
              images: (post as any).images ?? [],
              authorId: author?.id ?? null,
              pinned: (post as any).pinned,
            }}
            userId={user?.id ?? null}
          />
        </div>

        {/* Title */}
        <h1 className="text-xl font-black text-gray-900 mb-3 leading-snug">
          {post.title}
        </h1>

        {/* Author */}
        {author && (
          <UserPopover userId={author.id} nickname={author.nickname}>
            <div className="mb-5 w-fit cursor-pointer">
              <ProfileCard
                nickname={author.nickname}
                handle={(author as any).handle}
                location={(author as any).location}
                avatarUrl={(author as any).avatar_url}
                size="md"
              />
              <p className="text-xs text-gray-400 mt-1 ml-[52px]">
                {timeAgo(post.created_at)}
              </p>
            </div>
          </UserPopover>
        )}
        {!author && (
          <div className="mb-5">
            <div className="profile-card">
              <div className="avatar av1 w-8 h-8 text-sm opacity-30">?</div>
              <div className="profile-info">
                <div className="display-name">알 수 없음</div>
                <div className="text-xs text-gray-400">
                  {timeAgo(post.created_at)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Images */}
        {(post as any).images?.length > 0 && (
          <div className="mt-4 space-y-2">
            {((post as any).images as string[]).map((url: string, i: number) => (
              <div key={i} className="relative w-full rounded-xl overflow-hidden bg-gray-100">
                <Image src={url} alt="" width={800} height={600} className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>
        )}

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
