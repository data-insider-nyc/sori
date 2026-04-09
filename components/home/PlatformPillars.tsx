import Link from "next/link";
import {
  Users,
  Building2,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Pillar {
  icon: React.ElementType;
  status: "live" | "coming";
  title: string;
  titleEn: string;
  description: string;
  features: string[];
  cta: { label: string; href: string };
  accentColor: string;
  accentBg: string;
}

const PILLARS: Pillar[] = [
  {
    icon: Users,
    status: "live",
    title: "커뮤니티",
    titleEn: "Community",
    description:
      "미국 전역 한인들의 생활 정보, 질문, 자유 토론. 같은 도시 이웃들과 실시간으로 소통하세요.",
    features: [
      "생활 정보 & 이웃 Q&A",
      "동네 행사 & 소식 공유",
      "이민·비자·육아 정보",
    ],
    cta: { label: "커뮤니티 보기", href: "/community" },
    accentColor: "#FF5C5C",
    accentBg: "#FFF0F0",
  },
  {
    icon: Building2,
    status: "coming",
    title: "비즈니스 디렉토리",
    titleEn: "Directory",
    description:
      "미국 전역 한인 병원·변호사·회계사·식당을 한곳에서 찾고, 별점과 리뷰도 함께 확인하세요.",
    features: [
      "업종별 전문 검색",
      "별점 & 리뷰 시스템",
      "전화 · 위치 · 영업시간",
    ],
    cta: { label: "디렉토리 둘러보기", href: "/directory" },
    accentColor: "#6366F1",
    accentBg: "#EEF2FF",
  },
  {
    icon: Briefcase,
    status: "coming",
    title: "채용 보드",
    titleEn: "Jobs",
    description:
      "한국 ↔ 미국 취업 정보. 비자 스폰서 포함 한인 기업 채용을 한눈에 확인하세요.",
    features: [
      "한-미 채용 공고 모음",
      "비자 스폰서 필터",
      "한인 기업 직접 채용",
    ],
    cta: { label: "채용 보드 예고", href: "/jobs" },
    accentColor: "#F59E0B",
    accentBg: "#FFFBEB",
  },
];

export function PlatformPillars() {
  return (
    <section className="py-10 lg:py-12">
      {/* Section header */}
      <div className="text-center mb-8">
        <p className="text-xs font-bold text-[#FF5C5C] uppercase tracking-widest mb-2">
          소리 플랫폼
        </p>
        <h2 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
          하나의 앱으로 연결되는
          <br className="sm:hidden" /> 한인 생활
        </h2>
        <p className="text-sm text-gray-500 mt-3 max-w-sm mx-auto leading-relaxed">
          커뮤니티를 시작으로, 비즈니스 디렉토리와 채용 보드까지 미국 전역으로
          순차적으로 오픈합니다.
        </p>
      </div>

      {/* Three pillar cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          const isLive = pillar.status === "live";

          return (
            <div
              key={pillar.titleEn}
              className={`relative rounded-2xl border p-6 flex flex-col transition-all duration-200 ${
                isLive
                  ? "bg-white border-gray-200 shadow-md hover:shadow-lg hover:border-[#FF5C5C]/40"
                  : "bg-gray-50 border-gray-100 opacity-75"
              }`}
            >
              {/* Status badge */}
              <div className="flex items-center justify-between mb-5">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: isLive ? pillar.accentBg : "#F3F4F6",
                  }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: isLive ? pillar.accentColor : "#9CA3AF" }}
                    strokeWidth={2}
                  />
                </div>

                {/* Live / Coming Soon badge */}
                {isLive ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    지금 이용 가능
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
                    <Clock className="w-2.5 h-2.5" />
                    준비 중
                  </span>
                )}
              </div>

              {/* Title */}
              <div className="mb-3">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  {pillar.titleEn}
                </p>
                <h3 className="text-lg font-black text-gray-900 leading-tight">
                  {pillar.title}
                </h3>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {pillar.description}
              </p>

              {/* Features */}
              <ul className="space-y-1.5 mb-6 flex-1">
                {pillar.features.map((feat) => (
                  <li
                    key={feat}
                    className="flex items-center gap-2 text-xs text-gray-600"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: isLive
                          ? pillar.accentColor
                          : "#D1D5DB",
                      }}
                    />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={pillar.cta.href}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150 ${
                  isLive
                    ? "text-[#FF5C5C] hover:text-[#E03E3E]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {pillar.cta.label}
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
