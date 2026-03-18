import { BusinessCard } from "@/components/directory/BusinessCard";
import type { Business, BusinessFilters } from "@/types";

const ALL: Business[] = [
  { id: "1", name: "포트리 한인 내과", category: "hospital", subcategory: "가정의학과", address: "123 Main St", city: "Fort Lee", state: "NJ", zip: "07024", phone: "2015550101", languages: ["ko","en"], is_verified: true,  is_premium: true,  rating: 4.9, review_count: 127, images: [], created_at: "", updated_at: "" },
  { id: "2", name: "김앤파트너스 법률", category: "lawyer",   subcategory: "이민법·형사법", address: "456 Broadway", city: "Manhattan", state: "NY", zip: "10013", phone: "2125550202", languages: ["ko","en"], is_verified: true,  is_premium: true,  rating: 4.7, review_count: 89,  images: [], created_at: "", updated_at: "" },
  { id: "3", name: "이성민 CPA 회계사무소", category: "accountant", subcategory: "세금·법인회계", address: "789 Bergen Blvd", city: "Palisades Park", state: "NJ", zip: "07650", phone: "2015550303", languages: ["ko","en"], is_verified: true,  is_premium: false, rating: 4.8, review_count: 54,  images: [], created_at: "", updated_at: "" },
  { id: "4", name: "우리집 한식당",     category: "restaurant", subcategory: "한식·국밥",   address: "99 Union St",   city: "Flushing",       state: "NY", zip: "11354", phone: "7185550404", languages: ["ko"],       is_verified: true,  is_premium: false, rating: 4.6, review_count: 203, images: [], created_at: "", updated_at: "" },
  { id: "5", name: "서울 헤어살롱",     category: "beauty",    subcategory: "미용실",       address: "200 Broad Ave", city: "Palisades Park", state: "NJ", zip: "07650", phone: "2015550505", languages: ["ko","en"], is_verified: false, is_premium: false, rating: 4.5, review_count: 38,  images: [], created_at: "", updated_at: "" },
  { id: "6", name: "한인 부동산 그룹",  category: "realestate", subcategory: "주거용·상업용", address: "50 Center Ave", city: "Fort Lee",        state: "NJ", zip: "07024", phone: "2015550606", languages: ["ko","en"], is_verified: true,  is_premium: false, rating: 4.4, review_count: 22,  images: [], created_at: "", updated_at: "" },
];

export function BusinessList({ filters }: { filters: BusinessFilters }) {
  let results = ALL;
  if (filters.category)    results = results.filter((b) => b.category === filters.category);
  if (filters.city)        results = results.filter((b) => b.city.toLowerCase().includes(filters.city!.toLowerCase()));
  if (filters.is_verified) results = results.filter((b) => b.is_verified);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter((b) => b.name.toLowerCase().includes(q) || b.subcategory?.toLowerCase().includes(q));
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-sm">검색 결과가 없어요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">{results.length}개 비즈니스</p>
      {results.map((biz) => <BusinessCard key={biz.id} business={biz} />)}
    </div>
  );
}
