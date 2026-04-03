import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const postIds = Array.isArray(json?.post_ids) ? json.post_ids : [];
    if (postIds.length === 0) return NextResponse.json({ liked: [] });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ liked: [] });

    const { data: likes, error } = await supabase
      .from("post_likes")
      .select("post_id")
      .eq("user_id", user.id)
      .in("post_id", postIds);

    if (error) {
      console.error("[POST /api/posts/likes] fetch err", error);
      return NextResponse.json({ liked: [] });
    }

    const likedIds = (likes ?? []).map((l: any) => l.post_id);
    return NextResponse.json({ liked: likedIds });
  } catch (err) {
    console.error("[POST /api/posts/likes] err", err);
    return NextResponse.json({ liked: [] });
  }
}
