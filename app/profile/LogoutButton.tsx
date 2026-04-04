"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

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
      className="w-full text-sm font-semibold py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
    >
      로그아웃
    </button>
  );
}
