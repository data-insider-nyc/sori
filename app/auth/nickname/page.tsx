"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { generateNickname } from "@/lib/nickname";

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9]{3,10}$/;

export default function NicknamePage() {
  const [generated, setGenerated] = useState("");
  const [custom, setCustom]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => { setGenerated(generateNickname()); }, []);

  const finalNickname = custom.trim() || generated;

  function reroll() {
    setGenerated(generateNickname());
    setError("");
  }

  function handleCustomChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCustom(e.target.value);
    setError("");
  }

  async function handleConfirm() {
    if (custom.trim() && !NICKNAME_REGEX.test(custom.trim())) {
      setError("한글, 영문, 숫자만 사용 가능하며 3~10자이어야 해요.");
      return;
    }
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/auth/login"); return; }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      nickname: finalNickname,
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
        <div className="mb-6">
          <span className="text-4xl font-black text-[#FF5C5C]">소리</span>
          <p className="text-xs text-gray-400 font-medium tracking-widest mt-1">SORI</p>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">닉네임 설정</h1>
        <p className="text-sm text-gray-500 mb-6">커뮤니티에서 사용할 닉네임이에요 🎉</p>

        {/* Generated nickname */}
        <div className="bg-[#FFF0F0] rounded-2xl px-6 py-4 mb-3">
          <p className="text-base font-bold text-[#FF5C5C] break-keep">
            {generated || "닉네임 생성 중..."}
          </p>
        </div>
        <button
          onClick={reroll}
          disabled={loading}
          className="flex items-center gap-1.5 mx-auto text-xs font-medium text-gray-400
                     hover:text-[#FF5C5C] transition-colors mb-5 disabled:opacity-40"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          다시 뽑기
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">또는 직접 입력</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Custom input */}
        <input
          type="text"
          value={custom}
          onChange={handleCustomChange}
          placeholder="원하는 닉네임 입력 (2~20자)"
          maxLength={20}
          className="input-field text-center mb-2"
          disabled={loading}
        />
        <p className="text-[11px] text-gray-400 mb-5">한글·영문·숫자만 가능, 3~10자</p>

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleConfirm}
          disabled={loading || !finalNickname}
          className="btn-coral w-full flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          이 닉네임으로 시작하기
        </button>

        <p className="mt-4 text-xs text-gray-400">닉네임은 마이페이지에서 14일마다 변경할 수 있어요.</p>
      </div>
    </div>
  );
}
