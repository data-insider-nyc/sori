"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { clearFeedCache } from "@/app/community/CommunityListing";
import { PostForm } from "@/components/community/PostForm";
import type { PostFormValues } from "@/components/community/PostForm";

export default function NewPostPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit(values: PostFormValues) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/auth/login"); return; }

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        user_id: user.id,
        title: values.title || null,
        content: values.content,
        region: values.region,
        category: values.category,
        tags: [],
      })
      .select("id")
      .single();

    if (error || !post) throw new Error(error?.message ?? "저장에 실패했습니다.");

    // Auto-like with author's own like (Reddit style)
    await supabase.from("post_likes").insert({ post_id: post.id, user_id: user.id });

    clearFeedCache();
    router.replace(`/community/${post.id}`);
  }

  return (
    <div className="py-4 sm:py-8 max-w-2xl mx-auto">
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-700 transition-colors text-sm"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-black text-gray-900">글쓰기</h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6">
        <PostForm onSubmit={handleSubmit} submitLabel="게시하기" />
      </div>
    </div>
  );
}
