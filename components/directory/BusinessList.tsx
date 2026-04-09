"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { getDirectoryCityValuesByRegion } from "@/lib/directory-geography";
import { BusinessCard } from "@/components/directory/BusinessCard";
import type { Business } from "@/types";

const PER_PAGE = 20;

// ─── 그리드 컬럼 설정 — 여기서 쉽게 변경 ───────────
// 2, 3, 4 중 선택
const GRID_COLS = 3;

const GRID_CLASS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

interface Props {
  category?: string;
  region?: string;
  cities?: string[];
  search?: string;
  page?: number;
}

export function BusinessList({
  category,
  region = "all",
  cities = [],
  search,
  page = 1,
}: Props) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / PER_PAGE);
  const cityKey = cities.join("|");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      const from = (page - 1) * PER_PAGE;
      const to = from + PER_PAGE - 1;

      let query = supabase
        .from("businesses")
        .select("*", { count: "exact" })
        .order("is_premium", { ascending: false })
        .order("rating", { ascending: false })
        .range(from, to);

      if (category) query = query.eq("category", category);
      if (cities.length > 0) {
        query = query.in("city", cities);
      } else if (region && region !== "all") {
        const regionCities = getDirectoryCityValuesByRegion(region);
        if (regionCities.length > 0) query = query.in("city", regionCities);
        else query = query.eq("city", "__no_matching_city__");
      }
      if (search)
        query = query.or(
          `name.ilike.%${search}%,subcategory.ilike.%${search}%`,
        );

      const { data, count, error: err } = await query;
      if (err) {
        setError(err.message);
        setLoading(false);
        return;
      }
      setBusinesses((data ?? []) as Business[]);
      setTotal(count ?? 0);
      setLoading(false);
    }
    load();
  }, [category, region, cityKey, search, page]);

  function goPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/directory?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (loading)
    return (
      <div className={`grid ${GRID_CLASS[GRID_COLS]} gap-4`}>
        {Array.from({ length: GRID_COLS * 2 }).map((_, i) => (
          <div key={i} className="h-52 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 text-red-400 text-sm">
        오류: {error}
      </div>
    );

  if (businesses.length === 0)
    return (
      <div className="text-center py-20 text-gray-400">
        <div className="text-5xl mb-4">🔍</div>
        <p className="text-base font-medium">검색 결과가 없어요.</p>
        <p className="text-sm mt-1">다른 키워드나 지역을 선택해보세요.</p>
      </div>
    );

  return (
    <div>
      {/* 헤더 — 결과 수 + 뷰 토글 */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-gray-400 font-medium">
          총{" "}
          <span className="text-gray-900 font-bold text-base">
            {total.toLocaleString()}
          </span>
          개
          {page > 1 && (
            <span className="text-gray-400">
              {" "}
              · {page}/{totalPages}페이지
            </span>
          )}
        </p>
        {/* 그리드/리스트 토글 */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "grid"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${
              viewMode === "list"
                ? "bg-white shadow-sm text-gray-900"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 카드 그리드 or 리스트 */}
      {viewMode === "grid" ? (
        <div className={`grid ${GRID_CLASS[GRID_COLS]} gap-4`}>
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} variant="list" />
          ))}
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10 pb-4">
          <button
            onClick={() => goPage(page - 1)}
            disabled={page === 1}
            className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 text-lg font-bold
                       disabled:opacity-30 hover:border-gray-400 transition-colors
                       flex items-center justify-center"
          >
            ‹
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let p = i + 1;
            if (totalPages > 5 && page > 3) {
              p = page - 2 + i;
              if (p > totalPages) p = totalPages - (4 - i);
            }
            return (
              <button
                key={p}
                onClick={() => goPage(p)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  p === page
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goPage(page + 1)}
            disabled={page === totalPages}
            className="w-10 h-10 rounded-xl border border-gray-200 text-gray-600 text-lg font-bold
                       disabled:opacity-30 hover:border-gray-400 transition-colors
                       flex items-center justify-center"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
