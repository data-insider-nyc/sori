import { ComingSoon } from "@/components/ui/ComingSoon";
export default function AdvertisePage() {
  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
        <div className="text-3xl mb-3">📢</div>
        <div className="font-bold text-sm text-gray-900 mb-1">
          비즈니스 광고 문의
        </div>
        <div className="text-xs text-gray-400 mb-4">
          한인 고객에게 직접 도달하세요
        </div>
        <a
          href="/advertise"
          className="inline-block bg-[#E8321C] text-white text-sm font-bold
                          px-5 py-2.5 rounded-xl hover:bg-[#C82818] transition-colors"
        >
          광고 시작하기
        </a>
      </div>
      <ComingSoon
        emoji="📣"
        title="광고 시작하기"
        description="소리에서 한인 고객에게 직접 도달하세요. 광고 플랜 신청이 곧 시작됩니다."
        launchDate="2026년 6월"
      />
      <div className="text-center pb-12">
        <p className="text-gray-400 text-sm mb-2">지금 바로 문의하시려면</p>
        <a
          href="mailto:hello@oursori.com"
          className="inline-flex items-center gap-2 text-[#FF5C5C] font-bold text-base hover:underline"
        >
          ✉️ hello@oursori.com
        </a>
      </div>
    </>
  );
}
