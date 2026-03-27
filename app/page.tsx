import { Suspense }           from "react";
import type { Metadata }     from "next";
import { HeroCard }           from "@/components/home/HeroCard";
import { CategoryGrid }       from "@/components/home/CategoryGrid";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { CommunityFeed }      from "@/components/home/CommunityFeed";
import { JobsBanner }         from "@/components/home/JobsBanner";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "소리 — 뉴욕·뉴저지 한인 커뮤니티 & 비즈니스 디렉토리",
  description:
    "포트리·팰팍·플러싱·맨해튼 한인들의 커뮤니티. 한인 병원·변호사·회계사·식당·부동산·학원 찾기, 이민 생활 정보 공유.",
  openGraph: {
    url: "/",
    title: "소리 — 뉴욕·뉴저지 한인 커뮤니티 & 비즈니스",
    description: "포트리·팰팍·플러싱 한인들의 커뮤니티 & 비즈니스 디렉토리",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://oursori.com/#website",
      url: "https://oursori.com",
      name: "소리 Sori",
      description: "뉴욕·뉴저지 한인 커뮤니티 & 비즈니스 디렉토리",
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
      name: "소리 Sori",
      url: "https://oursori.com",
      description: "뉴욕·뉴저지 한인 커뮤니티 & 비즈니스 플랫폼",
      areaServed: ["Fort Lee, NJ", "Palisades Park, NJ", "Flushing, NY", "Manhattan, NY"],
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
    <div className="py-4 lg:py-6">
      {/* Hero */}
      <HeroCard />

      {/* Category horizontal scroll */}
      <div className="mt-5 -mx-4 px-4 lg:mx-0 lg:px-0">
        <CategoryGrid />
      </div>

      {/* Main layout: 2-column on desktop */}
      <div className="mt-6 lg:grid lg:grid-cols-[1fr_300px] lg:gap-8 lg:items-start">
        {/* LEFT — Community feed */}
        <section>
          <div className="section-header">
            <h2 className="section-title">커뮤니티</h2>
            <a href="/community" className="see-all-link">
              전체 보기 →
            </a>
          </div>
          <CommunityFeed />
        </section>

        {/* RIGHT — Sidebar */}
        <aside className="mt-8 lg:mt-0 space-y-5">
          {/* Featured businesses */}
          <section>
            <div className="section-header">
              <h2 className="section-title">추천 비즈니스</h2>
              <a href="/directory" className="see-all-link">
                전체 보기 →
              </a>
            </div>
            <Suspense
              fallback={
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-gray-100 rounded-xl animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <FeaturedBusinesses variant="sidebar" />
            </Suspense>
          </section>

          {/* Jobs banner */}
          <JobsBanner />

          {/* Ad placeholder */}
          <div className="rounded-2xl border-2 border-dashed border-gray-100 p-6 text-center bg-gray-50/50">
            <p className="text-xs font-semibold text-gray-400">광고 문의</p>
            <p className="text-[11px] text-gray-300 mt-1"></p>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}
