import { ComingSoon } from "@/components/ui/ComingSoon";
export default function AdvertisePage() {
  return (
    <>
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
