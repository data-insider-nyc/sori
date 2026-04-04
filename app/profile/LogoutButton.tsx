"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    router.replace("/");
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 text-sm font-medium text-gray-600
                 border border-gray-200 rounded-xl px-4 py-2.5
                 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50"
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      로그아웃
    </button>
  );
}
