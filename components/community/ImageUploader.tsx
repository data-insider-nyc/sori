"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

export const MAX_IMAGES = 4;
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface Props {
  userId: string;
  value: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

interface UploadingItem {
  id: string;
  preview: string;
  progress: "uploading" | "error";
}

export function ImageUploader({ userId, value, onChange, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [error, setError] = useState("");

  const totalCount = value.length + uploading.length;
  const canAdd = totalCount < MAX_IMAGES && !disabled;

  async function handleFiles(files: FileList | File[]) {
    setError("");
    const arr = Array.from(files);
    const remaining = MAX_IMAGES - totalCount;
    const toUpload = arr.slice(0, remaining);

    if (arr.length > remaining) {
      setError(`최대 ${MAX_IMAGES}장까지 첨부할 수 있어요.`);
    }

    for (const file of toUpload) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("JPG, PNG, WebP, GIF만 업로드할 수 있어요.");
        continue;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("파일 크기는 5MB 이하여야 해요.");
        continue;
      }

      const tempId = crypto.randomUUID();
      const preview = URL.createObjectURL(file);
      setUploading((prev) => [...prev, { id: tempId, preview, progress: "uploading" }]);

      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const supabase = createClient();
      const { data, error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(path, file, { upsert: false });

      if (uploadError || !data) {
        setUploading((prev) => prev.map((u) => u.id === tempId ? { ...u, progress: "error" } : u));
        setError("업로드 중 오류가 발생했어요. 다시 시도해주세요.");
        setTimeout(() => setUploading((prev) => prev.filter((u) => u.id !== tempId)), 2000);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage.from("post-images").getPublicUrl(data.path);
      setUploading((prev) => prev.filter((u) => u.id !== tempId));
      URL.revokeObjectURL(preview);
      onChange([...value, publicUrl]);
    }
  }

  function removeUploaded(url: string) {
    onChange(value.filter((u) => u !== url));
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    if (!canAdd) return;
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div className="space-y-2">
      {/* Grid: uploaded + uploading + add button */}
      {(value.length > 0 || uploading.length > 0 || true) && (
        <div className={cn(
          "grid gap-2",
          totalCount === 1 ? "grid-cols-1" : "grid-cols-2"
        )}>
          {/* Uploaded images */}
          {value.map((url) => (
            <div key={url} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
              <Image
                src={url}
                alt="첨부 이미지"
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => removeUploaded(url)}
                disabled={disabled}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          ))}

          {/* Uploading placeholders */}
          {uploading.map((item) => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={item.preview} alt="업로드 중" fill className="object-cover opacity-50" unoptimized />
              <div className="absolute inset-0 flex items-center justify-center">
                {item.progress === "uploading"
                  ? <Loader2 className="w-6 h-6 text-white animate-spin drop-shadow" />
                  : <X className="w-6 h-6 text-red-400" />
                }
              </div>
            </div>
          ))}

          {/* Add button */}
          {canAdd && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDrop={onDrop}
              onDragOver={(e) => e.preventDefault()}
              className={cn(
                "aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-[#FF5C5C] hover:bg-[#FFF0F0] transition-colors flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#FF5C5C]",
                value.length === 0 && uploading.length === 0 && "col-span-2 aspect-[3/1]"
              )}
            >
              <ImagePlus className="w-5 h-5" />
              <span className="text-xs font-medium">
                {value.length === 0 && uploading.length === 0
                  ? `사진 추가 (최대 ${MAX_IMAGES}장)`
                  : `${totalCount}/${MAX_IMAGES}`}
              </span>
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
}
