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
    images?: string[] | null;
    authorId: string | null;
    pinned?: boolean;
    isAnnouncement?: boolean;
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
      isAnnouncement={post.isAnnouncement}
      initialValues={{
        title: post.title,
        content: post.content,
        category: post.category,
        region: post.region,
        images: post.images ?? [],
      }}
      onAfterEdit={() => router.refresh()}
      onAfterDelete={() => { router.push("/community"); }}
      onAfterPin={() => router.refresh()}
      onAfterAnnouncement={() => router.refresh()}
    />
  );
}
