"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, UserCircle, User, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

interface Props {
  nickname: string;
}

export function UserMenu({ nickname }: Props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-700
                   hover:text-[#FF5C5C] transition-colors"
      >
        <span>
          <span className="text-gray-400 font-normal">반가워요! </span>
          <span className="font-bold text-gray-900">{nickname}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 bg-white border border-gray-100
                          rounded-2xl shadow-lg py-2 w-44">
            <div className="py-1">
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600
                           hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <UserCircle className="w-4 h-4" />내 프로필
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

