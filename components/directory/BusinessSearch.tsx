"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function BusinessSearch({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 디바운스 — 500ms 후 URL 업데이트
  useEffect(() => {
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      value.trim() ? params.set("q", value.trim()) : params.delete("q");
      params.delete("page");
      router.push(`/directory?${params.toString()}`);
    }, 500);
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [value]);

  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl bg-[#FFF0F0] text-[#FF5C5C]">
        <Search className="h-4 w-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="병원, 변호사, 식당 이름 검색..."
        className="w-full rounded-[24px] border border-[#FFD7CF] bg-white/95 py-4 pl-16 pr-12 text-[15px] font-medium tracking-tight text-gray-900 shadow-[0_18px_40px_rgba(255,92,92,0.08)] placeholder:text-gray-400 focus:border-[#FF5C5C] focus:outline-none focus:ring-2 focus:ring-[#FF5C5C]/15"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
