"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";

export function DeleteAccountButton() {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/auth/login");
      return;
    }

    // Delete profile row (RLS: own_profile FOR ALL allows this)
    const { error: deleteError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (deleteError) {
      setError("삭제 중 오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.refresh();
    router.replace("/");
  }

  if (confirm) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-3">
        <p className="text-sm font-semibold text-red-700">
          정말 삭제하시겠어요?
        </p>
        <p className="text-xs text-red-500">이 작업은 되돌릴 수 없어요.</p>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600
                       text-white text-sm font-semibold py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading && (
              <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            삭제하기
          </button>
          <button
            onClick={() => setConfirm(false)}
            disabled={loading}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-semibold
                       py-2 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500
                 border border-gray-200 hover:border-red-200 rounded-xl px-4 py-2.5
                 transition-all opacity-60 hover:opacity-100"
    >
      <Trash2 className="w-4 h-4" />
      계정 삭제
    </button>
  );
}
