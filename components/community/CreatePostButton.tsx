"use client";
import { useRouter } from "next/navigation";
import { PenSquare } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export function CreatePostButton() {
  const router = useRouter();

  async function handleClick() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/auth/login");
      return;
    }
    // TODO: open post creation modal (issue #5)
  }

  return (
    <button
      onClick={handleClick}
      className="btn-coral flex items-center gap-2 text-sm"
    >
      <PenSquare className="w-4 h-4" />
      <span className="hidden sm:inline">글쓰기</span>
    </button>
  );
}
