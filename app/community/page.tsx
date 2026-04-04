import { Suspense } from "react";
import type { Metadata } from "next";
import { HotTopics } from "@/components/community/HotTopics";
// import { AdvertisePage } from "@/app/advertise/AdvertisePage";
import { CommunityListing } from "./CommunityListing";
import { PAGE_META } from "@/lib/copy";

// Page shell (title, layout, HotTopics) cached at Vercel edge for 5 min.
// CommunityListing is a client component — it runs in the browser and uses
// its own feedCache, so this revalidate doesn't affect data freshness.
export const revalidate = 300;

export const metadata: Metadata = {
  title: PAGE_META.community.title,
  description: PAGE_META.community.description,
  openGraph: {
    url: "/community",
    title: PAGE_META.community.ogTitle,
    description: PAGE_META.community.ogDescription,
  },
};

function FeedSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );
}

export default function CommunityPage() {
  return (
    <div className="py-4 lg:py-8">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">
            커뮤니티
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            한인들의 생생한 생활 정보
          </p>
        </div>
        <a
          href="/community/new"
          className="btn-coral flex items-center gap-2 text-sm"
        >
          <span>✏️</span>
          <span>글쓰기</span>
        </a>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <Suspense fallback={<FeedSkeleton />}>
          <CommunityListing />
        </Suspense>

        <aside className="hidden lg:block space-y-6 mt-0">
          <Suspense
            fallback={
              <div className="h-48 bg-gray-50 rounded-2xl animate-pulse" />
            }
          >
            <HotTopics />
          </Suspense>
          {/* <AdvertisePage /> */}
        </aside>
      </div>
    </div>
  );
}
