"use client";

import { useRouter } from "next/navigation";
import { PostMenu } from "@/components/community/PostMenu";

interface Props {
  post: {
    id: string;
    title?: string | null;
    content: string;
    category: string;
    region: string | null;
    authorId: string | null;
    pinned?: boolean;
  };
  userId: string | null;
}

export function PostDetailActions({ post, userId }: Props) {
  const router = useRouter();

  return (
    <PostMenu
      postId={post.id}
      authorId={post.authorId}
      userId={userId}
      pinned={post.pinned}
      initialValues={{
        title: post.title,
        content: post.content,
        category: post.category,
        region: post.region,
      }}
      onAfterEdit={() => router.refresh()}
      onAfterDelete={() => { window.location.href = "/community"; }}
      onAfterPin={() => router.refresh()}
    />
  );
}
