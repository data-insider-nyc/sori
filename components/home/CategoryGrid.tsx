import Link from "next/link";
import {
  Stethoscope, Scale, Calculator, UtensilsCrossed,
  Scissors, Home, BookOpen, Briefcase,
} from "lucide-react";

const CATEGORIES = [
  {
    href:  "/directory?category=hospital",
    icon:  Stethoscope,
    label: "병원·치과",
    bg:    "#FFF0EE",
    color: "#E8321C",
    border: "#FFD5D0",
  },
  {
    href:  "/directory?category=lawyer",
    icon:  Scale,
    label: "변호사",
    bg:    "#EEF2FF",
    color: "#4F46E5",
    border: "#C7D2FE",
  },
  {
    href:  "/directory?category=accountant",
    icon:  Calculator,
    label: "회계사",
    bg:    "#FFFBEE",
    color: "#D97706",
    border: "#FDE68A",
  },
  {
    href:  "/directory?category=restaurant",
    icon:  UtensilsCrossed,
    label: "식당·카페",
    bg:    "#EDFDF5",
    color: "#059669",
    border: "#A7F3D0",
  },
  {
    href:  "/directory?category=beauty",
    icon:  Scissors,
    label: "뷰티·미용",
    bg:    "#FDF2F8",
    color: "#DB2777",
    border: "#FBCFE8",
  },
  {
    href:  "/directory?category=realestate",
    icon:  Home,
    label: "부동산",
    bg:    "#F5F3FF",
    color: "#7C3AED",
    border: "#DDD6FE",
  },
  {
    href:  "/directory?category=education",
    icon:  BookOpen,
    label: "학원·교육",
    bg:    "#ECFEFF",
    color: "#0891B2",
    border: "#A5F3FC",
  },
  {
    href:  "/directory?category=jobs",
    icon:  Briefcase,
    label: "채용·구인",
    bg:    "#FFF7ED",
    color: "#EA580C",
    border: "#FED7AA",
  },
];

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.href}
            href={cat.href}
            className="flex flex-col items-center gap-2.5 group"
          >
            {/* 아이콘 박스 */}
            <div
              className="w-full aspect-square max-w-[72px] sm:max-w-[80px]
                         rounded-2xl flex items-center justify-center
                         border transition-all duration-200
                         group-hover:scale-105 group-hover:shadow-md"
              style={{
                background:   cat.bg,
                borderColor:  cat.border,
              }}
            >
              <Icon
                className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-200
                           group-hover:scale-110"
                style={{ color: cat.color }}
                strokeWidth={1.8}
              />
            </div>
            {/* 레이블 */}
            <span
              className="text-[12px] sm:text-[13px] font-700 text-center
                         leading-tight tracking-tight
                         group-hover:font-bold transition-all"
              style={{ color: "#333" }}
            >
              {cat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
