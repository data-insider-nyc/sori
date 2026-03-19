"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BusinessCard } from "@/components/directory/BusinessCard";
import type { Business, BusinessFilters } from "@/types";

export function BusinessList({ filters }: { filters: BusinessFilters }) {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("businesses")
        .select("*")
        .order("is_premium", { ascending: false })
        .order("rating",     { ascending: false });

      if (filters.category)    query = query.eq("category", filters.category);
      if (filters.city)        query = query.ilike("city", `%${filters.city}%`);
      if (filters.is_verified) query = query.eq("is_verified", true);
      if (filters.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,subcategory.ilike.%${filters.search}%`
        );
      }

      const { data, error: err } = await query;
      if (err) { setError(err.message); return; }
      setBusinesses((data ?? []) as Business[]);
      setLoading(false);
    }
    load();
  }, [filters.category, filters.city, filters.is_verified, filters.search]);

  if (loading) return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
      ))}
    </div>
  );

  if (error) return (
    <div className="text-center py-12 text-red-400">
      <p className="text-sm">오류: {error}</p>
    </div>
  );

  if (businesses.length === 0) return (
    <div className="text-center py-16 text-gray-400">
      <p className="text-4xl mb-3">🔍</p>
      <p className="text-sm">검색 결과가 없어요.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-500">{businesses.length}개 비즈니스</p>
      {businesses.map((biz) => (
        <BusinessCard key={biz.id} business={biz} />
      ))}
    </div>
  );
}
