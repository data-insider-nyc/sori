import {
  Briefcase,
  Globe,
  BadgeCheck,
  Bell,
  ArrowRight,
  Plane,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "채용 보드",
  description:
    "한국 ↔ 미국 취업 정보. 비자 스폰서 포함 한인 기업 채용을 한눈에 확인하세요.",
};

const FEATURES = [
  {
    icon: Globe,
    title: "한-미 채용 공고",
    description:
      "미국에서 일하고 싶은 한국인, 한국으로 돌아가고 싶은 교포 — 양방향 채용 정보를 모았습니다.",
    color: "#6366F1",
    bg: "#EEF2FF",
  },
  {
    icon: BadgeCheck,
    title: "비자 스폰서 필터",
    description:
      "H-1B, O-1, EB-2 등 비자 스폰서가 가능한 포지션만 골라볼 수 있습니다.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    icon: Briefcase,
    title: "한인 기업 직접 채용",
    description:
      "한인 기업과 채용 담당자가 직접 올리는 공고. 중간 단계 없이 바로 연결됩니다.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: Plane,
    title: "글로벌 한인 네트워크",
    description:
      "뉴욕, LA, 달라스, 시카고 등 미국 전역의 한인 커뮤니티 채용 네트워크를 활용하세요.",
    color: "#FF5C5C",
    bg: "#FFF0F0",
  },
];

const CATEGORIES = [
  { emoji: "💻", label: "IT · 개발", count: null },
  { emoji: "⚖️", label: "법무 · 이민", count: null },
  { emoji: "🏦", label: "금융 · 회계", count: null },
  { emoji: "🏥", label: "의료 · 헬스케어", count: null },
  { emoji: "📊", label: "마케팅 · 세일즈", count: null },
  { emoji: "🏠", label: "부동산", count: null },
  { emoji: "🎓", label: "교육 · 학원", count: null },
  { emoji: "🍜", label: "F&B · 요식업", count: null },
];

export default function JobsPage() {
  return (
    <div className="py-6 lg:py-10 max-w-3xl mx-auto">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden hero-gradient px-7 py-12 lg:px-12 lg:py-16 mb-10">
        {/* Noise grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "300px 300px",
          }}
        />
        {/* Glow */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-80 h-80 bg-[#F59E0B]/10 rounded-full blur-3xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-56 h-56 bg-[#FF5C5C]/8 rounded-full blur-2xl pointer-events-none"
        />

        <div className="relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 bg-[#F59E0B]/20 text-amber-300 border border-amber-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            곧 오픈 · Coming Soon
          </div>

          <h1 className="text-3xl lg:text-4xl font-black text-white leading-[1.1] tracking-tight mb-4">
            한-미 채용 보드
            <br />
            <span className="text-amber-400">Jobs</span>
          </h1>

          <p className="text-white/75 text-sm leading-relaxed max-w-sm mb-8">
            한국 ↔ 미국 취업 정보를 한곳에서. 비자 스폰서 포함 한인 기업 채용
            공고가 곧 시작됩니다.
          </p>
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────── */}
      <section className="mb-10">
        <p className="text-xs font-bold text-[#FF5C5C] uppercase tracking-widest mb-2">
          무엇이 달라요?
        </p>
        <h2 className="text-xl font-black text-gray-900 mb-6">
          한인을 위한 채용 플랫폼
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className="card p-5 flex gap-4 items-start cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: feat.bg }}
                >
                  <Icon
                    className="w-5 h-5"
                    style={{ color: feat.color }}
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Category preview ──────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-xl font-black text-gray-900 mb-1">
          업종별 채용 공고
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          오픈 준비 중인 카테고리 미리보기
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.label}
              className="relative flex flex-col items-center gap-2 py-5 rounded-2xl bg-white border border-gray-100 shadow-sm opacity-60 select-none"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-gray-600 text-center leading-snug">
                {cat.label}
              </span>
              <span className="absolute top-2 right-2 text-[9px] font-bold text-gray-300 uppercase tracking-wide">
                준비중
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Community bridge ──────────────────────────────────── */}
      <div className="rounded-2xl bg-[#FFF0F0] border border-[#FF5C5C]/10 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-gray-900 mb-1">
            지금 당장 채용 정보가 필요하신가요?
          </p>
          <p className="text-xs text-gray-500 leading-relaxed">
            커뮤니티 채용 카테고리에서 한인 구인·구직 글을 확인하고 직접
            질문해보세요.
          </p>
        </div>
        <Link
          href="/community?category=jobs"
          className="inline-flex items-center gap-1.5 btn-coral text-sm whitespace-nowrap"
        >
          커뮤니티 채용 보기
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
