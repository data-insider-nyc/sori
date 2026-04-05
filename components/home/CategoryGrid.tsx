import Link from "next/link";
import {
  Stethoscope, Scale, Calculator, UtensilsCrossed,
  Scissors, Home, BookOpen, Briefcase,
} from "lucide-react";

const CATEGORIES = [
  { href: "/directory?category=hospital",   icon: Stethoscope,     label: "병원·치과",  bg: "#FFF0EE", color: "#E8321C", hover: "#FFE4E0" },
  { href: "/directory?category=lawyer",     icon: Scale,           label: "변호사",     bg: "#EEF2FF", color: "#4F46E5", hover: "#E0E7FF" },
  { href: "/directory?category=accountant", icon: Calculator,      label: "회계사",     bg: "#FFFBEE", color: "#D97706", hover: "#FEF3C7" },
  { href: "/directory?category=restaurant", icon: UtensilsCrossed, label: "식당·카페",  bg: "#EDFDF5", color: "#059669", hover: "#D1FAE5" },
  { href: "/directory?category=beauty",     icon: Scissors,        label: "뷰티·미용",  bg: "#FDF2F8", color: "#DB2777", hover: "#FCE7F3" },
  { href: "/directory?category=realestate", icon: Home,            label: "부동산",     bg: "#F5F3FF", color: "#7C3AED", hover: "#EDE9FE" },
  { href: "/directory?category=education",  icon: BookOpen,        label: "학원·교육",  bg: "#ECFEFF", color: "#0891B2", hover: "#CFFAFE" },
  { href: "/directory?category=jobs",       icon: Briefcase,       label: "채용·구인",  bg: "#FFF7ED", color: "#EA580C", hover: "#FFEDD5" },
];

export function CategoryGrid() {
  return (
    <div className="flex gap-2.5 overflow-x-auto scrollbar-hide py-0.5">
      {CATEGORIES.map((cat) => {
        const Icon = cat.icon;
        return (
          <Link
            key={cat.href}
            href={cat.href}
            className="group flex-shrink-0 flex items-center gap-2.5 pl-1.5 pr-4 py-1.5
                       rounded-full border border-transparent
                       bg-white shadow-sm hover:shadow-md
                       text-gray-700 text-sm font-semibold
                       transition-all duration-200 hover:scale-[1.03] active:scale-95"
            style={{ "--hover-bg": cat.hover } as React.CSSProperties}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200"
              style={{ backgroundColor: cat.bg }}
            >
              <Icon className="w-3.5 h-3.5 transition-colors duration-200" style={{ color: cat.color }} strokeWidth={2.2} />
            </span>
            <span className="transition-colors duration-200" style={{ color: "inherit" }}>
              {cat.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
