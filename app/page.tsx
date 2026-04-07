import type { Metadata }        from "next";
import { LandingHero }          from "@/components/home/LandingHero";
import { PlatformPillars }      from "@/components/home/PlatformPillars";
import { CommunityFeed }        from "@/components/home/CommunityFeed";
import { JoinCTA }              from "@/components/home/JoinCTA";
import { PAGE_META, JSON_LD as LD } from "@/lib/copy";

export const revalidate = 30;

export const metadata: Metadata = {
  title: PAGE_META.home.title,
  description: PAGE_META.home.description,
  openGraph: {
    url: "/",
    title: PAGE_META.home.ogTitle,
    description: PAGE_META.home.ogDescription,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://oursori.com/#website",
      url: "https://oursori.com",
      name: LD.websiteName,
      description: LD.websiteDescription,
      inLanguage: "ko",
      potentialAction: {
        "@type": "SearchAction",
        target: "https://oursori.com/directory?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://oursori.com/#organization",
      name: LD.orgName,
      url: "https://oursori.com",
      description: LD.orgDescription,
      areaServed: LD.areaServed,
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="py-4 lg:py-6 space-y-8 lg:space-y-10">
      {/* Hero */}
      <LandingHero />

      {/* Platform pillars: Community (live) + Directory + Jobs (coming) */}
      <PlatformPillars />

      {/* Live community feed */}
      <section>
        <div className="section-header">
          <h2 className="section-title">커뮤니티 최신 글</h2>
          <a href="/community" className="see-all-link">전체 보기 →</a>
        </div>
        <CommunityFeed />
      </section>

      {/* Bottom CTA */}
      <JoinCTA />
    </div>
    </>
  );
}
