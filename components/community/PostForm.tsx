"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Globe } from "lucide-react";
import { REGIONS, getRegionIcon } from "@/lib/regions";
import { CATEGORIES, DEFAULT_CATEGORY, getCategoryIcon } from "@/lib/post-categories";
import { ImageUploader } from "@/components/community/ImageUploader";

export interface PostFormValues {
  title: string;
  content: string;
  category: string;
  region: string | null;
  images: string[];
}

interface Props {
  /** Initial values — for edit mode pass the post's existing values */
  initialValues?: Partial<PostFormValues>;
  onSubmit: (values: PostFormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  /** When true the textarea gets fewer rows (suited for a modal) */
  compact?: boolean;
  error?: string;
  /** Required for image upload — current user's id */
  userId?: string;
}

const TITLE_MAX = 50;
const CONTENT_MAX = 2000;

export function PostForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "게시하기",
  compact = false,
  error: externalError,
  userId,
}: Props) {
  const [category, setCategory] = useState<string>(
    initialValues?.category ?? DEFAULT_CATEGORY,
  );
  const [region, setRegion] = useState<string | null>(
    initialValues?.region ?? null,
  );
  const regions = REGIONS;
  const categories = CATEGORIES;
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [images, setImages] = useState<string[]>(initialValues?.images ?? []);
  const [saving, setSaving] = useState(false);
  const [internalError, setInternalError] = useState("");

  const error = externalError || internalError;
  const titleLeft = TITLE_MAX - title.length;
  const contentLeft = CONTENT_MAX - content.length;
  const canSubmit = content.trim().length > 0 && !saving;

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    setInternalError("");
    setSaving(true);
    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
        category,
        region,
        images,
      });
    } catch (err: any) {
      setInternalError(err.message || "저장에 실패했습니다.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Region */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">지역</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setRegion(null)}
            className={cn("chip inline-flex items-center gap-1", region === null && "chip-active")}
          >
            <Globe className="w-3.5 h-3.5" strokeWidth={2} />
            전체 지역
          </button>
          {regions.map((r) => {
            const RIcon = getRegionIcon(r.value);
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => setRegion(r.value)}
                className={cn("chip inline-flex items-center gap-1", region === r.value && "chip-active")}
              >
                <RIcon className="w-3.5 h-3.5" strokeWidth={2} />
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Category */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">카테고리</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
              const CatIcon = getCategoryIcon(cat.value);
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={cn("chip inline-flex items-center gap-1", category === cat.value && "chip-active")}
                >
                  <CatIcon className="w-3 h-3" strokeWidth={2} />
                  {cat.label}
                </button>
              );
            })}
        </div>
      </div>

      <div className="border-t border-gray-100" />

      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-gray-700">제목</label>
          <span
            className={cn(
              "text-xs",
              titleLeft < 10 ? "text-red-400" : "text-gray-400",
            )}
          >
            {titleLeft}자 남음
          </span>
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
          placeholder="제목을 입력해주세요 (선택)"
          className="input-field"
        />
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-gray-700">내용</label>
          <span
            className={cn(
              "text-xs",
              contentLeft < 100 ? "text-red-400" : "text-gray-400",
            )}
          >
            {contentLeft}자 남음
          </span>
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value.slice(0, CONTENT_MAX))}
          placeholder="내용을 입력해주세요"
          rows={compact ? 6 : 8}
          className="input-field resize-none"
          required
        />
      </div>

      {/* Images */}
      {userId && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">사진</p>
          <ImageUploader
            userId={userId}
            value={images}
            onChange={setImages}
            disabled={saving}
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className={cn("flex gap-2", onCancel ? "justify-end" : "")}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="btn-outline text-sm"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          disabled={!canSubmit}
          className={cn(
            "btn-coral flex items-center justify-center gap-2",
            !onCancel && "w-full",
            "text-sm",
          )}
        >
          {saving && (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          {saving ? "저장 중..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
