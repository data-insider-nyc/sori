import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const json = await req.json().catch(() => ({}));
  const { post_id, content, parent_id } = json as { post_id?: string; content?: string; parent_id?: string | null };
  if (!post_id || !content) {
    return NextResponse.json({ error: "Missing post_id or content" }, { status: 400 });
  }

  const { error } = await supabase.from("comments").insert({
    post_id,
    user_id: user.id,
    content,
    parent_id: parent_id ?? null,
  });

  if (error) {
    console.error('[POST /api/comments] insert error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidateTag("posts", "max");

  return NextResponse.json({ ok: true });
}
