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
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
        <Search className="h-4 w-4" />
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="업체명, 업종, 키워드 검색..."
        className="input-field h-12 pl-11 pr-11 text-sm font-medium"
      />
      {value && (
        <button
          onClick={() => setValue("")}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
