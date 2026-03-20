import Link from "next/link";
import {
  Stethoscope, Scale, Calculator, UtensilsCrossed,
  Scissors, Home, BookOpen, Briefcase, MapPin, Phone,
  Star, CheckCircle, Crown, HelpCircle,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatPhone } from "@/lib/utils";
import type { Business } from "@/types";

// ─── 카테고리별 Lucide 아이콘 + 색상 ───────────
const CAT_ICONS: Record<string, {
  icon: React.ElementType;
  bg: string;
  color: string;
}> = {
  hospital:   { icon: Stethoscope,     bg: "#FFF0EE", color: "#E8321C" },
  lawyer:     { icon: Scale,           bg: "#EEF2FF", color: "#4F46E5" },
  accountant: { icon: Calculator,      bg: "#FFFBEE", color: "#D97706" },
  restaurant: { icon: UtensilsCrossed, bg: "#EDFDF5", color: "#059669" },
  beauty:     { icon: Scissors,        bg: "#FFF0F8", color: "#DB2777" },
  realestate: { icon: Home,            bg: "#F3EEFF", color: "#7C3AED" },
  education:  { icon: BookOpen,        bg: "#EEFBF8", color: "#0891B2" },
  jobs:       { icon: Briefcase,       bg: "#FFF6EE", color: "#EA580C" },
  other:      { icon: HelpCircle,      bg: "#F5F5F3", color: "#6B7280" },
};

// subcategory 정규화 (Google Places 영문 → 한국어)
const SUBCAT_MAP: Record<string, string> = {
  doctor: "의원", hospital: "병원", dentist: "치과", medical_clinic: "클리닉",
  physician: "내과", family_practice: "가정의학과", internist: "내과",
  pediatrician: "소아과", dermatologist: "피부과", optometrist: "안과",
  psychiatrist: "정신건강의학과", physical_therapist: "물리치료", chiropractor: "척추교정",
  lawyer: "변호사", attorney: "변호사", law_firm: "법률사무소",
  immigration_attorney: "이민전문",
  accounting: "회계사무소", accountant: "회계사", tax_preparation: "세금신고",
  restaurant: "식당", korean_restaurant: "한식당", barbecue_restaurant: "바베큐",
  seafood_restaurant: "해산물", cafe: "카페", coffee_shop: "커피숍",
  bakery: "베이커리", ramen_restaurant: "라멘", sushi_restaurant: "스시",
  beauty_salon: "미용실", hair_salon: "헤어살롱", nail_salon: "네일샵",
  spa: "스파", massage: "마사지", barber_shop: "이발소",
  real_estate_agency: "부동산", real_estate: "부동산",
  school: "학교", tutoring_center: "학원", language_school: "어학원",
  pharmacy: "약국", grocery_store: "마트", insurance_agency: "보험",
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
  const cat  = CAT_ICONS[business.category] ?? CAT_ICONS.other;
  const Icon = cat.icon;
  const sub  = normSub(business.subcategory ?? undefined);

  if (variant === "grid") {
    return (
      <Link href={`/directory/${business.id}`} className="block group h-full">
        <div className="h-full bg-white border border-gray-100 rounded-2xl overflow-hidden
                        hover:border-[#E8321C]/30 hover:shadow-md transition-all duration-200">
          {/* 아이콘 영역 */}
          <div className="h-24 flex items-center justify-center relative"
               style={{ background: cat.bg }}>
            <Icon className="w-9 h-9" style={{ color: cat.color }} strokeWidth={1.8} />
            {business.is_premium && (
              <span className="absolute top-2 left-2 flex items-center gap-1
                               bg-gray-900 text-white text-[10px] font-bold
                               px-2 py-0.5 rounded-md">
                <Crown className="w-2.5 h-2.5" />추천
              </span>
            )}
          </div>
          {/* 정보 */}
          <div className="p-4">
            <h3 className="font-bold text-[14px] text-gray-900 tracking-tight
                           group-hover:text-[#E8321C] transition-colors
                           line-clamp-2 leading-snug mb-1">
              {business.name}
            </h3>
            {sub && <p className="text-xs text-gray-400 font-medium mb-2">{sub}</p>}
            {business.review_count > 0 && (
              <div className="flex items-center gap-1 mb-2">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold text-gray-900">{business.rating.toFixed(1)}</span>
                <span className="text-xs text-gray-400">({business.review_count})</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {business.city}, {business.state}
            </div>
            {business.is_verified && (
              <span className="inline-flex items-center gap-1 mt-2
                               bg-emerald-50 text-emerald-700
                               text-[10px] font-bold px-2 py-0.5 rounded-md">
                <CheckCircle className="w-2.5 h-2.5" />인증됨
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  // list variant
  return (
    <Link href={`/directory/${business.id}`} className="block group">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 flex gap-4
                      hover:border-[#E8321C]/30 hover:shadow-sm transition-all duration-200">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
             style={{ background: cat.bg }}>
          <Icon className="w-7 h-7" style={{ color: cat.color }} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-bold text-[15px] text-gray-900 tracking-tight
                           group-hover:text-[#E8321C] transition-colors truncate">
              {business.name}
            </h3>
            <div className="flex gap-1.5 flex-shrink-0">
              {business.is_premium && (
                <span className="flex items-center gap-1 bg-gray-900 text-white
                                 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  <Crown className="w-2.5 h-2.5" />추천
                </span>
              )}
              {business.is_verified && (
                <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700
                                 text-[10px] font-bold px-2 py-0.5 rounded-md">
                  <CheckCircle className="w-2.5 h-2.5" />인증
                </span>
              )}
            </div>
          </div>
          {sub && <p className="text-xs text-gray-400 font-medium mb-1.5">{sub}</p>}
          {business.review_count > 0 && (
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className={`w-3 h-3 ${
                    i <= Math.round(business.rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-gray-200 fill-gray-200"
                  }`} />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-900">{business.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({business.review_count.toLocaleString()})</span>
            </div>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-0.5">
            <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
              <MapPin className="w-3 h-3" />{business.city}, {business.state}
            </span>
            {business.phone && (
              <span className="flex items-center gap-1 text-xs text-gray-400 font-medium">
                <Phone className="w-3 h-3" />{formatPhone(business.phone)}
              </span>
            )}
          </div>
          {business.languages?.includes("ko") && (
            <span className="inline-block mt-1.5 text-[10px] font-bold
                             bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md">
              한국어 가능
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
