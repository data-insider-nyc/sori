"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CATEGORY_LIST } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function CategoryFilterBar({ activeCategory }: { activeCategory?: string }) {
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
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
      <button onClick={() => select(null)} className={cn("chip flex-shrink-0", !activeCategory && "chip-active")}>
        전체
      </button>
      {CATEGORY_LIST.map((cat) => (
        <button
          key={cat.value}
          onClick={() => select(activeCategory === cat.value ? null : cat.value)}
          className={cn("chip flex-shrink-0", activeCategory === cat.value && "chip-active")}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
