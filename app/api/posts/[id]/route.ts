import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Toggle like for the authenticated user on this post and revalidate posts tag
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // See if like exists (use admin client so DB trigger can update posts despite RLS)
  const admin = createAdminClient();
  const { data: existing, error: selErr } = await admin
    .from("post_likes")
    .select("post_id")
    .eq("post_id", id)
    .eq("user_id", user.id)
    .maybeSingle();
  if (selErr) {
    console.error("[POST /api/posts/:id] select like err", selErr);
    return NextResponse.json({ error: selErr.message }, { status: 500 });
  }

  if (existing) {
    const { error } = await admin.from("post_likes").delete().match({ post_id: id, user_id: user.id });
    if (error) {
      console.error("[POST /api/posts/:id] delete like err", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await admin.from("post_likes").insert({ post_id: id, user_id: user.id });
    if (error) {
      console.error("[POST /api/posts/:id] insert like err", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  // get updated like_count using admin client for consistent view
  const { data: postData, error: postErr } = await admin.from("posts").select("like_count").eq("id", id).maybeSingle();
  if (postErr) console.error("[POST /api/posts/:id] fetch post err", postErr);

  try {
    // @ts-ignore
    revalidateTag("posts");
  } catch (e) {
    console.warn("[POST /api/posts/:id] revalidateTag failed", e);
  }

  return NextResponse.json({ ok: true, like_count: postData?.like_count ?? null });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const json = await req.json();
  const supabase = await createClient();

  // Handle pinned updates separately and require admin
  if (typeof json.pinned !== "undefined") {
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
    if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    // Use admin client to bypass RLS for pinned flag
    const admin = createAdminClient();
    const pinned = !!json.pinned;
    const pinnedUpdates: any = { pinned };
    if (pinned) {
      pinnedUpdates.pinned_by = user.id;
      pinnedUpdates.pinned_at = new Date().toISOString();
    } else {
      pinnedUpdates.pinned_by = null;
      pinnedUpdates.pinned_at = null;
    }

    const { data, error, status } = await admin
      .from("posts")
      .update(pinnedUpdates)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.error("[PATCH /api/posts pinned]", error);
      return NextResponse.json({ error: error.message }, { status });
    }

    try {
      // @ts-ignore - Next's revalidateTag typing may require extra args in this environment
      revalidateTag("posts");
    } catch (e) {
      console.warn("[PATCH /api/posts] revalidateTag failed", e);
    }

    return NextResponse.json(data);
  }

  // Fallback: regular post updates (title/content/images)
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Not found or not authorized" }, { status: 403 });

  // Invalidate cached posts so the post detail page reflects the change immediately
  try {
    // @ts-ignore - Next's revalidateTag typing may require extra args in this environment
    revalidateTag("posts");
  } catch (e) {
    console.warn("[PATCH /api/posts] revalidateTag failed", e);
  }

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

  try {
    // @ts-ignore - Next's revalidateTag typing may require extra args in this environment
    revalidateTag("posts");
  } catch (e) {
    console.warn("[DELETE /api/posts] revalidateTag failed", e);
  }

  return NextResponse.json({ ok: true });
}
