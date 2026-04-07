"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { UserPopover } from "../community/UserPopover";
import { ProfileCard } from "@/components/ui/ProfileCard";
import type { Post } from "@/types";
import { PostBadge } from "./PostBadge";
import { PostMenu } from "@/components/community/PostMenu";
import { LikeButton } from "@/components/ui/LikeButton";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

interface Props {
  post: Post;
  userId?: string | null;
}

export const PostCard = React.memo(function PostCard({
  post,
  userId = null,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      {lightboxIndex !== null && post.images && (
        <ImageLightbox
          images={post.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:border-[#FF5C5C]/30 transition-colors">
        {/* Author row */}
        <div className="flex items-center mb-3">
          <UserPopover userId={post.author.id} nickname={post.author.nickname}>
            <ProfileCard
              nickname={post.author.nickname}
              handle={post.author.handle}
              avatarUrl={post.author.avatar_url}
              size="sm"
            />
          </UserPopover>

          {/* Badge + menu row */}
          <PostBadge post={post} />
          <PostMenu
            postId={post.id}
            authorId={post.author.id}
            userId={userId}
            pinned={post.pinned}
            initialValues={{
              title: post.title,
              content: post.content ?? "",
              category: post.category,
              region: post.region,
              images: post.images ?? [],
            }}
            onAfterEdit={() => window.location.reload()}
            onAfterDelete={() => {
              if (
                window.location.pathname.startsWith(`/community/${post.id}`)
              ) {
                window.location.href = "/community";
              } else {
                window.location.reload();
              }
            }}
            onAfterPin={() => window.location.reload()}
          />
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

          {/* Image horizontal scroll */}
          {post.images && post.images.length > 0 && (
            <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-hide -mx-1 px-1">
              {post.images.slice(0, 4).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={url}
                  alt=""
                  onClick={(e) => { e.preventDefault(); setLightboxIndex(i); }}
                  className={`rounded-xl object-cover flex-shrink-0 bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity ${
                    post.images!.length === 1 ? "w-full max-h-[280px]" : "w-[210px] h-[280px]"
                  }`}
                />
              ))}
            </div>
          )}
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
    </>
  );
});
