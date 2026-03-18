import Link from "next/link";
import { Briefcase, ArrowRight } from "lucide-react";

export function JobsBanner() {
  return (
    <Link href="/jobs">
      <div className="flex items-center justify-between bg-[#0F1B2D] text-white rounded-2xl px-6 py-5
                      hover:opacity-90 transition-opacity">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#FF5C5C] flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm">해외 취업 & 채용 보드</div>
            <div className="text-white/50 text-xs mt-0.5">한국 ↔ 미국 · 비자 스폰서 포함</div>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-white/40" />
      </div>
    </Link>
  );
}
