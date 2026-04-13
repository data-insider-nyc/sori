"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  Compass,
  Layers3,
  MapPinned,
  Sparkles,
  X,
} from "lucide-react";
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
      <section className="mb-8 overflow-visible rounded-[30px] border border-gray-200 bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] shadow-[0_20px_60px_rgba(15,27,45,0.08)]">
        <div className="border-b border-gray-200 px-5 py-6 sm:px-6 lg:px-8 lg:py-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#0F1B2D]">
                <Sparkles className="h-3.5 w-3.5" />
                Korean Business Directory
              </span>
              <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                비즈니스 찾기
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-[15px]">
                {TAGLINE.directory}. 사진 없이도 믿을 만한 업체를 빠르게 비교할
                수 있도록 추천, 인증, 평점, 연락처를 한 화면에 정리했습니다.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <div className="rounded-[22px] border border-white/80 bg-white/85 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Browse
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  추천 우선 정렬, 인증 상태, 지역별 비교를 한 번에.
                </p>
              </div>
              <div className="rounded-[22px] border border-white/80 bg-white/85 p-4 backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Current Scope
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  {region === "all"
                    ? "전국 주요 한인 지역"
                    : DIRECTORY_REGION_OPTIONS.find(
                        (item) => item.value === region,
                      )?.label}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <BusinessSearch defaultValue={q} />
          </div>
        </div>

        <div className="bg-white/90 px-5 py-5 sm:px-6 lg:px-8">
          <div className="space-y-5">
            <div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                {DIRECTORY_REGION_OPTIONS.map((r) => {
                  const RIcon =
                    r.value === "all" ? null : getRegionIcon(r.value);
                  return (
                    <button
                      key={r.value}
                      onClick={() => setRegion(r.value)}
                      className={cn(
                        "inline-flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all sm:text-sm",
                        region === r.value
                          ? "border-[#0F1B2D] bg-[#0F1B2D] text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:border-[#1E3050] hover:text-[#1E3050]",
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
            </div>

            {region !== "all" ? (
              <div className="max-w-xl">
                <div className="relative">
                  <button
                    onClick={() => setCityMenuOpen(!cityMenuOpen)}
                    className="flex w-full items-center justify-between rounded-[22px] border border-gray-200 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-gray-300"
                  >
                    <span className="text-gray-900">
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
                    <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-[22px] border border-gray-200 bg-white shadow-xl">
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

                      <div className="flex items-center justify-between rounded-b-[22px] border-t border-gray-100 bg-gray-50 px-4 py-2">
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

            <div>
              <CategoryFilterBar activeCategory={category} />
            </div>
          </div>
        </div>
      </section>

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="min-w-0">
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
