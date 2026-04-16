import {
  Briefcase,
  Globe,
  BadgeCheck,
  ArrowRight,
  Plane,
  Clock3,
} from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { LaunchStatusBanner } from "@/components/ui/LaunchStatusBanner";

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
    <div className="py-4 lg:py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">
            채용 보드
          </h1>
          <p className="mt-1 text-sm font-medium text-gray-400">
            한국 ↔ 미국 취업 정보를 한곳에서. 오픈 전까지는 준비 중인 흐름을
            먼저 보여드리고 있어요.
          </p>
        </div>
      </div>

      <div className="mb-5">
        <LaunchStatusBanner
          badge="준비 중"
          title="채용 보드는 아직 다듬는 단계입니다."
          description="카테고리 구조, 비자 스폰서 정보, 기업 등록 흐름을 정리하고 있습니다. 정식 오픈 전까지는 미리보기 형태로 방향을 먼저 보여드려요."
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-8">
        <div className="space-y-5">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#FFF0F0] px-3 py-1 text-xs font-semibold text-[#FF5C5C]">
                현재 상태
              </span>
              <span className="text-sm font-semibold text-gray-900">
                곧 오픈 예정
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-gray-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Scope
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  한-미 채용 공고와 한인 기업 채용
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Filters
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  직무, 지역, 비자 스폰서 여부
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Access
                </p>
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  오픈 전까지 커뮤니티 채용 글로 연결
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              What&apos;s coming
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900">
              한인을 위한 채용 플랫폼
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              디렉토리와 같은 정보 탐색 방식으로, 채용도 빠르게 비교하고 연결할
              수 있게 준비하고 있습니다.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="rounded-2xl border border-gray-100 bg-white p-5 transition-colors hover:border-[#FF5C5C]/30"
                  >
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{ backgroundColor: feat.bg }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: feat.color }}
                        strokeWidth={2}
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-sm font-bold text-gray-900">
                        {feat.title}
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Category preview
            </p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900">
              업종별 채용 공고
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              어떤 카테고리가 열릴지 미리 확인할 수 있도록 준비 중인 직군을
              먼저 보여드립니다.
            </p>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className="relative rounded-2xl border border-gray-100 bg-gray-50 px-4 py-5 text-center"
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <p className="mt-2 text-xs font-semibold leading-snug text-gray-700">
                    {cat.label}
                  </p>
                  <span className="absolute right-2 top-2 rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#FF5C5C]">
                    준비중
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0F0] text-[#FF5C5C]">
                <Clock3 className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">
                오픈 전 안내
              </h3>
            </div>
            <div className="space-y-3 text-sm text-gray-500">
              <p>초기에는 한인 기업 공고와 커뮤니티 기반 채용 글부터 연결됩니다.</p>
              <p>이후 기업 등록, 비자 스폰서 필터, 지역 기반 탐색이 순차적으로 추가됩니다.</p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-[#FFF0F0] text-[#FF5C5C]">
                <Briefcase className="h-4 w-4" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">
                지금 바로 필요한 경우
              </h3>
            </div>
            <p className="text-sm leading-6 text-gray-500">
              커뮤니티 채용 카테고리에서 현재 올라온 구인·구직 글을 확인하고
              직접 대화를 시작해보세요.
            </p>
            <Link
              href="/community?category=jobs"
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 btn-coral text-sm"
            >
              커뮤니티 채용 보기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
