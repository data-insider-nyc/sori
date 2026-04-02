import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectoryClient } from "./DirectoryClient";

export const metadata: Metadata = {
  title: "한인 비즈니스 디렉토리",
  description:
    "미국 한인 병원·치과·변호사·회계사·식당·뷰티·부동산·학원 찾기. 포트리·팰팍·플러싱·맨해튼 지역 한인 비즈니스 디렉토리.",
  openGraph: {
    url: "/directory",
    title: "소리 — 미국 한인 비즈니스 디렉토리",
    description: "포트리·팰팍·플러싱 한인 비즈니스 검색 & 리뷰",
  },
};

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-4 lg:py-8">
          <div className="h-10 w-48 bg-gray-100 rounded-2xl animate-pulse mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-28 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <DirectoryClient />
    </Suspense>
  );
}
