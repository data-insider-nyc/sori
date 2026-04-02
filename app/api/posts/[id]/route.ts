import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const json = await req.json();
  const supabase = await createClient();

  // Only allow updating title/content/images
  const { title, content, images } = json;

  const updates: any = {};
  if (typeof title !== "undefined") updates.title = title;
  if (typeof content !== "undefined") updates.content = content;
  if (typeof images !== "undefined") updates.images = images;

  const { data, error, status } = await supabase
    .from("posts")
    .update(updates)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status });
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const supabase = await createClient();

  // Soft-delete post (only succeeds if auth.uid() === user_id due to RLS)
  const nowIso = new Date().toISOString();
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .update({ deleted_at: nowIso })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (postError) {
    return NextResponse.json({ error: postError.message }, { status: 500 });
  }

  if (!postData) {
    // No rows updated — either not found or not permitted by RLS
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
  }

  // Soft-delete comments linked to this post
  const { error: commentsError } = await supabase
    .from("comments")
    .update({ deleted_at: nowIso })
    .eq("post_id", id);

  if (commentsError) {
    return NextResponse.json({ error: commentsError.message }, { status: 500 });
  }

  // Set post's comment_count to 0 to reflect deletions
  const { error: updateCountError } = await supabase
    .from("posts")
    .update({ comment_count: 0 })
    .eq("id", id);

  if (updateCountError) {
    return NextResponse.json({ error: updateCountError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
