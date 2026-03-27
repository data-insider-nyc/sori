import Link from "next/link";
import { PenLine, Search } from "lucide-react";

export function HeroCard() {
  return (
    <div className="relative rounded-3xl overflow-hidden px-6 py-7 lg:px-10 lg:py-10
                    bg-gradient-to-br from-[#FFF8F8] via-white to-[#F8F4FF]
                    border border-gray-100">
      {/* Decorative blobs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-[#FF5C5C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-40 h-40 bg-purple-400/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
        {/* Text + CTAs */}
        <div>
          <div className="inline-flex items-center gap-2 bg-[#FF5C5C]/10 text-[#FF5C5C]
                          text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C5C] animate-pulse" />
            뉴욕 · 뉴저지 한인 커뮤니티
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
            우리 동네 이야기,<br />
            함께 나눠요 <span className="text-[#FF5C5C]">소리</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2.5 leading-relaxed">
            포트리·팰팍·플러싱의 한인들이 모이는 공간
          </p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            <Link href="/community/new"
              className="inline-flex items-center gap-2 btn-coral text-sm">
              <PenLine className="w-4 h-4" />
              글쓰기
            </Link>
            <Link href="/directory"
              className="inline-flex items-center gap-2 btn-outline text-sm">
              <Search className="w-4 h-4" />
              비즈니스 찾기
            </Link>
          </div>
        </div>

        {/* Stats — desktop only */}
        <div className="hidden lg:flex items-center gap-8 shrink-0">
          {[
            { n: "2,400+", label: "한인 회원" },
            { n: "580+",   label: "등록 비즈니스" },
            { n: "8개",    label: "서비스 지역" },
          ].map((stat, i, arr) => (
            <div key={stat.label} className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-xl font-bold text-gray-900">{stat.n}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
              {i < arr.length - 1 && <div className="w-px h-10 bg-gray-200" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
