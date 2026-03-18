"use client";
import { PenSquare } from "lucide-react";

export function CreatePostButton() {
  return (
    <button
      onClick={() => alert("로그인 후 글쓰기가 가능합니다.")}
      className="btn-coral flex items-center gap-2 text-sm"
    >
      <PenSquare className="w-4 h-4" />
      <span className="hidden sm:inline">글쓰기</span>
    </button>
  );
}
