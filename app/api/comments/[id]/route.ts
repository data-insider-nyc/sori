import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.is_admin === true;

  const { data: target, error: targetError } = await supabase
    .from("comments")
    .select("id, user_id, parent_id")
    .eq("id", id)
    .maybeSingle();

  if (targetError) {
    console.error("[DELETE /api/comments] target lookup error:", targetError.message);
    return NextResponse.json({ error: targetError.message }, { status: 500 });
  }
  if (!target) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!isAdmin && target.user_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Use admin client for deterministic soft-delete updates after auth checks above.
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();

  const { data: deleted, error } = await admin
    .from("comments")
    .update({ deleted_at: nowIso })
    .eq("id", id)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[DELETE /api/comments] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!deleted) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  // One-level replies: when a parent is deleted, hide direct replies as well.
  if (!target.parent_id) {
    const { error: replyError } = await admin
      .from("comments")
      .update({ deleted_at: nowIso })
      .eq("parent_id", id)
      .is("deleted_at", null);

    if (replyError) {
      console.error("[DELETE /api/comments] soft-delete replies error:", replyError.message);
      return NextResponse.json({ error: replyError.message }, { status: 500 });
    }
  }

  revalidateTag("posts", "max");

  return NextResponse.json({ ok: true });
}
