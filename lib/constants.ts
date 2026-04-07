import type { Category } from "@/types";

// ─── Business directory categories ───────────────────────────────────────────

export const CATEGORIES: Record<Category, { label: string; emoji: string }> = {
  hospital: { label: "병원·치과", emoji: "🏥" },
  lawyer: { label: "변호사", emoji: "⚖️" },
  accountant: { label: "회계사", emoji: "🧾" },
  restaurant: { label: "식당·카페", emoji: "🍜" },
  beauty: { label: "뷰티·미용", emoji: "✂️" },
  realestate: { label: "부동산", emoji: "🏠" },
  education: { label: "학원·교육", emoji: "📚" },
  jobs: { label: "채용·구인", emoji: "💼" },
  other: { label: "기타", emoji: "📌" },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(
  ([value, meta]) => ({ value: value as Category, ...meta }),
);

// ─── Community post categories ───────────────────────────────────────────────
// Managed in the `post_categories` Supabase table (see lib/post-categories.ts).

// Categories whose posts are inherently local (default to user's region).
// All other categories default to null (= nationwide).
export const LOCAL_CATEGORIES = new Set<string>([
  "general",
  "housing",
  "health",
  "family",
  "market",
  "local",
]);

// ─── Hyperlocal target cities (business directory only) ──────────────────────
export const TARGET_CITIES = [
  { value: "", label: "All Cities" },
  // ── 뉴저지 ─────────────────────────────────────
  { value: "Fort Lee", label: "Fort Lee, NJ" },
  { value: "Palisades Park", label: "Palisades Park, NJ" },
  { value: "Leonia", label: "Leonia, NJ" },
  { value: "Englewood", label: "Englewood, NJ" },
  // ── 뉴욕 퀸즈 ──────────────────────────────────
  { value: "Flushing", label: "Flushing, NY" },
  { value: "Bayside", label: "Bayside, NY" },
  { value: "Fresh Meadows", label: "Fresh Meadows, NY" },
  // ── 뉴욕 맨해튼 ────────────────────────────────
  { value: "Manhattan", label: "Manhattan, NY" },
] as const;

