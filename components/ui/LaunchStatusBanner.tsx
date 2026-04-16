import { Clock3 } from "lucide-react";

interface LaunchStatusBannerProps {
  badge?: string;
  title: string;
  description: string;
  tone?: "coral" | "navy";
}

export function LaunchStatusBanner({
  badge = "곧 오픈",
  title,
  description,
  tone = "coral",
}: LaunchStatusBannerProps) {
  const styles =
    tone === "navy"
      ? {
          wrapper:
            "border-white/10 bg-white/5 text-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/5",
          badge:
            "border-white/10 bg-white/10 text-white/85",
          dot: "bg-amber-400",
          icon: "bg-white/10 text-amber-300",
          title: "text-white",
          description: "text-white/70",
        }
      : {
          wrapper: "border-[#FFD9D9] bg-[#FFF6F6] text-gray-700",
          badge: "border-[#FFDEDE] bg-white text-[#FF5C5C]",
          dot: "bg-[#FF5C5C]",
          icon: "bg-[#FFF0F0] text-[#FF5C5C]",
          title: "text-gray-900",
          description: "text-gray-500",
        };

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${styles.wrapper}`}>
      <div className="flex items-start gap-3">
        <span
          className={`inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          <Clock3 className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${styles.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
            {badge}
          </span>
          <p className={`mt-3 text-sm font-bold ${styles.title}`}>{title}</p>
          <p className={`mt-1 text-sm leading-6 ${styles.description}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
