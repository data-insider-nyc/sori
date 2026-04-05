"use client";

import { useState } from "react";
import Link from "next/link";
import { UserCircle, User, ChevronDown } from "lucide-react";
import { ProfileAvatar } from "@/components/ui/ProfileCard";
import { LogoutButton } from "@/components/ui/LogoutButton";

interface Props {
  nickname: string;
  avatarUrl?: string | null;
}

export function UserMenu({ nickname, avatarUrl }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-gray-700
                   hover:text-[#FF5C5C] transition-colors"
      >
        <ProfileAvatar
          nickname={nickname}
          avatarUrl={avatarUrl}
          size="sm"
          className="w-7 h-7 text-xs"
        />
        <span className="font-semibold text-gray-900">{nickname}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-9 z-20 bg-white border border-gray-100
                          rounded-2xl shadow-lg py-2 w-44"
          >
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600
                           hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <UserCircle className="w-4 h-4" />내 프로필
              </Link>
              <LogoutButton variant="menu-item" onClose={() => setOpen(false)} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function LoginButton() {
  return (
    <a
      href="/auth/login"
      className="flex items-center gap-2 text-sm font-medium text-gray-700
                 border border-gray-200 rounded-full px-4 py-1.5
                 hover:border-[#FF5C5C] hover:text-[#FF5C5C] transition-colors"
    >
      <User className="w-4 h-4" />
      로그인
    </a>
  );
}
