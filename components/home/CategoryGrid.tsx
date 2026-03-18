import Link from "next/link";
import { CATEGORY_LIST } from "@/lib/constants";

export function CategoryGrid() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {CATEGORY_LIST.map((cat) => (
        <Link
          key={cat.value}
          href={`/directory?category=${cat.value}`}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                          bg-white border border-gray-100
                          group-hover:scale-105 group-hover:shadow-md transition-all duration-150">
            {cat.emoji}
          </div>
          <span className="text-[11px] text-gray-500 text-center leading-tight
                           group-hover:text-[#FF5C5C] transition-colors">
            {cat.label}
          </span>
        </Link>
      ))}
    </div>
  );
}
