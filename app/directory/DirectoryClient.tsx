"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { BusinessSearch } from "@/components/directory/BusinessSearch";
import { BusinessList } from "@/components/directory/BusinessList";
import { CategoryFilterBar } from "@/components/directory/CategoryFilterBar";
import { TARGET_CITIES } from "@/lib/constants";

export function DirectoryClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get("category") ?? undefined;
  const city = searchParams.get("city") ?? undefined;
  const q = searchParams.get("q") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);

  function setCity(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set("city", value) : params.delete("city");
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
          뉴욕 · 뉴저지 한인 비즈니스 디렉토리
        </p>
      </div>

      <BusinessSearch defaultValue={q} />
      <CategoryFilterBar activeCategory={category} />

      <div className="flex flex-wrap gap-2 mb-6">
        {TARGET_CITIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCity(c.value)}
            className={[
              "px-4 py-2 rounded-full text-sm font-bold transition-all border",
              city === c.value || (!city && c.value === "")
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400",
            ].join(" ")}
          >
            {c.label}
          </button>
        ))}
      </div>

      <BusinessList category={category} city={city} search={q} page={page} />
    </div>
  );
}
