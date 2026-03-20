import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  CheckCircle,
  Crown,
  ArrowLeft,
  ExternalLink,
  Stethoscope,
  Scale,
  Calculator,
  UtensilsCrossed,
  Scissors,
  Home,
  BookOpen,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { Business } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const CAT_ICONS: Record<
  string,
  { icon: React.ElementType; bg: string; color: string }
> = {
  hospital: { icon: Stethoscope, bg: "#FFF0EE", color: "#E8321C" },
  lawyer: { icon: Scale, bg: "#EEF2FF", color: "#4F46E5" },
  accountant: { icon: Calculator, bg: "#FFFBEE", color: "#D97706" },
  restaurant: { icon: UtensilsCrossed, bg: "#EDFDF5", color: "#059669" },
  beauty: { icon: Scissors, bg: "#FDF2F8", color: "#DB2777" },
  realestate: { icon: Home, bg: "#F5F3FF", color: "#7C3AED" },
  education: { icon: BookOpen, bg: "#ECFEFF", color: "#0891B2" },
  jobs: { icon: Briefcase, bg: "#FFF7ED", color: "#EA580C" },
  other: { icon: HelpCircle, bg: "#F5F5F3", color: "#6B7280" },
};

const DAYS_KO: Record<string, string> = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("businesses")
    .select("name, city, state")
    .eq("id", id)
    .single();
  if (!data) return { title: "비즈니스 | 소리" };
  return {
    title: `${data.name} | 소리 Sori`,
    description: `${data.name} — ${data.city}, ${data.state}`,
  };
}

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: biz } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", id)
    .single();
  if (!biz) notFound();

  const business = biz as Business;
  const cat = CAT_ICONS[business.category] ?? CAT_ICONS.other;
  const Icon = cat.icon;

  const mapsQuery = encodeURIComponent(
    `${business.name} ${business.address} ${business.city} ${business.state}`,
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const phone = business.phone
    ? business.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    : null;

  return (
    <div className="py-4 lg:py-8 max-w-2xl mx-auto">
      <Link
        href="/directory"
        className="inline-flex items-center gap-2 text-sm font-bold text-gray-400
                   hover:text-gray-700 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> 비즈니스 목록
      </Link>

      {/* 헤더 */}
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden mb-4">
        <div
          className="h-36 flex items-center justify-center relative"
          style={{ background: cat.bg }}
        >
          <Icon
            className="w-16 h-16"
            style={{ color: cat.color }}
            strokeWidth={1.5}
          />
          <div className="absolute top-4 left-4 flex gap-2">
            {business.is_premium && (
              <span
                className="flex items-center gap-1 bg-gray-900 text-white
                               text-xs font-bold px-3 py-1 rounded-full"
              >
                <Crown className="w-3 h-3" /> 추천
              </span>
            )}
            {business.is_verified && (
              <span
                className="flex items-center gap-1 bg-white text-emerald-700
                               text-xs font-bold px-3 py-1 rounded-full shadow-sm"
              >
                <CheckCircle className="w-3 h-3" /> 인증됨
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1">
            {business.name}
          </h1>
          {business.subcategory && (
            <p className="text-sm font-semibold text-gray-400 mb-3">
              {business.subcategory}
            </p>
          )}
          {business.review_count > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i <= Math.round(business.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-black text-gray-900">
                {business.rating.toFixed(1)}
              </span>
              <span className="text-sm text-gray-400">
                ({business.review_count.toLocaleString()}개 리뷰)
              </span>
            </div>
          )}
          {business.languages?.includes("ko") && (
            <span
              className="inline-block bg-blue-50 text-blue-600
                             text-xs font-bold px-3 py-1 rounded-full"
            >
              한국어 가능
            </span>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {phone ? (
          <a
            href={`tel:+1${business.phone}`}
            className="flex flex-col items-center gap-1.5 bg-[#E8321C] text-white
                        rounded-2xl py-4 font-bold text-sm hover:bg-[#C82818] transition-colors"
          >
            <Phone className="w-5 h-5" /> 전화하기
          </a>
        ) : (
          <div
            className="flex flex-col items-center gap-1.5 bg-gray-100 text-gray-300
                          rounded-2xl py-4 font-bold text-sm cursor-not-allowed"
          >
            <Phone className="w-5 h-5" /> 전화하기
          </div>
        )}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1.5 bg-white border border-gray-200
                      text-gray-700 rounded-2xl py-4 font-bold text-sm
                      hover:border-gray-400 transition-colors"
        >
          <MapPin className="w-5 h-5" /> 지도 보기
        </a>
        {business.website ? (
          <a
            href={business.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1.5 bg-white border border-gray-200
                        text-gray-700 rounded-2xl py-4 font-bold text-sm
                        hover:border-gray-400 transition-colors"
          >
            <Globe className="w-5 h-5" /> 웹사이트
          </a>
        ) : (
          <div
            className="flex flex-col items-center gap-1.5 bg-gray-50 border border-gray-100
                          text-gray-300 rounded-2xl py-4 font-bold text-sm cursor-not-allowed"
          >
            <Globe className="w-5 h-5" /> 웹사이트
          </div>
        )}
      </div>

      {/* 상세 정보 */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 mb-4 space-y-5">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 mb-0.5">주소</p>
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              {business.address || `${business.city}, ${business.state}`}
            </p>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#E8321C] font-bold mt-1 hover:underline"
            >
              지도에서 보기 <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {phone && (
          <>
            <div className="h-px bg-gray-50" />
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 mb-0.5">
                  전화번호
                </p>
                <a
                  href={`tel:+1${business.phone}`}
                  className="text-sm font-semibold text-[#E8321C] hover:underline"
                >
                  {phone}
                </a>
              </div>
            </div>
          </>
        )}

        {business.hours && Object.keys(business.hours).length > 0 && (
          <>
            <div className="h-px bg-gray-50" />
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 mb-2">운영시간</p>
                <div className="space-y-1.5">
                  {Object.entries(business.hours as Record<string, string>).map(
                    ([day, time]) => (
                      <div key={day} className="flex items-center">
                        <span className="text-sm font-bold text-gray-400 w-6">
                          {DAYS_KO[day] ?? day}
                        </span>
                        <span className="text-sm font-medium text-gray-700 ml-4">
                          {time.toLowerCase().includes("closed") ? (
                            <span className="text-gray-300">휴무</span>
                          ) : (
                            time
                          )}
                        </span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {business.website && (
          <>
            <div className="h-px bg-gray-50" />
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-gray-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 mb-0.5">
                  웹사이트
                </p>
                <a
                  href={business.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-[#E8321C] hover:underline flex items-center gap-1"
                >
                  {(() => {
                    try {
                      return new URL(business.website).hostname.replace(
                        "www.",
                        "",
                      );
                    } catch {
                      return business.website;
                    }
                  })()}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 리뷰 (추후 연동) */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6">
        <h2 className="text-lg font-black text-gray-900 tracking-tight mb-4">
          리뷰
        </h2>
        <div className="text-center py-8 text-gray-400">
          <div className="text-4xl mb-3">✍️</div>
          <p className="font-semibold text-sm">
            {business.review_count > 0
              ? `Google 기준 ${business.review_count.toLocaleString()}개 리뷰`
              : "첫 번째 리뷰를 남겨보세요"}
          </p>
          <p className="text-xs mt-1">소리 자체 리뷰 기능 — 곧 출시 예정</p>
        </div>
      </div>
    </div>
  );
}
