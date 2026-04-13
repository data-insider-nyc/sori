"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, AtSign, Check, X, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { generateNickname } from "@/lib/nickname";

const HANDLE_REGEX = /^[a-z0-9_]{3,20}$/;

interface Props {
  userId: string;
  currentNickname: string;
  currentHandle: string | null;
  cooldownDays: number | null;
  handleCooldown: number | null;
}

function CooldownBadge({ days }: { days: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
      <Lock className="w-3 h-3" />
      {days}일 후 변경 가능
    </span>
  );
}

export function NicknameEditor({
  userId,
  currentNickname,
  currentHandle,
  cooldownDays,
  handleCooldown,
}: Props) {
  const [generated, setGenerated] = useState(() => generateNickname());
  const [custom, setCustom] = useState("");
  const [newHandle, setNewHandle] = useState(currentHandle ?? "");
  const [handleStatus, setHandleStatus] = useState<
    "idle" | "checking" | "ok" | "taken"
  >("idle");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClient();
  const isLocked = cooldownDays !== null;
  const isHandleLocked = handleCooldown !== null;

  async function checkHandle(val: string) {
    if (!val || !HANDLE_REGEX.test(val) || val === currentHandle) {
      setHandleStatus(val === currentHandle ? "ok" : "idle");
      return;
    }
    setHandleStatus("checking");
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .eq("handle", val)
      .maybeSingle();
    setHandleStatus(data ? "taken" : "ok");
  }

  async function saveDisplayName() {
    const name = custom.trim() || generated;
    if (name === currentNickname) {
      setError("현재 이름과 동일해요.");
      return;
    }
    setLoading(true);
    const { error: e } = await supabase
      .from("profiles")
      .update({
        nickname: name,
        display_name: name,
        nickname_changed_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (e) {
      setError("저장 실패. 다시 시도해주세요.");
      setLoading(false);
      return;
    }
    setSuccess("표시이름이 변경됐어요 ✓");
    setLoading(false);
    router.refresh();
  }

  async function saveHandle() {
    if (!HANDLE_REGEX.test(newHandle)) {
      setError("핸들 형식이 올바르지 않아요.");
      return;
    }
    if (handleStatus === "taken") {
      setError("이미 사용 중인 핸들이에요.");
      return;
    }
    setLoading(true);
    const { error: e } = await supabase
      .from("profiles")
      .update({
        handle: newHandle,
        handle_changed_at: new Date().toISOString(),
      })
      .eq("id", userId);
    if (e) {
      setError("저장 실패. 다시 시도해주세요.");
      setLoading(false);
      return;
    }
    setSuccess("핸들이 변경됐어요 ✓");
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="bg-[#FFF0F0] rounded-xl px-4 py-3 text-sm text-[#FF5C5C] font-semibold text-center">
          {success}
        </div>
      )}
      {error && <p className="text-xs text-red-500 text-center">{error}</p>}

      {/* 표시이름 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-gray-700">표시이름</p>
          {isLocked && <CooldownBadge days={cooldownDays!} />}
        </div>
        <p className="text-xs text-gray-400 mb-3">90일마다 변경할 수 있어요</p>

        {isLocked ? (
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 text-center">
            {currentNickname}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 bg-[#FFF0F0] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#FF5C5C]">
                {generated}
              </div>
              <button
                onClick={() => setGenerated(generateNickname())}
                className="p-2.5 rounded-xl border border-gray-200 text-gray-400
                           hover:text-[#FF5C5C] hover:border-[#FF5C5C] transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={custom}
              onChange={(e) => {
                setCustom(e.target.value);
                setError("");
                setSuccess("");
              }}
              placeholder="직접 입력 (선택)"
              maxLength={20}
              className="input-field mb-2"
              disabled={loading}
            />
            <button
              onClick={saveDisplayName}
              disabled={loading}
              className="btn-coral w-full text-sm"
            >
              표시이름 저장
            </button>
          </>
        )}
      </div>

      <div className="h-px bg-gray-100" />

      {/* @핸들 */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-gray-700">@핸들</p>
          {isHandleLocked && <CooldownBadge days={handleCooldown!} />}
        </div>
        <p className="text-xs text-gray-400 mb-3">
          고유 ID · 영문 소문자, 숫자, 밑줄(_) · 90일마다 변경 가능
        </p>

        {isHandleLocked ? (
          <div className="bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-500 text-center">
            @{currentHandle ?? "—"}
          </div>
        ) : (
          <>
            <div className="relative mb-2">
              <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={newHandle}
                onChange={(e) => {
                  const v = e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9_]/g, "");
                  setNewHandle(v);
                  setError("");
                  setSuccess("");
                  checkHandle(v);
                }}
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
              className={`text-[11px] mb-3 ${
                handleStatus === "taken"
                  ? "text-red-400"
                  : handleStatus === "ok"
                    ? "text-emerald-500"
                    : "text-gray-400"
              }`}
            >
              {handleStatus === "taken"
                ? "이미 사용 중인 핸들이에요"
                : handleStatus === "ok"
                  ? "사용 가능 ✓"
                  : "영문 소문자, 숫자, 밑줄(_)만 가능"}
            </p>
            <button
              onClick={saveHandle}
              disabled={
                loading || handleStatus !== "ok" || newHandle === currentHandle
              }
              className="btn-coral w-full text-sm disabled:opacity-40"
            >
              핸들 저장
            </button>
          </>
        )}
      </div>
    </div>
  );
}
