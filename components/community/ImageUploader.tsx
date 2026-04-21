"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { cn } from "@/lib/utils";

export const MAX_IMAGES = 8;
// Allow large camera originals; we compress before upload.
const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB (before compression)
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_DIMENSION = 1920;
const COMPRESS_QUALITY = 0.82;

/** Resize + compress image via canvas. */
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height / width) * MAX_DIMENSION);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_DIMENSION);
          height = MAX_DIMENSION;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas error"));
      ctx.drawImage(img, 0, 0, width, height);
      // Prefer WebP for size, fall back to JPEG if unsupported.
      canvas.toBlob((webp) => {
        if (webp) return resolve(webp);
        canvas.toBlob(
          (jpeg) =>
            jpeg ? resolve(jpeg) : reject(new Error("compression failed")),
          "image/jpeg",
          COMPRESS_QUALITY,
        );
      }, "image/webp", COMPRESS_QUALITY);
    };
    img.onerror = reject;
    img.src = url;
  });
}

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

    // Create temp preview items for all files at once
    const tempItems: UploadingItem[] = toUpload.map((file) => ({
      id: crypto.randomUUID(),
      preview: URL.createObjectURL(file),
      progress: "uploading" as const,
    }));
    setUploading((prev) => [...prev, ...tempItems]);

    // Upload all in parallel
    const supabase = createClient();
    const results = await Promise.all(
      toUpload.map(async (file, idx) => {
        const tempId = tempItems[idx].id;
        const preview = tempItems[idx].preview;

        if (!ALLOWED_TYPES.includes(file.type)) {
          setError("JPG, PNG, WebP만 업로드할 수 있어요.");
          setUploading((prev) => prev.filter((u) => u.id !== tempId));
          URL.revokeObjectURL(preview);
          return null;
        }
        if (file.size > MAX_SIZE_BYTES) {
          setError("파일 크기가 너무 커요. (최대 15MB)");
          setUploading((prev) => prev.filter((u) => u.id !== tempId));
          URL.revokeObjectURL(preview);
          return null;
        }

        const path = `${userId}/${crypto.randomUUID()}`;

        // Compress before upload (resize + WebP/JPEG encode).
        let blob: Blob;
        try {
          blob = await compressImage(file);
        } catch {
          blob = file;
        }

        // Keep extension aligned with content type (helps debugging + CDN caching).
        const ext = blob.type === "image/webp" ? "webp" : "jpg";
        const objectName = `${path}.${ext}`;

        const { data, error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(objectName, blob, { upsert: false, contentType: blob.type });

        setUploading((prev) => prev.filter((u) => u.id !== tempId));
        URL.revokeObjectURL(preview);

        if (uploadError || !data) {
          setError("업로드 중 오류가 발생했어요. 다시 시도해주세요.");
          return null;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("post-images").getPublicUrl(data.path);
        return publicUrl;
      })
    );

    const newUrls = results.filter((u): u is string => u !== null);
    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
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
