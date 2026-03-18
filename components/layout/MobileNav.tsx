"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, MessageSquare, Briefcase, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/",          icon: Home,            label: "홈" },
  { href: "/directory", icon: Search,          label: "비즈니스" },
  { href: "/community", icon: MessageSquare,   label: "커뮤니티" },
  { href: "/jobs",      icon: Briefcase,       label: "채용" },
  { href: "/more",      icon: MoreHorizontal,  label: "더보기" },
];

export function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-sm border-t border-gray-100">
      <div className="flex">
        {TABS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                active ? "text-[#FF5C5C]" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
              <span className={cn("text-[10px]", active ? "font-semibold" : "font-medium")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
