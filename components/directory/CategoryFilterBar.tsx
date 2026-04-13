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
          "chip flex-shrink-0 whitespace-nowrap border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900",
          !activeCategory &&
            "border-[#0F1B2D] bg-[#0F1B2D] text-white hover:border-[#1E3050] hover:bg-[#1E3050] hover:text-white",
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
            "chip flex-shrink-0 whitespace-nowrap border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:text-gray-900",
            activeCategory === cat.value &&
              "border-[#0F1B2D] bg-[#0F1B2D] text-white hover:border-[#1E3050] hover:bg-[#1E3050] hover:text-white",
          )}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
