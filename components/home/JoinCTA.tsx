import Link from "next/link";
import { PenLine } from "lucide-react";

export function JoinCTA() {
  return (
    <div className="relative rounded-3xl overflow-hidden hero-gradient px-8 py-14 text-center">
      {/* Noise grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "300px 300px",
        }}
      />
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-[#FF5C5C]/12 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-md mx-auto">
        <p className="text-[#FF9090] text-xs font-bold uppercase tracking-widest mb-4">
          미국 한인 커뮤니티
        </p>
        <h2 className="text-3xl lg:text-4xl font-black text-white leading-[1.15] tracking-tight mb-4">
          여러분의 소리를
          <br />
          들려주세요
        </h2>
        <p className="text-white/45 text-sm leading-relaxed mb-8">
          포트리, 팰팍, 플러싱, 맨해튼의 2,400명 한인들과 함께 소통하세요.
        </p>
        <Link
          href="/community/new"
          className="inline-flex items-center gap-2 btn-coral text-sm px-7 py-3 shadow-xl shadow-[#FF5C5C]/20"
        >
          <PenLine className="w-4 h-4" />
          커뮤니티에 글 쓰기
        </Link>
      </div>
    </div>
  );
}
