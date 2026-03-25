import { Suspense } from "react";
import { HotTopics }        from "@/components/community/HotTopics";
import { CommunityClient }  from "./CommunityClient";

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
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">커뮤니티</h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">한인들의 생생한 생활 정보</p>
        </div>
        <a href="/community/new" className="btn-coral flex items-center gap-2 text-sm">
          <span>✏️</span>
          <span className="hidden sm:inline">글쓰기</span>
        </a>
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <Suspense fallback={<FeedSkeleton />}>
          <CommunityClient />
        </Suspense>

        <aside className="hidden lg:block space-y-6 mt-0">
          <Suspense fallback={<div className="h-48 bg-gray-50 rounded-2xl animate-pulse" />}>
            <HotTopics />
          </Suspense>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-3">📢</div>
            <div className="font-bold text-sm text-gray-900 mb-1">비즈니스 광고 문의</div>
            <div className="text-xs text-gray-400 mb-4">한인 고객에게 직접 도달하세요</div>
            <a href="/advertise"
               className="inline-block bg-[#E8321C] text-white text-sm font-bold
                          px-5 py-2.5 rounded-xl hover:bg-[#C82818] transition-colors">
              광고 시작하기
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

