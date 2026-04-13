"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { CATEGORY_LIST } from "@/lib/constants";
import { getRegionLabel } from "@/lib/regions";
import { supabase } from "@/lib/supabase";
import { getDirectoryCityValuesByRegion } from "@/lib/directory-geography";
import { cn } from "@/lib/utils";
import { BusinessCard } from "@/components/directory/BusinessCard";
import type { Business } from "@/types";

const PER_PAGE = 20;

// ─── 그리드 컬럼 설정 — 여기서 쉽게 변경 ───────────
// 2, 3, 4 중 선택
const GRID_COLS = 2;

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
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / PER_PAGE);
  const cityKey = cities.join("|");
  const categoryLabel = CATEGORY_LIST.find(
    (item) => item.value === category,
  )?.label;
  const activePills = [
    search ? `검색: ${search}` : null,
    categoryLabel ? `카테고리: ${categoryLabel}` : null,
    cities.length > 0
      ? `도시: ${cities.slice(0, 2).join(", ")}${cities.length > 2 ? ` 외 ${cities.length - 2}` : ""}`
      : region !== "all"
        ? `지역: ${getRegionLabel(region)}`
        : null,
  ].filter((value): value is string => Boolean(value));

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
        .order("is_verified", { ascending: false })
        .order("rating", { ascending: false })
        .order("review_count", { ascending: false })
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
      <div className="space-y-4">
        <div className="h-28 animate-pulse rounded-[28px] bg-gray-100" />
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-[28px] bg-gray-100"
          />
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
      <div className="rounded-[28px] border border-dashed border-gray-200 bg-white px-6 py-20 text-center text-gray-400">
        <div className="mb-4 text-5xl">🔍</div>
        <p className="text-base font-medium">검색 결과가 없어요.</p>
        <p className="mt-1 text-sm">다른 키워드나 지역을 선택해보세요.</p>
      </div>
    );

  return (
    <div>
      <div className="mb-5 rounded-[28px] border border-[#F2E7E2] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
              Directory Listing
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900">
              조건에 맞는 비즈니스
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              추천과 인증 정보를 먼저 보여주고, 전화와 지역 정보를 빠르게 비교할
              수 있게 정리했습니다.
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <p className="text-sm font-medium text-gray-400">
              총{" "}
              <span className="text-base font-bold text-gray-900">
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

            <div className="flex items-center gap-1 rounded-2xl bg-gray-100 p-1">
              <button
                onClick={() => setViewMode("list")}
                aria-label="리스트 보기"
                className={cn(
                  "rounded-xl p-2 transition-all",
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                aria-label="그리드 보기"
                className={cn(
                  "rounded-xl p-2 transition-all",
                  viewMode === "grid"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-600",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {activePills.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {activePills.map((pill) => (
              <span
                key={pill}
                className="inline-flex items-center rounded-full bg-[#FFF6F2] px-3 py-1 text-xs font-semibold text-[#C55A3D]"
              >
                {pill}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm text-gray-500">
            지역과 카테고리를 조합해 원하는 한인 비즈니스를 빠르게 좁혀보세요.
          </div>
        )}
      </div>

      {viewMode === "grid" ? (
        <div className={`grid ${GRID_CLASS[GRID_COLS]} gap-4`}>
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="space-y-3.5">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} variant="list" />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2 pb-4">
          <button
            onClick={() => goPage(page - 1)}
            disabled={page === 1}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-lg font-bold text-gray-600 transition-colors hover:border-gray-400 disabled:opacity-30"
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
                className={cn(
                  "h-10 w-10 rounded-2xl text-sm font-bold transition-all",
                  p === page
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-gray-400",
                )}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goPage(page + 1)}
            disabled={page === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 text-lg font-bold text-gray-600 transition-colors hover:border-gray-400 disabled:opacity-30"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
