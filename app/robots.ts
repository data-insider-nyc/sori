import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "https://oursori.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/callback", "/auth/nickname"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
