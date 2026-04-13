import Link from "next/link";
import {
  Stethoscope,
  Scale,
  Calculator,
  UtensilsCrossed,
  Scissors,
  Home,
  BookOpen,
  Briefcase,
  MapPin,
  Phone,
  Star,
  CheckCircle,
  Crown,
  HelpCircle,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { getBusinessRecommendationTier } from "@/lib/directory-recommendations";
import { formatPhone } from "@/lib/utils";
import type { Business } from "@/types";

// ─── 카테고리별 Lucide 아이콘 + 색상 ───────────
const CAT_ICONS: Record<
  string,
  {
    icon: React.ElementType;
    bg: string;
    color: string;
  }
> = {
  hospital: { icon: Stethoscope, bg: "#FFF0EE", color: "#E8321C" },
  lawyer: { icon: Scale, bg: "#EEF2FF", color: "#4F46E5" },
  accountant: { icon: Calculator, bg: "#FFFBEE", color: "#D97706" },
  restaurant: { icon: UtensilsCrossed, bg: "#EDFDF5", color: "#059669" },
  beauty: { icon: Scissors, bg: "#FFF0F8", color: "#DB2777" },
  realestate: { icon: Home, bg: "#F3EEFF", color: "#7C3AED" },
  education: { icon: BookOpen, bg: "#EEFBF8", color: "#0891B2" },
  jobs: { icon: Briefcase, bg: "#FFF6EE", color: "#EA580C" },
  other: { icon: HelpCircle, bg: "#F5F5F3", color: "#6B7280" },
};

// subcategory 정규화 (Google Places 영문 → 한국어)
const SUBCAT_MAP: Record<string, string> = {
  doctor: "의원",
  hospital: "병원",
  dentist: "치과",
  medical_clinic: "클리닉",
  physician: "내과",
  family_practice: "가정의학과",
  internist: "내과",
  pediatrician: "소아과",
  dermatologist: "피부과",
  optometrist: "안과",
  psychiatrist: "정신건강의학과",
  physical_therapist: "물리치료",
  chiropractor: "척추교정",
  lawyer: "변호사",
  attorney: "변호사",
  law_firm: "법률사무소",
  immigration_attorney: "이민전문",
  accounting: "회계사무소",
  accountant: "회계사",
  tax_preparation: "세금신고",
  restaurant: "식당",
  korean_restaurant: "한식당",
  barbecue_restaurant: "바베큐",
  seafood_restaurant: "해산물",
  cafe: "카페",
  coffee_shop: "커피숍",
  bakery: "베이커리",
  ramen_restaurant: "라멘",
  sushi_restaurant: "스시",
  beauty_salon: "미용실",
  hair_salon: "헤어살롱",
  nail_salon: "네일샵",
  spa: "스파",
  massage: "마사지",
  barber_shop: "이발소",
  real_estate_agency: "부동산",
  real_estate: "부동산",
  school: "학교",
  tutoring_center: "학원",
  language_school: "어학원",
  pharmacy: "약국",
  grocery_store: "마트",
  insurance_agency: "보험",
};

function normSub(raw?: string): string {
  if (!raw) return "";
  const key = raw.toLowerCase().replace(/\s+/g, "_");
  if (SUBCAT_MAP[key]) return SUBCAT_MAP[key];
  for (const [k, v] of Object.entries(SUBCAT_MAP)) {
    if (key.includes(k)) return v;
  }
  // 한국어면 그대로 (최대 10자)
  if (/[ㄱ-ㅎ가-힣]/.test(raw)) return raw.slice(0, 10);
  return "";
}

// ─────────────────────────────────────────────
// BusinessCard — 그리드/리스트 양쪽 지원
// variant="grid" 이면 카드형, "list" 이면 가로형
// ─────────────────────────────────────────────
export function BusinessCard({
  business,
  variant = "list",
}: {
  business: Business;
  variant?: "list" | "grid";
}) {
  const cat = CAT_ICONS[business.category] ?? CAT_ICONS.other;
  const Icon = cat.icon;
  const sub = normSub(business.subcategory ?? undefined);
  const categoryMeta = CATEGORIES[business.category] ?? CATEGORIES.other;
  const recommendationTier = getBusinessRecommendationTier(business);
  const hasKoreanSupport = business.languages?.includes("ko");
  const locationLabel = `${business.city}, ${business.state}`;
  const ratingText =
    business.review_count > 0 ? business.rating.toFixed(1) : null;

  const badges = (
    <>
      {recommendationTier ? (
        <span className="badge-premium">
          {recommendationTier === "premium" ? (
            <Crown className="h-3 w-3" />
          ) : (
            <Star className="h-3 w-3 fill-current" />
          )}
          추천
        </span>
      ) : null}
      {business.is_verified ? (
        <span className="badge-verified">
          <CheckCircle className="h-3 w-3" />
          인증됨
        </span>
      ) : null}
    </>
  );

  if (variant === "grid") {
    return (
      <Link href={`/directory/${business.id}`} className="block group h-full">
        <div className="card flex h-full flex-col overflow-hidden p-5">
          <div className="flex items-start justify-between gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-[20px]"
              style={{ background: cat.bg }}
            >
              <Icon
                className="h-7 w-7"
                style={{ color: cat.color }}
                strokeWidth={1.8}
              />
            </div>
            <div className="flex flex-wrap justify-end gap-1.5">
              {badges}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              {categoryMeta.label}
            </p>
            <h3 className="mt-2 line-clamp-2 text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#E8321C]">
              {business.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
              {sub || `${categoryMeta.label} · ${locationLabel}`}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="tag">{locationLabel}</span>
            {hasKoreanSupport ? <span className="tag">한국어 가능</span> : null}
          </div>

          <div className="mt-5 space-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-300" />
              <span className="line-clamp-1">{locationLabel}</span>
            </div>
            {business.phone ? (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-300" />
                <span>{formatPhone(business.phone)}</span>
              </div>
            ) : null}
          </div>

          <div className="mt-auto pt-5">
            <div className="rounded-[20px] border border-gray-100 bg-gray-50 px-4 py-3">
              {ratingText ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">
                      {ratingText}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    리뷰 {business.review_count.toLocaleString()}개
                  </span>
                </div>
              ) : (
                <p className="text-xs font-medium text-gray-400">
                  아직 리뷰 데이터가 없습니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // list variant
  return (
    <Link href={`/directory/${business.id}`} className="block group">
      <div className="card p-5 sm:p-6">
        <div className="flex gap-4 sm:gap-5">
          <div
            className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-[22px]"
            style={{ background: cat.bg }}
          >
            <Icon
              className="h-8 w-8"
              style={{ color: cat.color }}
              strokeWidth={1.8}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  <span>{categoryMeta.label}</span>
                  {sub ? (
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                  ) : null}
                  {sub ? (
                    <span className="normal-case tracking-normal">{sub}</span>
                  ) : null}
                </div>
                <h3 className="line-clamp-1 text-lg font-bold tracking-tight text-gray-900 transition-colors group-hover:text-[#E8321C] sm:text-[19px]">
                  {business.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                  {business.address ||
                    `${locationLabel} · ${categoryMeta.label}`}
                </p>
              </div>

              <div className="hidden flex-shrink-0 flex-wrap justify-end gap-1.5 sm:flex">
                {badges}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
              {badges}
            </div>

            <div className="mt-4 grid gap-3 border-t border-gray-100 pt-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
              <div className="space-y-2.5 text-sm text-gray-500">
                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-300" />
                    {locationLabel}
                  </span>
                  {business.phone ? (
                    <span className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-300" />
                      {formatPhone(business.phone)}
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">
                    {categoryMeta.emoji} {categoryMeta.label}
                  </span>
                  {hasKoreanSupport ? (
                    <span className="tag">한국어 가능</span>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[18px] border border-gray-100 bg-gray-50 px-4 py-3 sm:min-w-[156px]">
                {ratingText ? (
                  <>
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      {ratingText}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      리뷰 {business.review_count.toLocaleString()}개
                    </p>
                  </>
                ) : (
                  <p className="text-xs font-medium text-gray-400">
                    아직 리뷰 데이터가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
