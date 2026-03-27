import Link from "next/link";
import {
  Stethoscope, Scale, Calculator, UtensilsCrossed,
  Scissors, Home, BookOpen, Briefcase,
} from "lucide-react";

const CATEGORIES = [
  { href: "/directory?category=hospital",   icon: Stethoscope,     label: "병원·치과",  bg: "#FFF0EE", color: "#E8321C" },
  { href: "/directory?category=lawyer",     icon: Scale,           label: "변호사",     bg: "#EEF2FF", color: "#4F46E5" },
  { href: "/directory?category=accountant", icon: Calculator,      label: "회계사",     bg: "#FFFBEE", color: "#D97706" },
  { href: "/directory?category=restaurant", icon: UtensilsCrossed, label: "식당·카페",  bg: "#EDFDF5", color: "#059669" },
  { href: "/directory?category=beauty",     icon: Scissors,        label: "뷰티·미용",  bg: "#FDF2F8", color: "#DB2777" },
  { href: "/directory?category=realestate", icon: Home,            label: "부동산",     bg: "#F5F3FF", color: "#7C3AED" },
  { href: "/directory?category=education",  icon: BookOpen,        label: "학원·교육",  bg: "#ECFEFF", color: "#0891B2" },
  { href: "/directory?category=jobs",       icon: Briefcase,       label: "채용·구인",  bg: "#FFF7ED", color: "#EA580C" },
];

export function CategoryGrid() {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.href}
            href={cat.href}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full
                       border border-gray-200 bg-white text-gray-700 text-sm font-medium
                       hover:border-[#FF5C5C] hover:text-[#FF5C5C] hover:bg-[#FFF8F8]
                       transition-all duration-150"
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: cat.bg }}
            >
              <Icon className="w-3 h-3" style={{ color: cat.color }} strokeWidth={2.2} />
            </span>
            {cat.label}
          </Link>
        );
      })}
    </div>
  );
}
