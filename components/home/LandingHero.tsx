import Link from "next/link";
import { PenLine, Search, Heart, MessageCircle, MapPin } from "lucide-react";

const MOCK_POSTS = [
  {
    category: "일반",
    categoryColor: "#6366F1",
    categoryBg: "rgba(99,102,241,0.15)",
    title: "뉴욕 새로 이사왔어요 — 맛집 & 동네 추천 부탁드려요!",
    author: "새내기한인",
    time: "방금 전",
    likes: 12,
    comments: 8,
  },
  {
    category: "부동산",
    categoryColor: "#7C3AED",
    categoryBg: "rgba(124,58,237,0.15)",
    title: "LA 한인타운 2베드 렌트 현재 시세 어떻게 되나요?",
    author: "집구하는중",
    time: "3분 전",
    likes: 5,
    comments: 15,
  },
  {
    category: "병원",
    categoryColor: "#FF5C5C",
    categoryBg: "rgba(255,92,92,0.15)",
    title: "달라스에서 한국어 되는 치과 추천해 주실 분",
    author: "치통이심해요",
    time: "11분 전",
    likes: 23,
    comments: 31,
  },
];

const STATS = [
  // { n: "2,400+", label: "한인 회원", icon: "👥" },
  { n: "1,300+", label: "등록 비즈니스", icon: "🏢" },
  { n: "8개", label: "서비스 지역", icon: "📍" },
];

const CITIES = [
  "New York",
  "Los Angeles",
  "San Francisco",
  "Chicago",
  "Washington D.C.",
  "Dallas",
  "Seattle",
  "Atlanta",
];

export function LandingHero() {
  return (
    <div className="relative rounded-3xl overflow-hidden hero-gradient min-h-[520px] lg:min-h-[580px]">
      {/* Noise grain texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />

      {/* Brand watermark */}
      <div
        aria-hidden="true"
        className="absolute -right-4 top-1/2 -translate-y-1/2 font-black text-white select-none pointer-events-none leading-none"
        style={{
          fontSize: "clamp(160px, 26vw, 380px)",
          opacity: 0.035,
          letterSpacing: "-0.03em",
        }}
      >
        소리
      </div>

      {/* Coral glow accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 w-96 h-96 bg-[#FF5C5C]/10 rounded-full blur-3xl pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#FF5C5C]/6 rounded-full blur-2xl pointer-events-none"
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 px-6 py-10 lg:px-12 lg:py-14">
        {/* Left — headline + CTAs */}
        <div className="max-w-lg animate-fade-in-up">
          {/* Live badge */}
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(255,92,92,0.15)",
              color: "#FF9090",
              border: "1px solid rgba(255,92,92,0.3)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C5C] animate-pulse" />
            미국 한인 커뮤니티 — 지금 활성중
          </div>

          {/* Headline */}
          <h1 className="text-[2.4rem] lg:text-[3.2rem] font-black text-white leading-[1.1] tracking-tight">
            우리의 이야기,
            <br />
            우리의{" "}
            <span className="relative inline-block text-[#FF5C5C]">소리</span>
            <br />
          </h1>

          <p className="text-white/75 text-sm mt-5 leading-relaxed max-w-sm">
            흩어져 있던 우리의 목소리들이 모이는 공간
          </p>

          {/* City chips */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {CITIES.map((city) => (
              <span
                key={city}
                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70 border border-white/20"
              >
                <MapPin className="w-2.5 h-2.5" />
                {city}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Link
              href="/community"
              className="inline-flex items-center gap-2 btn-coral text-sm shadow-lg shadow-[#FF5C5C]/25"
            >
              <PenLine className="w-4 h-4" />
              커뮤니티 둘러보기
            </Link>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/65 hover:text-white border border-white/15 hover:border-white/35 px-5 py-2.5 rounded-xl transition-all duration-150 active:scale-95"
            >
              <Search className="w-4 h-4" />
              비즈니스 찾기
            </Link>
          </div>
        </div>

        {/* Right — live post preview (desktop only) */}
        <div className="hidden lg:flex flex-col gap-3 w-[310px] shrink-0 stagger-2 animate-fade-in-up">
          <p className="text-[10px] font-semibold text-white/55 uppercase tracking-widest mb-1">
            실시간 커뮤니티
          </p>
          {MOCK_POSTS.map((post, i) => (
            <div
              key={i}
              className="rounded-2xl px-4 py-3.5 border"
              style={{
                background: "rgba(255,255,255,0.05)",
                borderColor: "rgba(255,255,255,0.09)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    color: post.categoryColor,
                    background: post.categoryBg,
                  }}
                >
                  {post.category}
                </span>
                <span className="text-white/25 text-[10px] ml-auto">
                  {post.time}
                </span>
              </div>
              <p className="text-white text-xs font-semibold leading-snug">
                {post.title}
              </p>
              <div className="flex items-center mt-2.5 gap-3">
                <span className="text-white/50 text-[10px]">
                  @{post.author}
                </span>
                <div className="flex items-center gap-2.5 ml-auto">
                  <span className="flex items-center gap-1 text-white/50 text-[10px]">
                    <Heart className="w-2.5 h-2.5" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-white/50 text-[10px]">
                    <MessageCircle className="w-2.5 h-2.5" /> {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats strip — full width at bottom */}
      <div className="relative z-10 flex items-stretch divide-x divide-white/10 border-t border-white/10 stagger-3 animate-fade-in-up">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-5"
          >
            <span className="text-lg font-black text-white leading-none">
              {stat.n}
            </span>
            <span className="text-[10px] text-white/60 font-medium">
              {stat.icon} {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
