import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

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

  // Identify caller
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check admin status
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  const isAdmin = profile?.is_admin === true;

  // Admin: use service role to bypass RLS
  const db = isAdmin ? createAdminClient() : supabase;

  // Hard delete — RLS own_post or admin_delete_post policy permits this
  const { error } = await db.from("posts").delete().eq("id", id);

  if (error) {
    console.error("[DELETE /api/posts] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
