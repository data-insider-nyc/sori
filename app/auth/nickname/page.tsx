"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { generateNickname } from "@/lib/nickname";

export default function NicknamePage() {
  const [nickname, setNickname] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setNickname(generateNickname());
  }, []);

  function reroll() {
    setNickname(generateNickname());
    setError("");
  }

  async function handleConfirm() {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      nickname,
    });

    if (upsertError) {
      setError("닉네임 저장에 실패했어요. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    router.replace("/");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mb-6">
          <span className="text-4xl font-black text-[#FF5C5C]">소리</span>
          <p className="text-xs text-gray-400 font-medium tracking-widest mt-1">SORI</p>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">닉네임 설정</h1>
        <p className="text-sm text-gray-500 mb-8">
          커뮤니티에서 사용할 닉네임이에요 🎉
        </p>

        {/* Nickname display */}
        <div className="bg-[#FFF0F0] rounded-2xl px-6 py-5 mb-4">
          <p className="text-lg font-bold text-[#FF5C5C] break-keep leading-snug">
            {nickname || "닉네임 생성 중..."}
          </p>
        </div>

        {/* Re-roll */}
        <button
          onClick={reroll}
          disabled={loading}
          className="flex items-center gap-2 mx-auto text-sm font-medium text-gray-500
                     hover:text-[#FF5C5C] transition-colors mb-6 disabled:opacity-40"
        >
          <RefreshCw className="w-4 h-4" />
          다시 뽑기
        </button>

        {error && (
          <p className="text-xs text-red-500 mb-4">{error}</p>
        )}

        {/* Confirm */}
        <button
          onClick={handleConfirm}
          disabled={loading || !nickname}
          className="btn-coral w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : null}
          이 닉네임으로 시작하기
        </button>

        <p className="mt-4 text-xs text-gray-400">
          닉네임은 나중에 마이페이지에서 변경할 수 있어요.
        </p>
      </div>
    </div>
  );
}
