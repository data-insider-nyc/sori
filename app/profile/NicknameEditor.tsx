"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { generateNickname } from "@/lib/nickname";

const NICKNAME_REGEX = /^[가-힣a-zA-Z0-9_]{2,20}$/;

interface Props {
  userId: string;
  currentNickname: string;
  cooldownDays: number | null;
}

export function NicknameEditor({ userId, currentNickname, cooldownDays }: Props) {
  const [generated, setGenerated] = useState(() => generateNickname());
  const [custom, setCustom]       = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const isLocked = cooldownDays !== null;

  const finalNickname = custom.trim() || generated;

  async function handleSave() {
    if (finalNickname === currentNickname) {
      setError("현재 닉네임과 동일해요.");
      return;
    }
    if (custom.trim() && !NICKNAME_REGEX.test(custom.trim())) {
      setError("한글, 영문, 숫자, 밑줄(_)만 사용 가능하며 2~20자이어야 해요.");
      return;
    }
    setLoading(true);
    setError("");

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        nickname: finalNickname,
        nickname_changed_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (updateError) {
      setError("저장에 실패했어요. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setCustom("");
    router.refresh();
  }

  if (isLocked) {
    return (
      <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 text-center">
        🔒 {cooldownDays}일 후에 닉네임을 변경할 수 있어요.
      </div>
    );
  }

  if (success) {
    return (
      <div className="bg-[#FFF0F0] rounded-xl px-4 py-3 text-sm text-[#FF5C5C] font-semibold text-center">
        ✓ 닉네임이 변경되었어요!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Generated option */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-[#FFF0F0] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#FF5C5C]">
          {generated}
        </div>
        <button
          onClick={() => { setGenerated(generateNickname()); setError(""); }}
          className="p-2.5 rounded-xl border border-gray-200 text-gray-400 hover:text-[#FF5C5C] hover:border-[#FF5C5C] transition-colors"
          title="다시 뽑기"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-xs text-gray-400">또는 직접 입력</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Custom input */}
      <input
        type="text"
        value={custom}
        onChange={(e) => { setCustom(e.target.value); setError(""); }}
        placeholder="원하는 닉네임 (2~20자)"
        maxLength={20}
        className="input-field"
        disabled={loading}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}

      <button
        onClick={handleSave}
        disabled={loading}
        className="btn-coral w-full flex items-center justify-center gap-2 text-sm"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        닉네임 변경하기
      </button>
    </div>
  );
}
