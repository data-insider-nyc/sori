"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { TARGET_CITIES } from "@/lib/constants";

const LOCATION_OPTIONS = TARGET_CITIES.filter((c) => c.value !== "");

interface Props {
  userId: string;
  currentLocation: string | null;
}

export function LocationEditor({ userId, currentLocation }: Props) {
  const [location, setLocation] = useState(currentLocation ?? "");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function save() {
    setLoading(true);
    setSuccess("");
    const { error } = await supabase
      .from("profiles")
      .update({ location: location || null })
      .eq("id", userId);

    if (!error) {
      setSuccess("지역이 저장됐어요 ✓");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <MapPin className="w-3.5 h-3.5 text-blue-400" />
        <p className="text-sm font-semibold text-gray-700">내 지역</p>
      </div>
      <p className="text-xs text-gray-400 mb-4">닉네임 옆 지역 배지에 표시돼요</p>

      {success && (
        <div className="bg-[#FFF0F0] rounded-xl px-4 py-2.5 text-sm text-[#FF5C5C] font-semibold text-center mb-3">
          {success}
        </div>
      )}

      <select
        value={location}
        onChange={(e) => { setLocation(e.target.value); setSuccess(""); }}
        className="input-field appearance-none mb-3"
        disabled={loading}
      >
        <option value="">선택 안 함</option>
        {LOCATION_OPTIONS.map((c) => (
          <option key={c.value} value={c.value}>{c.label}</option>
        ))}
      </select>

      <button
        onClick={save}
        disabled={loading || location === (currentLocation ?? "")}
        className="btn-coral w-full text-sm disabled:opacity-40"
      >
        지역 저장
      </button>
    </div>
  );
}
