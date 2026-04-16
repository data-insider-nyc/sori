"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CATEGORY_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryFilterBar({
  activeCategory,
}: {
  activeCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function select(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set("category", value) : params.delete("category");
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => select(null)}
        className={cn(
          "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-all whitespace-nowrap",
          !activeCategory &&
            "border-gray-900 bg-gray-900 text-white",
          activeCategory &&
            "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900",
        )}
      >
        전체
      </button>
      {CATEGORY_LIST.map((cat) => (
        <button
          key={cat.value}
          onClick={() =>
            select(activeCategory === cat.value ? null : cat.value)
          }
          className={cn(
            "flex-shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition-all whitespace-nowrap",
            activeCategory === cat.value &&
              "border-gray-900 bg-gray-900 text-white",
            activeCategory !== cat.value &&
              "border-gray-200 bg-white text-gray-500 hover:border-gray-400 hover:text-gray-900",
          )}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
