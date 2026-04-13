"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { REGIONS } from "@/lib/regions";

interface Props {
  userId: string;
  currentLocation: string;
  cooldownDays?: number | null;
}

export function LocationEditor({ userId, currentLocation, cooldownDays }: Props) {
  const [location, setLocation] = useState(currentLocation);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const isLocked = cooldownDays != null && cooldownDays > 0;

  async function save() {
    setLoading(true);
    setSuccess("");
    const { error } = await supabase
      .from("profiles")
      .update({ location, location_changed_at: new Date().toISOString() })
      .eq("id", userId);

    if (!error) {
      setSuccess("지역이 저장됐어요 ✓");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <p className="text-sm font-semibold text-gray-700">활동 지역</p>
        </div>
        {isLocked && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" />
            {cooldownDays}일 후 변경 가능
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-4">프로필에 표시돼요 · 90일마다 변경 가능</p>

      {success && (
        <div className="bg-[#FFF0F0] rounded-xl px-4 py-2.5 text-sm text-[#FF5C5C] font-semibold text-center mb-3">
          {success}
        </div>
      )}

      {isLocked ? (
        <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 text-center">
          {REGIONS.find((r) => r.value === currentLocation)?.label ?? currentLocation}
        </div>
      ) : (
        <>
          <select
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setSuccess("");
            }}
            className="input-field appearance-none mb-3"
            disabled={loading}
          >
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          <button
            onClick={save}
            disabled={loading || location === currentLocation}
            className="btn-coral w-full text-sm disabled:opacity-40"
          >
            지역 저장
          </button>
        </>
      )}
    </div>
  );
}
