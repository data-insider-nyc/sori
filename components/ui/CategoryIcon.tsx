import { getCategoryIcon } from "@/lib/post-categories";
import { getCategoryColor } from "@/lib/colors";

interface Props {
  category: string;
  size?: "sm" | "md";
}

export function CategoryIcon({ category, size = "md" }: Props) {
  const Icon = getCategoryIcon(category);
  const { iconBg, iconColor } = getCategoryColor(category);

  const circle = size === "sm" ? "w-5 h-5" : "w-6 h-6";
  const icon = size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5";

  return (
    <span
      className={`${circle} rounded-full flex items-center justify-center flex-shrink-0`}
      style={{ backgroundColor: iconBg }}
    >
      <Icon className={icon} strokeWidth={2.2} style={{ color: iconColor }} />
    </span>
  );
}
