"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { LogOut, ChevronRight, Loader2 } from "lucide-react";

interface LogoutButtonProps {
  variant?: "card" | "menu-item";
  onClose?: () => void;
}

export function LogoutButton({ variant = "card", onClose }: LogoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    setLoading(true);
    onClose?.();
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/");
  }

  if (variant === "menu-item") {
    return (
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm
                   text-red-500 hover:bg-gray-50 hover:text-red-600
                   disabled:opacity-50 transition-colors"
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <LogOut className="w-4 h-4" />}
        <span>{loading ? "로그아웃 중..." : "로그아웃"}</span>
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full group flex items-center justify-between
                 px-4 py-3 rounded-xl border border-gray-200
                 text-gray-600 bg-white
                 hover:bg-gray-900 hover:border-gray-900 hover:text-white
                 active:scale-[0.99] disabled:opacity-50
                 transition-all duration-200"
    >
      <div className="flex items-center gap-2.5">
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <LogOut className="w-4 h-4" />
        }
        <span className="text-sm font-semibold">
          {loading ? "로그아웃 중..." : "로그아웃"}
        </span>
      </div>
      {!loading && (
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-white/50 transition-colors" />
      )}
    </button>
  );
}
