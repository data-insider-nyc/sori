"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, AtSign, Check, X, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { generateNickname, generateHandle } from "@/lib/nickname";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { TARGET_CITIES } from "@/lib/constants";

const DISPLAY_NAME_REGEX = /^[가-힣a-zA-Z0-9\s]{2,20}$/;
const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

const LOCATION_OPTIONS = TARGET_CITIES.filter((c) => c.value !== "");

export default function NicknamePage() {
  const [displayName, setDisplayName] = useState("");
  const [handle, setHandle] = useState("");
  const [location, setLocation] = useState("");
  const [handleStatus, setHandleStatus] = useState<
    "idle" | "checking" | "ok" | "taken"
  >("idle");
  const [generatedName, setGeneratedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setGeneratedName(generateNickname());
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setHandle(generateHandle(user.email));
    });
  }, []);

  useEffect(() => {
    if (!handle || !HANDLE_REGEX.test(handle)) {
      setHandleStatus("idle");
      return;
    }
    setHandleStatus("checking");
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("handle", handle)
        .maybeSingle();
      setHandleStatus(data ? "taken" : "ok");
    }, 500);
    return () => clearTimeout(timer);
  }, [handle]);

  const finalDisplayName = displayName.trim() || generatedName;
  const canSubmit =
    finalDisplayName &&
    handle &&
    HANDLE_REGEX.test(handle) &&
    handleStatus === "ok" &&
    !loading;

  async function handleConfirm() {
    if (!HANDLE_REGEX.test(handle)) {
      setError(
        "핸들은 영문 소문자, 숫자, 밑줄(_)만 가능하고 3~20자이어야 해요.",
      );
      return;
    }
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    const { error: upsertError } = await supabase.from("profiles").upsert({
      id: user.id,
      nickname: finalDisplayName,
      display_name: finalDisplayName,
      handle: handle.toLowerCase(),
      ...(location ? { location } : {}),
    });

    if (upsertError) {
      setError(
        upsertError.code === "23505"
          ? "이미 사용 중인 핸들이에요. 다른 핸들을 선택해주세요."
          : "저장에 실패했어요. 다시 시도해주세요.",
      );
      setLoading(false);
      return;
    }

    router.refresh();
    router.replace("/");
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 w-full max-w-sm">
        <div className="text-center mb-6">
          <span className="text-4xl font-black text-[#FF5C5C]">소리</span>
          <p className="text-xs text-gray-400 font-medium tracking-widest mt-1">
            SORI
          </p>
        </div>

        <h1 className="text-xl font-black text-gray-900 mb-1 text-center">
          프로필 설정
        </h1>
        <p className="text-sm text-gray-400 mb-7 text-center">
          커뮤니티에서 사용할 정보예요
        </p>

        {/* 표시이름 */}
        <div className="mb-5">
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            표시이름
            <span className="text-gray-400 font-normal ml-1">
              — 피드에 보이는 이름
            </span>
          </label>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 bg-[#FFF0F0] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#FF5C5C]">
              {generatedName}
            </div>
            <button
              onClick={() => setGeneratedName(generateNickname())}
              className="p-2.5 rounded-xl border border-gray-200 text-gray-400
                         hover:text-[#FF5C5C] hover:border-[#FF5C5C] transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">또는 직접 입력</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="예: 포트리 칼, 플러싱 언니"
            maxLength={20}
            className="input-field"
            disabled={loading}
          />
          <p className="text-[11px] text-gray-400 mt-1">
            한글·영문 가능, 언제든 변경 가능
          </p>
        </div>

        {/* @핸들 */}
        <div className="mb-5">
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            @핸들
            <span className="text-gray-400 font-normal ml-1">— 고유 ID</span>
          </label>
          <div className="relative">
            <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={handle}
              onChange={(e) =>
                setHandle(
                  e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""),
                )
              }
              placeholder="my_handle"
              maxLength={20}
              className="input-field pl-10 pr-10"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {handleStatus === "checking" && (
                <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin block" />
              )}
              {handleStatus === "ok" && (
                <Check className="w-4 h-4 text-emerald-500" />
              )}
              {handleStatus === "taken" && (
                <X className="w-4 h-4 text-red-400" />
              )}
            </div>
          </div>
          <p
            className={`text-[11px] mt-1 ${handleStatus === "taken" ? "text-red-400" : handleStatus === "ok" ? "text-emerald-500" : "text-gray-400"}`}
          >
            {handleStatus === "taken"
              ? "이미 사용 중인 핸들이에요"
              : handleStatus === "ok"
                ? "사용 가능한 핸들이에요 ✓"
                : "영문 소문자, 숫자, 밑줄(_)만 가능"}
          </p>
        </div>

        {/* 지역 */}
        <div className="mb-6">
          <label className="text-sm font-bold text-gray-700 mb-2 block">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />내 지역
              <span className="text-gray-400 font-normal">(선택)</span>
            </span>
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input-field appearance-none"
            disabled={loading}
          >
            <option value="">선택 안 함</option>
            {LOCATION_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="text-[11px] text-gray-400 mt-1">
            닉네임 옆에 지역 배지로 표시돼요
          </p>
        </div>

        {/* 미리보기 */}
        {finalDisplayName && (
          <div className="bg-gray-50 rounded-2xl p-4 mb-5">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-2">
              미리보기
            </p>
            <ProfileCard
              nickname={finalDisplayName}
              handle={handle || undefined}
              location={location || undefined}
              size="md"
            />
          </div>
        )}

        {error && (
          <p className="text-xs text-red-500 mb-4 text-center">{error}</p>
        )}

        <button
          onClick={handleConfirm}
          disabled={!canSubmit}
          className="btn-coral w-full flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          소리 시작하기 →
        </button>

        <p className="mt-4 text-xs text-gray-400 text-center">
          핸들은 설정 후 90일마다 변경 가능해요
        </p>
      </div>
    </div>
  );
}
