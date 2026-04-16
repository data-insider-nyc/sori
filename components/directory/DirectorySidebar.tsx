"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Crown,
  Megaphone,
  Phone,
  Sparkles,
  Star,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import {
  getBusinessPriorityScore,
  isRecommendedBusiness,
} from "@/lib/directory-recommendations";
import { getDirectoryCityValuesByRegion } from "@/lib/directory-geography";
import { SITE } from "@/lib/copy";
import { supabase } from "@/lib/supabase";
import { cn, formatPhone } from "@/lib/utils";
import type { Business } from "@/types";

interface Props {
  category?: string;
  region?: string;
  cities?: string[];
  search?: string;
}

function SidebarSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0F0] text-[#FF5C5C]">
          <Icon className="h-4 w-4" strokeWidth={2.2} />
        </span>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function CompactBusinessRow({
  business,
  rank,
  accent,
}: {
  business: Business;
  rank: number;
  accent: "coral" | "emerald";
}) {
  const category = CATEGORIES[business.category] ?? CATEGORIES.other;

  return (
    <Link
      href={`/directory/${business.id}`}
      className="flex items-start gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-gray-50"
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold",
          accent === "coral"
            ? "bg-[#FFF0F0] text-[#FF5C5C]"
            : "bg-emerald-50 text-emerald-700",
        )}
      >
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold leading-tight text-gray-900">
              {business.name}
            </p>
            <p className="mt-1 line-clamp-1 text-xs text-gray-500">
              {category.label} · {business.city}, {business.state}
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-gray-500">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {business.rating.toFixed(1)}
          </div>
        </div>
        {business.phone ? (
          <p className="mt-2 flex items-center gap-1 text-xs text-gray-400">
            <Phone className="h-3 w-3" />
            {formatPhone(business.phone)}
          </p>
        ) : null}
      </div>
    </Link>
  );
}

export function DirectorySidebar({
  category,
  region = "all",
  cities = [],
  search,
}: Props) {
  const [recommended, setRecommended] = useState<Business[]>([]);
  const [verified, setVerified] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const cityKey = cities.join("|");

  useEffect(() => {
    async function load() {
      setLoading(true);

      const applyFilters = <T,>(query: T): T => {
        let next = query as any;

        if (category) next = next.eq("category", category);

        if (cities.length > 0) {
          next = next.in("city", cities);
        } else if (region && region !== "all") {
          const regionCities = getDirectoryCityValuesByRegion(region);
          next =
            regionCities.length > 0
              ? next.in("city", regionCities)
              : next.eq("city", "__no_matching_city__");
        }

        if (search) {
          next = next.or(
            `name.ilike.%${search}%,subcategory.ilike.%${search}%`,
          );
        }

        return next;
      };

      const recommendedQuery = applyFilters(
        supabase
          .from("businesses")
          .select("*")
          .order("is_premium", { ascending: false })
          .order("is_verified", { ascending: false })
          .order("rating", { ascending: false })
          .order("review_count", { ascending: false })
          .limit(18),
      );

      const verifiedQuery = applyFilters(
        supabase
          .from("businesses")
          .select("*")
          .eq("is_verified", true)
          .order("rating", { ascending: false })
          .order("review_count", { ascending: false })
          .limit(4),
      );

      const [{ data: recommendedData }, { data: verifiedData }] =
        await Promise.all([recommendedQuery, verifiedQuery]);

      const recommendedPool = ((recommendedData ?? []) as Business[]).sort(
        (left, right) =>
          getBusinessPriorityScore(right) - getBusinessPriorityScore(left),
      );
      const recommendedRows = recommendedPool.filter(isRecommendedBusiness);

      setRecommended(
        (recommendedRows.length > 0 ? recommendedRows : recommendedPool).slice(
          0,
          4,
        ),
      );
      setVerified((verifiedData ?? []) as Business[]);
      setLoading(false);
    }

    load();
  }, [category, region, cityKey, search]);

  return (
    <div className="space-y-4">
      <SidebarSection title="추천 비즈니스" icon={Sparkles}>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl bg-white/70"
              />
            ))}
          </div>
        ) : recommended.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-gray-400">
            현재 조건에서 추천할 비즈니스가 없습니다.
          </p>
        ) : (
          <div className="space-y-1">
            {recommended.map((business, index) => (
              <CompactBusinessRow
                key={business.id}
                business={business}
                rank={index + 1}
                accent="coral"
              />
            ))}
          </div>
        )}
      </SidebarSection>

      <SidebarSection title="인증된 업체" icon={BadgeCheck}>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-16 animate-pulse rounded-2xl bg-white"
              />
            ))}
          </div>
        ) : verified.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-6 text-center text-sm text-gray-400">
            인증된 비즈니스가 아직 없습니다.
          </p>
        ) : (
          <div className="space-y-1">
            {verified.map((business, index) => (
              <CompactBusinessRow
                key={business.id}
                business={business}
                rank={index + 1}
                accent="emerald"
              />
            ))}
          </div>
        )}
      </SidebarSection>

      <SidebarSection title="광고 시작하기" icon={Megaphone}>
        <div className="rounded-2xl bg-gray-50 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                더 많은 한인 고객에게 노출하세요
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                상단 노출, 추천 영역 진입, 브랜드 신뢰 배지까지 한 번에 준비할
                수 있습니다.
              </p>
            </div>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FFF0F0] text-[#FF5C5C]">
              <Crown className="h-5 w-5" strokeWidth={2} />
            </span>
          </div>

          <div className="mt-4 space-y-2 text-xs text-gray-500">
            <p>추천 영역 우선 노출</p>
            <p>클릭 유도용 상세 프로필 정리</p>
            <p>광고 문의: {SITE.email}</p>
          </div>

          <Link
            href="/advertise"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F1B2D]"
          >
            광고 페이지 보기
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SidebarSection>
    </div>
  );
}
