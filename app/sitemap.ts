import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://oursori.com";
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: base,                  lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/community`,   lastModified: now, changeFrequency: "hourly",  priority: 0.9 },
    { url: `${base}/directory`,   lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${base}/jobs`,        lastModified: now, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${base}/advertise`,   lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Business detail pages
  const { data: businesses } = await supabase
    .from("businesses")
    .select("id, updated_at")
    .limit(1000);

  const businessPages: MetadataRoute.Sitemap = (businesses ?? []).map((b) => ({
    url: `${base}/directory/${b.id}`,
    lastModified: new Date(b.updated_at ?? now),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Community post pages
  const { data: posts } = await supabase
    .from("posts")
    .select("id, updated_at")
    .limit(2000);

  const postPages: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url: `${base}/community/${p.id}`,
    lastModified: new Date(p.updated_at ?? now),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...businessPages, ...postPages];
}
