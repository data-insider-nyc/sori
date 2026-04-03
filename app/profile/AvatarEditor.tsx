"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { ProfileAvatar } from "@/components/ui/ProfileCard";

interface Props {
  userId: string;
  nickname: string;
  currentAvatarUrl: string | null;
}

export function AvatarEditor({ userId, nickname, currentAvatarUrl }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentAvatarUrl);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("이미지 파일만 업로드 가능해요.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("파일 크기는 2MB 이하여야 해요.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) {
        setError("업로드 실패: " + uploadError.message);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(path);

      // cache-buster so browser fetches fresh image
      const url = `${publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", userId);

      if (updateError) {
        setError("저장 실패: " + updateError.message);
        return;
      }

      setAvatarUrl(url);
    });
  }

  async function handleRemove() {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", userId);
      if (error) { setError("삭제 실패: " + error.message); return; }
      setAvatarUrl(null);
    });
  }

  return (
    <div>
      <p className="text-sm font-semibold text-gray-700 mb-4">프로필 사진</p>

      <div className="flex items-center gap-5">
        {/* Click avatar to upload — same UX as Threads/X */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="relative group focus:outline-none"
          aria-label="프로필 사진 변경"
        >
          <ProfileAvatar nickname={nickname} avatarUrl={avatarUrl} size="lg" />
          <span className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center
                           opacity-0 group-hover:opacity-100 transition-opacity">
            {isPending
              ? <Loader2 className="w-5 h-5 text-white animate-spin" />
              : <Camera className="w-5 h-5 text-white" />}
          </span>
        </button>

        <div className="flex flex-col gap-1.5">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending}
            className="btn-coral text-sm !py-1.5 !px-4"
          >
            사진 변경
          </button>
          {avatarUrl && (
            <button
              type="button"
              onClick={handleRemove}
              disabled={isPending}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3" />사진 삭제
            </button>
          )}
          <p className="text-xs text-gray-400">JPG · PNG · GIF · 최대 2MB</p>
        </div>
      </div>

      {error && <p className="text-xs text-red-500 mt-3">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
