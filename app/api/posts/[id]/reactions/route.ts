import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: postId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json().catch(() => ({}));
  const reaction =
    typeof json?.reaction === "string" ? json.reaction.trim() : "";
  if (!reaction) {
    return NextResponse.json({ error: "Missing reaction" }, { status: 400 });
  }

  // Use admin client to avoid any RLS edge cases and to allow the trigger that
  // updates posts.reaction_counts to always run.
  const admin = createAdminClient();

  const { data: existing, error: selErr } = await admin
    .from("post_reactions")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .eq("reaction", reaction)
    .maybeSingle();

  if (selErr) {
    console.error("[POST /api/posts/:id/reactions] select err", selErr);
    return NextResponse.json({ error: selErr.message }, { status: 500 });
  }

  let reacted: boolean;
  if (existing) {
    const { error } = await admin
      .from("post_reactions")
      .delete()
      .match({ post_id: postId, user_id: user.id, reaction });

    if (error) {
      console.error("[POST /api/posts/:id/reactions] delete err", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    reacted = false;
  } else {
    const { error } = await admin
      .from("post_reactions")
      .insert({ post_id: postId, user_id: user.id, reaction });

    if (error) {
      console.error("[POST /api/posts/:id/reactions] insert err", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    reacted = true;
  }

  // Read the updated cached counts from posts.reaction_counts (maintained by trigger).
  const { data: post, error: postErr } = await admin
    .from("posts")
    .select("reaction_counts")
    .eq("id", postId)
    .maybeSingle();

  if (postErr) {
    console.error("[POST /api/posts/:id/reactions] fetch post err", postErr);
    return NextResponse.json({ error: postErr.message }, { status: 500 });
  }

  const reactionCounts =
    post?.reaction_counts && typeof post.reaction_counts === "object"
      ? (post.reaction_counts as Record<string, unknown>)
      : null;

  const countRaw = reactionCounts?.[reaction];

  const count =
    typeof countRaw === "number"
      ? countRaw
      : typeof countRaw === "string"
        ? Number(countRaw) || 0
        : 0;

  try {
    // @ts-ignore
    revalidateTag("posts");
  } catch (e) {
    console.warn("[POST /api/posts/:id/reactions] revalidateTag failed", e);
  }

  return NextResponse.json({ count, reacted });
}

