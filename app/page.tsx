import { Suspense }           from "react";
import { HeroCard }           from "@/components/home/HeroCard";
import { CategoryGrid }       from "@/components/home/CategoryGrid";
import { FeaturedBusinesses } from "@/components/home/FeaturedBusinesses";
import { CommunityFeed }      from "@/components/home/CommunityFeed";
import { JobsBanner }         from "@/components/home/JobsBanner";

export const revalidate = 30;

export default function HomePage() {
  return (
    <div className="space-y-8 py-4 lg:py-8">
      <HeroCard />

      <section>
        <div className="section-header">
          <h2 className="section-title">카테고리</h2>
        </div>
        <CategoryGrid />
      </section>

      <section>
        <div className="section-header">
          <h2 className="section-title">추천 비즈니스</h2>
          <a href="/directory" className="see-all-link">전체 보기 →</a>
        </div>
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        }>
          <FeaturedBusinesses />
        </Suspense>
      </section>

      <JobsBanner />

      <section>
        <div className="section-header">
          <h2 className="section-title">커뮤니티 피드</h2>
          <a href="/community" className="see-all-link">전체 보기 →</a>
        </div>
        <CommunityFeed />
      </section>
    </div>
  );
}
