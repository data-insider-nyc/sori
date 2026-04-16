"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, MapPin, X } from "lucide-react";
import { BusinessSearch } from "@/components/directory/BusinessSearch";
import { BusinessList } from "@/components/directory/BusinessList";
import { CategoryFilterBar } from "@/components/directory/CategoryFilterBar";
import { DirectorySidebar } from "@/components/directory/DirectorySidebar";
import {
  DIRECTORY_REGION_OPTIONS,
  getDirectoryCitiesByRegion,
  inferRegionFromCities,
} from "@/lib/directory-geography";
import { getRegionIcon } from "@/lib/regions";
import { TAGLINE } from "@/lib/copy";
import { LaunchStatusBanner } from "@/components/ui/LaunchStatusBanner";

export function DirectoryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [cityMenuOpen, setCityMenuOpen] = useState(false);

  const category = searchParams.get("category") ?? undefined;
  const selectedCities = Array.from(
    new Set(searchParams.getAll("city").filter(Boolean)),
  );
  const regionParam = searchParams.get("region") ?? "all";
  const region =
    regionParam !== "all" ? regionParam : inferRegionFromCities(selectedCities);
  const q = searchParams.get("q") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const cityOptions = getDirectoryCitiesByRegion(region);
  const allCitiesSelected =
    cityOptions.length > 0 && selectedCities.length === cityOptions.length;
  const selectedRegionLabel =
    region === "all"
      ? "전체 지역"
      : DIRECTORY_REGION_OPTIONS.find((item) => item.value === region)?.label;

  function setRegion(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") params.delete("region");
    else params.set("region", value);
    params.delete("city");
    params.delete("page");
    router.push(`/directory?${params.toString()}`);
  }

  function toggleCity(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(params.getAll("city").filter(Boolean));
    if (current.has(value)) current.delete(value);
    else current.add(value);

    params.delete("city");
    const nextCities = Array.from(current);
    nextCities.forEach((city) => params.append("city", city));

    const inferredRegion = inferRegionFromCities(nextCities);
    if (inferredRegion === "all") params.delete("region");
    else params.set("region", inferredRegion);

    params.delete("page");
    router.push(`/directory?${params.toString()}`);
  }

  function toggleAllCities() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("city");
    params.delete("page");

    if (!allCitiesSelected && cityOptions.length > 0) {
      // Select all
      const allValues = cityOptions.map((c) => c.value);
      allValues.forEach((city) => params.append("city", city));
    }
    // If all are selected, clicking effect is already same as clear

    router.push(`/directory?${params.toString()}`);
  }

  function clearCities() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("city");
    params.delete("page");
    router.push(`/directory?${params.toString()}`);
  }

  return (
    <div className="py-4 lg:py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            비즈니스 찾기
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-400">
            {TAGLINE.directory}. 지역과 업종을 좁혀 필요한 업체를 빠르게
            비교해보세요.
          </p>
        </div>
      </div>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
          <div className="mb-5">
            <LaunchStatusBanner
              badge="준비 중"
              title="비즈니스 찾기는 아직 계속 다듬는 중이에요."
              description="현재 업체 데이터와 탐색 경험을 정리하고 있습니다. 지금도 둘러볼 수 있지만, 추천 정확도와 구성은 계속 업데이트됩니다."
            />
          </div>

          <div className="mb-5">
            <BusinessSearch defaultValue={q} />
          </div>

          <div className="mb-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#FFF0F0] px-3 py-1 text-xs font-semibold text-[#FF5C5C]">
                현재 지역
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {selectedRegionLabel}
              </span>
              {selectedCities.length > 0 ? (
                <span className="text-sm text-gray-500">
                  · {selectedCities.length}개 동네 선택됨
                </span>
              ) : null}
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {DIRECTORY_REGION_OPTIONS.map((r) => {
                const RIcon = r.value === "all" ? null : getRegionIcon(r.value);
                return (
                  <button
                    key={r.value}
                    onClick={() => setRegion(r.value)}
                    className={cn(
                      "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-bold transition-all",
                      region === r.value
                        ? "border-[#FF5C5C] bg-[#FF5C5C] text-white"
                        : "border-gray-200 bg-white text-gray-500 hover:border-[#FF5C5C] hover:text-[#FF5C5C]",
                    )}
                  >
                    {RIcon ? (
                      <RIcon className="h-3.5 w-3.5" strokeWidth={2} />
                    ) : null}
                    {r.label}
                  </button>
                );
              })}
            </div>

            {region !== "all" ? (
              <div className="mt-4 max-w-xl">
                <div className="relative">
                  <button
                    onClick={() => setCityMenuOpen(!cityMenuOpen)}
                    className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm font-medium text-gray-700 transition-colors hover:border-gray-300"
                  >
                    <span className="inline-flex items-center gap-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      {selectedCities.length === 0
                        ? "동네 선택"
                        : `${selectedCities.length}개 선택`}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-transform",
                        cityMenuOpen && "rotate-180",
                      )}
                    />
                  </button>

                  {cityMenuOpen ? (
                    <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-gray-200 bg-white shadow-xl">
                      <div className="max-h-72 overflow-y-auto">
                        <label className="sticky top-0 flex cursor-pointer items-center gap-2.5 border-b border-gray-100 bg-white px-4 py-3 hover:bg-gray-50">
                          <input
                            type="checkbox"
                            checked={allCitiesSelected}
                            onChange={toggleAllCities}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0F1B2D] focus:ring-[#0F1B2D]"
                          />
                          <span className="text-sm font-bold text-gray-900">
                            전체지역
                          </span>
                        </label>

                        {cityOptions.map((c) => (
                          <label
                            key={c.value}
                            className="flex cursor-pointer items-center gap-2.5 px-4 py-3 transition-colors hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedCities.includes(c.value)}
                              onChange={() => toggleCity(c.value)}
                              className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0F1B2D] focus:ring-[#0F1B2D]"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {c.label}
                            </span>
                          </label>
                        ))}
                      </div>

                      <div className="flex items-center justify-between rounded-b-2xl border-t border-gray-100 bg-gray-50 px-4 py-2">
                        <button
                          onClick={clearCities}
                          disabled={selectedCities.length === 0}
                          className="text-xs font-bold text-gray-500 transition-colors hover:text-gray-900 disabled:opacity-30"
                        >
                          초기화
                        </button>
                        <button
                          onClick={() => setCityMenuOpen(false)}
                          className="flex items-center gap-1 text-xs font-bold text-[#0F1B2D] transition-colors hover:text-[#1E3050]"
                        >
                          완료
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-5 border-t border-gray-100 pt-5">
              <CategoryFilterBar activeCategory={category} />
            </div>
          </div>

          <BusinessList
            category={category}
            region={region}
            cities={selectedCities}
            search={q}
            page={page}
          />
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <DirectorySidebar
              category={category}
              region={region}
              cities={selectedCities}
              search={q}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
