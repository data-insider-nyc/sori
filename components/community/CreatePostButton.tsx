"use client";
import { useRouter } from "next/navigation";
import { PenSquare } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function CreatePostButton() {
  const router = useRouter();
  const { userId } = useAuth();

  function handleClick() {
    if (!userId) {
      router.push("/auth/login");
      return;
    }
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
