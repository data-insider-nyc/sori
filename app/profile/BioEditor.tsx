"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";

const BIO_MAX = 150;

interface Props {
  userId: string;
  currentBio: string | null;
}

export function BioEditor({ userId, currentBio }: Props) {
  const [bio, setBio] = useState(currentBio ?? "");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const remaining = BIO_MAX - bio.length;
  const isDirty = bio !== (currentBio ?? "");

  async function handleSave() {
    setLoading(true);
    setError("");
    setSuccess(false);

    const { error: e } = await supabase
      .from("profiles")
      .update({ bio: bio.trim() || null })
      .eq("id", userId);

    if (e) {
      setError("저장 중 오류가 발생했어요.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-700">한 줄 소개</label>
        <span className={cn("text-xs", remaining < 20 ? "text-red-400" : "text-gray-400")}>
          {remaining}자 남음
        </span>
      </div>

      <textarea
        value={bio}
        onChange={(e) => {
          setBio(e.target.value.slice(0, BIO_MAX));
          setSuccess(false);
        }}
        placeholder="자신을 한 줄로 소개해보세요 (선택)"
        rows={3}
        className="input-field resize-none"
      />

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      {success && <p className="text-xs text-[#FF5C5C] mt-1">저장됐어요 ✓</p>}

      <button
        onClick={handleSave}
        disabled={loading || !isDirty}
        className="btn-coral mt-3 w-full flex items-center justify-center gap-2"
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        )}
        저장
      </button>
    </div>
  );
}
