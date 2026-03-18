import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function HeroCard() {
  return (
    <div className="hero-gradient rounded-3xl p-6 relative overflow-hidden text-white">
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 right-10 w-28 h-28 rounded-full bg-[#FF5C5C]/20" />
      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-[#FF5C5C] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
          <TrendingUp className="w-3 h-3" /> 이번 주 인기
        </span>
        <h1 className="text-xl font-bold leading-snug mb-1">
          뉴저지 한인 의사<br />추천 받아요
        </h1>
        <p className="text-white/60 text-sm mb-4">포트리 / 팰리세이즈파크 근처 가정의학과</p>
        <div className="flex gap-3">
          <Link href="/community" className="btn-coral text-sm py-2 px-4 rounded-xl">
            댓글 보기 →
          </Link>
          <Link href="/directory?category=hospital"
            className="text-sm py-2 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors">
            병원 찾기
          </Link>
        </div>
      </div>
    </div>
  );
}
