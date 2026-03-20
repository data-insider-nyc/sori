import Link from "next/link";

interface ComingSoonProps {
  title: string;
  description: string;
  emoji: string;
  launchDate?: string;
}

export function ComingSoon({ title, description, emoji, launchDate }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      {/* 아이콘 */}
      <div className="w-24 h-24 rounded-3xl bg-gray-100 flex items-center justify-center mb-6 text-5xl">
        {emoji}
      </div>

      {/* 텍스트 */}
      <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-3">
        {title}
      </h1>
      <p className="text-gray-400 font-medium text-base leading-relaxed max-w-xs mb-2">
        {description}
      </p>
      {launchDate && (
        <p className="text-sm text-[#E8321C] font-bold mb-8">
          🚀 {launchDate} 오픈 예정
        </p>
      )}
      {!launchDate && <div className="mb-8" />}

      {/* 배지 */}
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200
                      text-amber-700 text-sm font-bold px-5 py-2.5 rounded-full mb-8">
        <span>⚒️</span> 현재 개발 중입니다
      </div>

      {/* 홈으로 */}
      <Link
        href="/"
        className="flex items-center gap-2 bg-gray-900 text-white
                   text-sm font-bold px-6 py-3 rounded-2xl
                   hover:bg-gray-800 transition-colors"
      >
        ← 홈으로 돌아가기
      </Link>
    </div>
  );
}
