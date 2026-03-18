"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/",          label: "홈" },
  { href: "/directory", label: "비즈니스" },
  { href: "/community", label: "커뮤니티" },
  { href: "/jobs",      label: "채용" },
];

export function Header() {
  const pathname = usePathname();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 hidden lg:block">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">

        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl font-bold text-[#FF5C5C] leading-none">소리</span>
          <span className="text-[10px] text-gray-400 font-medium tracking-widest mt-1">SORI</span>
        </Link>

        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="병원, 변호사, 식당 검색..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#FF5C5C]/20 focus:border-[#FF5C5C] transition-all"
            />
          </div>
        </div>

        <nav className="flex items-center gap-1">
          {NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-[#FFF0F0] text-[#FF5C5C]"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-500 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF5C5C] rounded-full" />
          </button>
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-sm font-medium text-gray-700
                       border border-gray-200 rounded-full px-4 py-1.5
                       hover:border-[#FF5C5C] hover:text-[#FF5C5C] transition-colors"
          >
            <User className="w-4 h-4" />로그인
          </Link>
          <Link href="/advertise" className="btn-coral text-sm !py-1.5 !px-4">
            광고 시작
          </Link>
        </div>

      </div>
    </header>
  );
}
