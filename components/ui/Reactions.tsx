"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { fetchWithRetry } from "@/lib/fetch-retry";
import { showToast } from "@/lib/toast";

export type Reaction = {
  key: string; // unique key (use emoji string by default)
  emoji: string;
  count: number;
  reacted: boolean;
};

interface ReactionsProps {
  postId: string;
  userId: string | null;
  initialReactions?: Reaction[];
  /** show a small "+" button to add a reaction */
  allowAdd?: boolean;
  className?: string;
  /** Optional handler for toggling reaction (returns server state {count, reacted}) */
  onToggle?: (
    reactionKey: string,
  ) => Promise<{ count: number; reacted: boolean } | null>;
}

export default function Reactions({
  postId,
  userId,
  initialReactions = [],
  allowAdd = true,
  className,
  onToggle,
}: ReactionsProps) {
  const router = useRouter();
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const commonEmojis = ["👍", "❤️", "😂", "🎉", "😮", "😢", "👏", "🔥", "👀"];

  useEffect(() => {
    // Only update internal state when the incoming initialReactions actually
    // differ from current reactions. This prevents re-setting state when the
    // parent passes a new array reference on every render.
    const isSame =
      reactions.length === initialReactions.length &&
      initialReactions.every((ir) => {
        const r = reactions.find((rr) => rr.key === ir.key);
        return !!r && r.count === ir.count && r.reacted === ir.reacted;
      });

    if (!isSame) {
      setReactions(initialReactions);
    }
  }, [initialReactions, reactions]);

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!pickerRef.current) return;
      const target = e.target as Node;
      if (!pickerRef.current.contains(target)) setPickerOpen(false);
    }

    if (pickerOpen) document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, [pickerOpen]);

  async function defaultToggle(reactionKey: string) {
    const res = await fetchWithRetry(
      `/api/posts/${postId}/reactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reaction: reactionKey }),
        credentials: "include",
      },
      { retries: 1 },
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body?.error || "Server error");
    }
    return res.json();
  }

  async function toggleReaction(reactionKey: string) {
    if (!userId) {
      showToast("로그인이 필요합니다.");
      // router.push("/auth/login");
      return;
    }

    if (pending[reactionKey]) return;
    setPending((p) => ({ ...p, [reactionKey]: true }));

    // optimistic update
    const idx = reactions.findIndex((r) => r.key === reactionKey);
    const existed = idx >= 0;
    const previous = reactions;

    let next: Reaction[];
    if (existed) {
      const r = { ...reactions[idx] };
      r.reacted = !r.reacted;
      r.count = r.reacted ? r.count + 1 : Math.max(0, r.count - 1);
      next = [...reactions];
      next[idx] = r;
    } else {
      next = [
        { key: reactionKey, emoji: reactionKey, count: 1, reacted: true },
        ...reactions,
      ];
    }

    setReactions(next);

    try {
      const result = onToggle
        ? await onToggle(reactionKey)
        : await defaultToggle(reactionKey);
      if (result && typeof result.count === "number") {
        setReactions((cur) => {
          const i = cur.findIndex((r) => r.key === reactionKey);
          if (i >= 0) {
            const copy = [...cur];
            copy[i] = {
              ...copy[i],
              count: result.count,
              reacted: result.reacted,
            };
            return copy;
          }
          return [
            {
              key: reactionKey,
              emoji: reactionKey,
              count: result.count,
              reacted: result.reacted,
            },
            ...cur,
          ];
        });
      }
    } catch (err) {
      console.error("[Reactions] toggle err", err);
      showToast("반응을 처리하지 못했습니다.");
      setReactions(previous);
    } finally {
      setPending((p) => {
        const copy = { ...p };
        delete copy[reactionKey];
        return copy;
      });
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {reactions.map((r) => (
        <button
          key={r.key}
          onClick={() => toggleReaction(r.key)}
          aria-pressed={r.reacted}
          disabled={!!pending[r.key]}
          className={cn(
            "px-2 py-1 rounded-full flex items-center gap-1 text-sm border transition",
            r.reacted
              ? "bg-[#FFF0F0] border-[#FFCCCC] text-[#FF5C5C]"
              : "bg-gray-100 border-transparent hover:bg-gray-200",
          )}
        >
          <span className="text-base leading-none">{r.emoji}</span>
          <span className="text-xs font-medium leading-none">{r.count}</span>
        </button>
      ))}

      {allowAdd && (
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className="px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
            aria-haspopup="dialog"
            aria-expanded={pickerOpen}
          >
            +
          </button>

          {pickerOpen && (
            <div className="absolute z-50 mt-2 p-2 bg-white rounded-md shadow-lg grid grid-cols-6 gap-1 w-44">
              {commonEmojis.map((e) => (
                <button
                  key={e}
                  onClick={() => {
                    toggleReaction(e);
                    setPickerOpen(false);
                  }}
                  className="p-1 text-lg hover:bg-gray-100 rounded"
                  aria-label={`React ${e}`}
                >
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
