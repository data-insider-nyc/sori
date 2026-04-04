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
      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600
                           hover:bg-gray-50 hover:text-gray-900 transition-colors"
    >
      <LogOut className="w-4 h-4" />
      로그아웃
    </button>
  );
}
