import { BusinessSearch }     from "@/components/directory/BusinessSearch";
import { BusinessList }       from "@/components/directory/BusinessList";
import { CategoryFilterBar }  from "@/components/directory/CategoryFilterBar";
import type { BusinessFilters } from "@/types";

// Next.js 16: searchParams must be awaited
interface Props {
  searchParams: Promise<{
    category?: string;
    city?: string;
    q?: string;
    verified?: string;
    page?: string;
  }>;
}

export default async function DirectoryPage({ searchParams }: Props) {
  const sp = await searchParams;

  const filters: BusinessFilters = {
    category:    sp.category as BusinessFilters["category"],
    city:        sp.city,
    search:      sp.q,
    is_verified: sp.verified === "true",
  };

  return (
    <div className="py-4 lg:py-8">
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">비즈니스 찾기</h1>
        <p className="text-gray-500 mt-1 text-sm">뉴욕·뉴저지 한인 비즈니스 디렉토리</p>
      </div>

      <BusinessSearch defaultValue={sp.q} />
      <CategoryFilterBar activeCategory={sp.category} />

      <div className="flex flex-wrap gap-2 mb-6">
        <select
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700
                     focus:outline-none focus:ring-2 focus:ring-[#FF5C5C]/20"
          defaultValue={sp.city ?? ""}
        >
          <option value="">지역 전체</option>
          <option value="Fort Lee">포트리 NJ</option>
          <option value="Palisades Park">팰리세이즈파크 NJ</option>
          <option value="Flushing">플러싱 NY</option>
          <option value="Manhattan">맨해튼 NY</option>
          <option value="Edgewater">엣지워터 NJ</option>
        </select>
      </div>

      <BusinessList filters={filters} />
    </div>
  );
}
