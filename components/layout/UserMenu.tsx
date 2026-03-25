"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, UserCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { getInitials, avatarColor } from "@/lib/utils";

interface Props {
  nickname: string;
}

export function UserMenu({ nickname }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
  }

  const colorClass = avatarColor(nickname);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-9 h-9 rounded-full flex items-center justify-center
                    text-sm font-bold transition-opacity hover:opacity-80 ${colorClass}`}
      >
        {getInitials(nickname)}
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setOpen(false)}
          />
          {/* Dropdown */}
          <div className="absolute right-0 top-11 z-20 bg-white border border-gray-100
                          rounded-2xl shadow-lg py-2 w-44">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-xs text-gray-400">닉네임</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{nickname}</p>
            </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600
                         hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <UserCircle className="w-4 h-4" />
              내 프로필
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600
                         hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              로그아웃
            </button>
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
