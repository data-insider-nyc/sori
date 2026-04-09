"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronDown, X } from "lucide-react";
import { BusinessSearch } from "@/components/directory/BusinessSearch";
import { BusinessList } from "@/components/directory/BusinessList";
import { CategoryFilterBar } from "@/components/directory/CategoryFilterBar";
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
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          비즈니스 찾기
        </h1>
        <p className="text-gray-400 mt-1 text-sm font-medium">
          {TAGLINE.directory}
        </p>
      </div>

      <BusinessSearch defaultValue={q} />

      {/* Region tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-2">
        {DIRECTORY_REGION_OPTIONS.map((r) => {
          const RIcon = r.value === "all" ? null : getRegionIcon(r.value);
          return (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={cn(
                "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border transition-all inline-flex items-center gap-1.5",
                region === r.value
                  ? "bg-[#FF5C5C] text-white border-[#FF5C5C]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#FF5C5C] hover:text-[#FF5C5C]",
              )}
            >
              {RIcon ? <RIcon className="w-3.5 h-3.5" strokeWidth={2} /> : null}
              {r.label}
            </button>
          );
        })}
      </div>

      {/* Neighborhood select dropdown */}
      {region !== "all" && (
        <div className="mb-6">
          <div className="relative">
            <button
              onClick={() => setCityMenuOpen(!cityMenuOpen)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-left text-sm font-medium text-gray-700 hover:border-gray-300 transition-colors flex items-center justify-between"
            >
              <span className="text-gray-900">
                {selectedCities.length === 0
                  ? "동네 선택"
                  : `${selectedCities.length}개 선택`}
              </span>
              <ChevronDown
                className={cn(
                  "w-4 h-4 text-gray-400 transition-transform",
                  cityMenuOpen && "rotate-180",
                )}
              />
            </button>

            {/* Dropdown menu */}
            {cityMenuOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50">
                <div className="max-h-72 overflow-y-auto">
                  {/* Select All toggle */}
                  <label className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-100 sticky top-0 bg-white">
                    <input
                      type="checkbox"
                      checked={allCitiesSelected}
                      onChange={toggleAllCities}
                      className="w-4 h-4 rounded border-gray-300 text-[#FF5C5C] focus:ring-[#FF5C5C] cursor-pointer"
                    />
                    <span className="text-sm font-bold text-gray-900">
                      전체지역
                    </span>
                  </label>

                  {/* Individual neighborhoods */}
                  {cityOptions.map((c) => (
                    <label
                      key={c.value}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(c.value)}
                        onChange={() => toggleCity(c.value)}
                        className="w-4 h-4 rounded border-gray-300 text-[#FF5C5C] focus:ring-[#FF5C5C] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {c.label}
                      </span>
                    </label>
                  ))}
                </div>

                {/* Footer with close and reset */}
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl flex items-center justify-between">
                  <button
                    onClick={clearCities}
                    disabled={selectedCities.length === 0}
                    className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors disabled:opacity-30"
                  >
                    초기화
                  </button>
                  <button
                    onClick={() => setCityMenuOpen(false)}
                    className="flex items-center gap-1 text-xs font-bold text-[#FF5C5C] hover:text-[#E03E3E] transition-colors"
                  >
                    완료
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <CategoryFilterBar activeCategory={category} />

      <BusinessList
        category={category}
        region={region}
        cities={selectedCities}
        search={q}
        page={page}
      />
    </div>
  );
}
