"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import {
  COMMUNITY_CATEGORIES, DEFAULT_CATEGORY,
  REGIONS, LOCAL_CATEGORIES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { PostCategory } from "@/lib/constants";
import type { Region } from "@/types";

const TITLE_MAX   = 50;
const CONTENT_MAX = 2000;

export default function NewPostPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [category,      setCategory]      = useState<PostCategory>(DEFAULT_CATEGORY);
  const [region,        setRegion]        = useState<Region | null>(null);
  const [profileRegion, setProfileRegion] = useState<Region>("nyc");
  const [title,         setTitle]         = useState("");
  const [content,       setContent]       = useState("");
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");

  // Load user's default region from profile once
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("profiles")
        .select("default_region")
        .eq("id", user.id)
        .single();
      if (data?.default_region) setProfileRegion(data.default_region as Region);
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When category changes, auto-set region based on whether it's a local category
  useEffect(() => {
    setRegion(LOCAL_CATEGORIES.has(category) ? profileRegion : null);
  }, [category, profileRegion]);

  const isLocal    = LOCAL_CATEGORIES.has(category);
  const titleLeft  = TITLE_MAX   - title.length;
  const contentLeft = CONTENT_MAX - content.length;
  const canSubmit  = title.trim().length > 0 && content.trim().length > 0 && !loading;

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace("/auth/login"); return; }

    const { data: post, error: insertError } = await supabase
      .from("posts")
      .insert({
        user_id:  user.id,
        category,
        region:   region,   // null = nationwide, Region value = metro-scoped
        title:    title.trim(),
        content:  content.trim(),
        tags:     [],
      })
      .select("id")
      .single();

    if (insertError || !post) {
      setError("저장 중 오류가 발생했어요. 다시 시도해주세요.");
      setLoading(false);
      return;
    }

    router.replace(`/community/${post.id}`);
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-700 transition-colors text-sm"
        >
          ← 뒤로
        </button>
        <h1 className="text-2xl font-black text-gray-900">글쓰기</h1>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-5">

        {/* Category */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">카테고리</p>
          <div className="flex flex-wrap gap-2">
            {COMMUNITY_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={cn("chip", category === cat.value && "chip-active")}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Region — only shown for inherently local categories */}
        {isLocal && (
          <>
            <div className="border-t border-gray-100" />
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-1">지역</p>
              <p className="text-xs text-gray-400 mb-3">
                이 게시글을 볼 지역을 선택하세요. 전국 공개를 원하면 카테고리를 변경해주세요.
              </p>
              <div className="flex flex-wrap gap-2">
                {REGIONS.filter((r) => r.status === "open").map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRegion(r.value)}
                    className={cn("chip", region === r.value && "chip-active")}
                  >
                    {r.emoji} {r.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {!isLocal && (
          <p className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2.5">
            🌐 이 카테고리는 모든 지역에 공개됩니다.
          </p>
        )}

        <div className="border-t border-gray-100" />

        {/* Title */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">제목</label>
            <span className={cn("text-xs", titleLeft < 10 ? "text-red-400" : "text-gray-400")}>
              {titleLeft}자 남음
            </span>
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            placeholder="제목을 입력해주세요"
            className="input-field"
          />
        </div>

        {/* Content */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-semibold text-gray-700">내용</label>
            <span className={cn("text-xs", contentLeft < 100 ? "text-red-400" : "text-gray-400")}>
              {contentLeft}자 남음
            </span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
            placeholder="내용을 입력해주세요"
            rows={8}
            className="input-field resize-none"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="btn-coral w-full flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          게시하기
        </button>
      </div>
    </div>
  );
}

