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
  Share2,
  Heart,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import type { Business } from "@/types";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const CAT_META: Record<
  string,
  {
    icon: React.ElementType;
    bg: string;
    color: string;
    gradient: string;
  }
> = {
  hospital: {
    icon: Stethoscope,
    bg: "#FFF0EE",
    color: "#E8321C",
    gradient: "from-rose-950 via-red-900 to-rose-800",
  },
  lawyer: {
    icon: Scale,
    bg: "#EEF2FF",
    color: "#4F46E5",
    gradient: "from-indigo-950 via-indigo-900 to-indigo-800",
  },
  accountant: {
    icon: Calculator,
    bg: "#FFFBEE",
    color: "#D97706",
    gradient: "from-amber-950 via-amber-900 to-amber-800",
  },
  restaurant: {
    icon: UtensilsCrossed,
    bg: "#EDFDF5",
    color: "#059669",
    gradient: "from-emerald-950 via-emerald-900 to-emerald-800",
  },
  beauty: {
    icon: Scissors,
    bg: "#FDF2F8",
    color: "#DB2777",
    gradient: "from-pink-950 via-pink-900 to-pink-800",
  },
  realestate: {
    icon: Home,
    bg: "#F5F3FF",
    color: "#7C3AED",
    gradient: "from-violet-950 via-violet-900 to-violet-800",
  },
  education: {
    icon: BookOpen,
    bg: "#ECFEFF",
    color: "#0891B2",
    gradient: "from-cyan-950 via-cyan-900 to-cyan-800",
  },
  jobs: {
    icon: Briefcase,
    bg: "#FFF7ED",
    color: "#EA580C",
    gradient: "from-orange-950 via-orange-900 to-orange-800",
  },
  other: {
    icon: HelpCircle,
    bg: "#F5F5F3",
    color: "#6B7280",
    gradient: "from-gray-950 via-gray-900 to-gray-800",
  },
};

const DAYS_KO: Record<string, string> = {
  mon: "월요일",
  tue: "화요일",
  wed: "수요일",
  thu: "목요일",
  fri: "금요일",
  sat: "토요일",
  sun: "일요일",
};

const TODAY_KEY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
  new Date().getDay()
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase
    .from("businesses")
    .select("name, city, state, subcategory")
    .eq("id", id)
    .single();
  if (!data) return { title: "비즈니스 | 소리" };
  return {
    title: `${data.name} | 소리 Sori`,
    description: `${data.name} — ${data.subcategory ?? ""} · ${data.city}, ${data.state}`,
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
  const cat = CAT_META[business.category] ?? CAT_META.other;
  const Icon = cat.icon;
  const hours = business.hours as Record<string, string> | null;

  const todayHours = hours?.[TODAY_KEY] ?? null;
  const isOpenToday = todayHours
    ? !todayHours.toLowerCase().includes("closed")
    : null;

  const mapsQuery = encodeURIComponent(
    `${business.name} ${business.address ?? ""} ${business.city} ${business.state}`,
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
  const phone = business.phone
    ? business.phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")
    : null;

  return (
    <div className="min-h-screen -mt-0">
      {/* ── 히어로 풀블리드 ── */}
      <div className="relative h-80 lg:h-[420px] overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}`}>
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <Icon className="w-64 h-64 text-white/5" strokeWidth={0.5} />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* 탑바 */}
        <div className="absolute top-0 left-0 right-0 p-5 lg:p-8 flex items-center justify-between max-w-7xl mx-auto">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white
                       bg-white/10 backdrop-blur-md border border-white/20
                       rounded-full px-4 py-2 text-sm font-bold transition-all hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4" /> 목록으로
          </Link>
          <div className="flex gap-2">
            <button
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20
                               flex items-center justify-center text-white/80 hover:text-white
                               hover:bg-white/20 transition-all"
            >
              <Heart className="w-4 h-4" />
            </button>
            <button
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20
                               flex items-center justify-center text-white/80 hover:text-white
                               hover:bg-white/20 transition-all"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 바텀 비즈니스 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="max-w-7xl mx-auto flex items-end gap-5">
            <div
              className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl border-2 border-white/25
                            shadow-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: cat.bg }}
            >
              <Icon
                className="w-10 h-10 lg:w-12 lg:h-12"
                style={{ color: cat.color }}
                strokeWidth={1.8}
              />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex flex-wrap gap-2 mb-2.5">
                {business.is_premium && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-amber-400 text-amber-950
                                   text-[11px] font-black px-3 py-1 rounded-full tracking-wide"
                  >
                    <Crown className="w-3 h-3" /> 추천 비즈니스
                  </span>
                )}
                {business.is_verified && (
                  <span
                    className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm
                                   border border-white/25 text-white text-[11px] font-bold
                                   px-3 py-1 rounded-full"
                  >
                    <CheckCircle className="w-3 h-3" /> 인증됨
                  </span>
                )}
                {isOpenToday !== null && (
                  <span
                    className={`inline-flex items-center gap-1.5 text-[11px] font-bold
                                   px-3 py-1 rounded-full backdrop-blur-sm border ${
                                     isOpenToday
                                       ? "bg-emerald-400/20 border-emerald-400/30 text-emerald-300"
                                       : "bg-red-400/20 border-red-400/30 text-red-300"
                                   }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${isOpenToday ? "bg-emerald-400" : "bg-red-400"}`}
                    />
                    {isOpenToday ? "영업 중" : "영업 종료"}
                  </span>
                )}
              </div>
              <h1
                className="text-2xl lg:text-5xl font-black text-white tracking-tight
                             leading-tight drop-shadow-xl"
              >
                {business.name}
              </h1>
              {business.subcategory && (
                <p className="text-white/60 text-sm lg:text-base font-medium mt-1.5 tracking-wide">
                  {business.subcategory}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── 메인 컨텐츠 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-3 lg:gap-10">
          {/* ── 왼쪽 (2/3) ── */}
          <div className="lg:col-span-2 space-y-5">
            {/* 별점 카드 */}
            {business.review_count > 0 && (
              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="text-center flex-shrink-0">
                    <div className="text-6xl font-black text-gray-900 tracking-tighter leading-none mb-2">
                      {business.rating.toFixed(1)}
                    </div>
                    <div className="flex justify-center gap-0.5">
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
                    <p className="text-xs text-gray-400 font-semibold mt-2">
                      {business.review_count.toLocaleString()}개 리뷰
                    </p>
                  </div>

                  <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const diff = Math.abs(star - business.rating);
                      const pct =
                        diff < 0.5 ? 72 : diff < 1.5 ? 18 : diff < 2.5 ? 6 : 3;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-xs text-gray-400 font-bold w-3">
                            {star}
                          </span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-amber-400 rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-300 w-7 text-right">
                            {pct}%
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {business.languages?.includes("ko") && (
                    <div className="text-center flex-shrink-0">
                      <div
                        className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center
                                      justify-center text-2xl mx-auto mb-2 border border-blue-100"
                      >
                        🇰🇷
                      </div>
                      <p className="text-xs font-black text-blue-600 leading-tight">
                        한국어
                        <br />
                        가능
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 운영시간 */}
            {hours && Object.keys(hours).length > 0 && (
              <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-gray-900 tracking-tight mb-5 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-500" />
                  </div>
                  운영시간
                </h2>
                <div className="space-y-1.5">
                  {Object.entries(hours).map(([day, time]) => {
                    const isToday = day === TODAY_KEY;
                    const closed = time.toLowerCase().includes("closed");
                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-colors ${
                          isToday
                            ? "bg-gray-900 text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`text-sm font-bold ${isToday ? "text-white" : "text-gray-600"}`}
                          >
                            {DAYS_KO[day] ?? day}
                          </span>
                          {isToday && (
                            <span
                              className="text-[10px] font-black bg-[#E8321C] text-white
                                             px-2 py-0.5 rounded-full tracking-wide"
                            >
                              오늘
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-sm font-semibold ${
                            closed
                              ? isToday
                                ? "text-gray-500"
                                : "text-gray-300"
                              : isToday
                                ? "text-white"
                                : "text-gray-800"
                          }`}
                        >
                          {closed ? "휴무" : time}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 위치 */}
            <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-gray-500" />
                </div>
                위치
              </h2>
              <p className="text-base font-bold text-gray-900 mb-0.5">
                {business.address || `${business.city}, ${business.state}`}
              </p>
              <p className="text-sm text-gray-400 font-medium mb-5">
                {business.city}, {business.state}
              </p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full
                            bg-gray-50 border border-gray-200 hover:border-gray-400
                            text-gray-700 font-bold text-sm rounded-2xl py-3.5
                            transition-all hover:bg-gray-100 group"
              >
                <ExternalLink className="w-4 h-4 group-hover:text-[#E8321C] transition-colors" />
                Google Maps에서 보기
              </a>
            </div>

            {/* 리뷰 플레이스홀더 */}
            <div className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-black text-gray-900 tracking-tight mb-5">
                리뷰
              </h2>
              <div className="text-center py-10">
                <div
                  className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100
                                flex items-center justify-center mx-auto mb-4 text-3xl"
                >
                  ✍️
                </div>
                <p className="font-bold text-gray-700 text-base">
                  {business.review_count > 0
                    ? `Google 기준 ${business.review_count.toLocaleString()}개 리뷰`
                    : "첫 번째 리뷰를 남겨보세요"}
                </p>
                <p className="text-sm text-gray-400 mt-1.5 font-medium">
                  소리 자체 리뷰 기능 — 곧 출시 예정
                </p>
              </div>
            </div>
          </div>

          {/* ── 오른쪽 (1/3) sticky ── */}
          <div className="mt-5 lg:mt-0">
            <div className="lg:sticky lg:top-24 space-y-4">
              {/* 액션 카드 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-base font-black text-gray-900 tracking-tight mb-4">
                  연락하기
                </h3>

                {phone ? (
                  <a
                    href={`tel:+1${business.phone}`}
                    className="flex items-center gap-3 w-full bg-[#E8321C] hover:bg-[#C82818]
                                text-white rounded-2xl px-5 py-4 font-bold text-[15px]
                                transition-all mb-3 shadow-md shadow-red-200"
                  >
                    <Phone className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="text-[11px] font-bold opacity-75 leading-none mb-0.5">
                        전화하기
                      </div>
                      <div className="font-black tracking-wide">{phone}</div>
                    </div>
                  </a>
                ) : (
                  <div
                    className="flex items-center gap-3 w-full bg-gray-100 text-gray-400
                                  rounded-2xl px-5 py-4 mb-3 cursor-not-allowed"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-bold text-sm">전화번호 없음</span>
                  </div>
                )}

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full bg-gray-900 hover:bg-gray-800
                              text-white rounded-2xl px-5 py-4 font-bold text-[15px]
                              transition-all mb-3"
                >
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <div className="text-[11px] font-bold opacity-60 leading-none mb-0.5">
                      위치 보기
                    </div>
                    <div className="font-black">
                      {business.city}, {business.state}
                    </div>
                  </div>
                </a>

                {business.website ? (
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full bg-white border-2 border-gray-200
                                hover:border-gray-400 text-gray-800 rounded-2xl px-5 py-4
                                font-bold text-[15px] transition-all"
                  >
                    <Globe className="w-5 h-5 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-gray-400 leading-none mb-0.5">
                        웹사이트
                      </div>
                      <div className="font-black truncate text-sm">
                        {(() => {
                          try {
                            return new URL(business.website).hostname.replace(
                              "www.",
                              "",
                            );
                          } catch {
                            return "바로가기";
                          }
                        })()}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0 ml-auto" />
                  </a>
                ) : (
                  <div
                    className="flex items-center gap-3 w-full bg-gray-50 border border-gray-100
                                  text-gray-300 rounded-2xl px-5 py-4 cursor-not-allowed"
                  >
                    <Globe className="w-5 h-5" />
                    <span className="font-bold text-sm">웹사이트 없음</span>
                  </div>
                )}
              </div>

              {/* 기본 정보 카드 */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-base font-black text-gray-900 tracking-tight mb-4">
                  기본 정보
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      카테고리
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-xl flex items-center justify-center"
                        style={{ background: cat.bg }}
                      >
                        <Icon
                          className="w-4 h-4"
                          style={{ color: cat.color }}
                          strokeWidth={1.8}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-800">
                        {business.subcategory || business.category}
                      </span>
                    </div>
                  </div>
                  {business.languages?.includes("ko") && (
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        언어
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-100
                                       text-blue-700 text-xs font-black px-3 py-1 rounded-full"
                      >
                        🇰🇷 한국어 가능
                      </span>
                    </div>
                  )}
                  {business.is_verified && (
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        인증
                      </p>
                      <span
                        className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100
                                       text-emerald-700 text-xs font-black px-3 py-1 rounded-full"
                      >
                        <CheckCircle className="w-3 h-3" /> 소리 인증 비즈니스
                      </span>
                    </div>
                  )}
                  {todayHours && (
                    <div>
                      <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-1">
                        오늘 운영시간
                      </p>
                      <p className="text-sm font-bold text-gray-800">
                        {todayHours.toLowerCase().includes("closed")
                          ? "오늘 휴무"
                          : todayHours}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
