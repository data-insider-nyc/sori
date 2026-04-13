import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";

type CreatePostBody = {
  title?: string | null;
  content?: string;
  category?: string;
  region?: string | null;
  images?: string[];
  is_announcement?: boolean;
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = (await req.json().catch(() => ({}))) as CreatePostBody;
  const content = (json.content ?? "").trim();
  if (!content) {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  const payload: {
    user_id: string;
    title: string | null;
    content: string;
    category: string;
    region: string | null;
    images: string[];
    tags: string[];
    is_announcement?: boolean;
  } = {
    user_id: user.id,
    title: (json.title ?? "").trim() || null,
    content,
    category: json.category ?? "general",
    region: json.region ?? null,
    images: Array.isArray(json.images) ? json.images : [],
    tags: [],
  };

  if (json.is_announcement === true) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profile?.is_admin === true) {
      payload.is_announcement = true;
    }
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert(payload)
    .select("id")
    .single();

  if (error || !post) {
    console.error("[POST /api/posts] insert error:", error?.message);
    return NextResponse.json(
      { error: error?.message ?? "Failed to create post" },
      { status: 500 },
    );
  }

  // Best effort: self-like should not fail post creation response.
  const { error: likeError } = await supabase
    .from("post_likes")
    .insert({ post_id: post.id, user_id: user.id });
  if (likeError) {
    console.error("[POST /api/posts] self-like error:", likeError.message);
  }

  revalidateTag("posts", "max");

  return NextResponse.json({ id: post.id }, { status: 201 });
}
