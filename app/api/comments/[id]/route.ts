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

  const db = isAdmin ? createAdminClient() : supabase;

  const { error } = await db.from("comments").delete().eq("id", id);

  if (error) {
    console.error("[DELETE /api/comments] error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    revalidateTag("posts");
  } catch (e) {
    console.warn("[DELETE /api/comments] revalidateTag failed", e);
  }

  return NextResponse.json({ ok: true });
}
