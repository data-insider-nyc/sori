/**
 * Keep-alive endpoint for Supabase free tier.
 * Free tier pauses the DB after 7 days of inactivity — first request after
 * pause takes 2-5 seconds (cold start). A periodic ping prevents this.
 *
 * Vercel Cron calls this every 10 minutes (see vercel.json).
 */
import { supabase } from "@/lib/supabase";

export const runtime = "edge";

export async function GET() {
  const start = Date.now();
  const { error } = await supabase.from("profiles").select("id").limit(1);
  const ms = Date.now() - start;

  if (error) {
    return Response.json({ ok: false, error: error.message, ms }, { status: 500 });
  }
  return Response.json({ ok: true, ms });
}
