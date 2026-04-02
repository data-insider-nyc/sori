import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const json = await req.json();
  const supabase = await createClient();

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

  if (error) {
    console.error("[PATCH /api/posts]", error);
    return NextResponse.json({ error: error.message }, { status });
  }
  if (!data) return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
  return NextResponse.json(data);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const nowIso = new Date().toISOString();

  // Try soft-delete first; falls back to hard-delete if deleted_at column doesn't exist
  const { data: postData, error: postError } = await supabase
    .from("posts")
    .update({ deleted_at: nowIso })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (postError) {
    console.error("[DELETE /api/posts] soft-delete error:", postError.message, postError.code);

    // Column doesn't exist yet → fall back to hard delete
    if (postError.code === "42703") {
      const { error: hardErr } = await supabase.from("posts").delete().eq("id", id);
      if (hardErr) {
        console.error("[DELETE /api/posts] hard-delete fallback error:", hardErr.message);
        return NextResponse.json({ error: hardErr.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true, mode: "hard" });
    }

    return NextResponse.json({ error: postError.message }, { status: 500 });
  }

  if (!postData) {
    return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });
  }

  // Soft-delete associated comments (ignore error if column missing — non-fatal)
  const { error: commentsError } = await supabase
    .from("comments")
    .update({ deleted_at: nowIso })
    .eq("post_id", id);

  if (commentsError && commentsError.code !== "42703") {
    console.error("[DELETE /api/posts] comments soft-delete error:", commentsError.message);
  }

  await supabase.from("posts").update({ comment_count: 0 }).eq("id", id);

  return NextResponse.json({ ok: true, mode: "soft" });
}
