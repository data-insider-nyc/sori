import Link from "next/link";
import { PenLine, Search } from "lucide-react";
import { HERO_COPY } from "@/lib/copy";

const STATS = [
  { n: "2,400+", label: "한인 회원", icon: "👥" },
  { n: "580+",   label: "등록 비즈니스", icon: "🏢" },
  { n: "8개",    label: "서비스 지역", icon: "📍" },
];

export function HeroCard() {
  return (
    <div className="relative rounded-3xl overflow-hidden px-6 py-8 lg:px-12 lg:py-12 hero-gradient">
      {/* Noise grain texture overlay for depth */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />

      {/* Giant watermark "소리" — brand identity anchor */}
      <div
        aria-hidden="true"
        className="absolute -right-6 -top-6 font-black text-white select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(110px, 18vw, 260px)",
          opacity: 0.04,
          fontFamily: "'Pretendard', sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        소리
      </div>

      {/* Coral glow accents */}
      <div aria-hidden="true" className="absolute top-0 left-0 w-72 h-72 bg-[#FF5C5C]/10 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#FF5C5C]/6 rounded-full blur-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 lg:flex lg:items-center lg:justify-between lg:gap-12">

        {/* Left — headline + CTAs */}
        <div className="max-w-md animate-fade-in-up">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5"
            style={{
              background: "rgba(255, 92, 92, 0.15)",
              color: "#FF9090",
              border: "1px solid rgba(255, 92, 92, 0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C5C] animate-pulse" />
            {HERO_COPY.badge}
          </div>

          {/* Headline */}
          <h1 className="text-3xl lg:text-[2.6rem] font-black text-white leading-[1.15] tracking-tight">
            {HERO_COPY.headline[0]}
            <br />
            {HERO_COPY.headline[1]}{" "}
            <span className="relative inline-block text-[#FF5C5C]">
              {HERO_COPY.headlineBrand}
              {/* hand-drawn underline stroke */}
              <svg
                aria-hidden="true"
                className="absolute -bottom-1 left-0 w-full overflow-visible"
                height="6"
                viewBox="0 0 40 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M1 4.5 Q10 1.5 20 3.5 Q30 5.5 39 2.5"
                  stroke="#FF5C5C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity="0.65"
                />
              </svg>
            </span>
          </h1>

          <p className="text-white/50 text-sm mt-4 leading-relaxed max-w-xs">
            {HERO_COPY.sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-7">
            <Link
              href="/community/new"
              className="inline-flex items-center gap-2 btn-coral text-sm shadow-lg shadow-[#FF5C5C]/20"
            >
              <PenLine className="w-4 h-4" />
              글쓰기
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 text-sm font-semibold
                         text-white/70 hover:text-white
                         border border-white/20 hover:border-white/40
                         px-5 py-2.5 rounded-xl transition-all duration-150 active:scale-95"
            >
              <Search className="w-4 h-4" />
              비즈니스 찾기
            </Link>
          </div>
        </div>

        {/* Right — stat grid (desktop only) */}
        <div
          className="hidden lg:grid grid-cols-3 shrink-0 divide-x divide-white/10
                     border border-white/10 rounded-2xl overflow-hidden stagger-2 animate-fade-in-up"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center gap-2 px-8 py-7 text-center
                         bg-white/[0.04] hover:bg-white/[0.07] transition-colors duration-200"
            >
              <span className="text-2xl leading-none">{stat.icon}</span>
              <span className="text-2xl font-black text-white leading-none tracking-tight">
                {stat.n}
              </span>
              <span className="text-[11px] text-white/40 font-medium leading-snug">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile stat strip */}
      <div className="lg:hidden relative z-10 flex items-center gap-0 mt-7 pt-6 border-t border-white/10 divide-x divide-white/10">
        {STATS.map((stat) => (
          <div key={stat.label} className="flex-1 text-center px-2">
            <div className="text-base font-black text-white leading-none">{stat.n}</div>
            <div className="text-[10px] text-white/40 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
