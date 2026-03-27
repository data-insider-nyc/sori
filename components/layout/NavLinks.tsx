"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/community", label: "커뮤니티" },
  { href: "/directory", label: "비즈니스" },
  { href: "/jobs", label: "채용" },
];

export function NavLinks() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {NAV.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === link.href
              ? "bg-[#FFF0F0] text-[#FF5C5C]"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
