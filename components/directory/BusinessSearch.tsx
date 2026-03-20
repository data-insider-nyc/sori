"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function BusinessSearch({ defaultValue = "" }: { defaultValue?: string }) {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(defaultValue);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  // 디바운스 — 500ms 후 URL 업데이트
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      value.trim() ? params.set("q", value.trim()) : params.delete("q");
      params.delete("page");
      router.push(`/directory?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer.current);
  }, [value]);

  return (
    <div className="relative mb-4">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="병원, 변호사, 식당 이름 검색..."
        className="w-full bg-gray-50 border border-gray-200 rounded-2xl
                   pl-11 pr-10 py-3.5 text-[15px] font-medium text-gray-900
                   placeholder-gray-400 tracking-tight
                   focus:outline-none focus:ring-2 focus:ring-[#E8321C]/20
                   focus:border-[#E8321C] transition-all"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400
                     hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
