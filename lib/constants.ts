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
// To add or remove a category, edit this array only.
// PostCategory type is derived automatically — no other file needs to change.

export const COMMUNITY_CATEGORIES = [
  { value: "general", label: "자유게시판", emoji: "💬" },
  { value: "hospital", label: "병원·의료", emoji: "🏥" },
  { value: "jobs", label: "취업·커리어", emoji: "💼" },
  { value: "realestate", label: "부동산·이사", emoji: "🏠" },
  { value: "kids", label: "육아·교육", emoji: "👶" },
  { value: "classifieds", label: "중고거래", emoji: "🛍️" },
  { value: "visa", label: "비자·이민", emoji: "✈️" },
] as const;

export type PostCategory = (typeof COMMUNITY_CATEGORIES)[number]["value"];

export const DEFAULT_CATEGORY: PostCategory = "general";

export function getCategoryLabel(value: string): string {
  return COMMUNITY_CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryEmoji(value: string): string {
  return COMMUNITY_CATEGORIES.find((c) => c.value === value)?.emoji ?? "💬";
}

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

// ─── Regions are now managed in Supabase (see lib/regions.ts)
// Import from lib/regions instead of here
// This allows admin to manage regions in DB without code deployment.
// region = null on a post means "nationwide / all communities".

// Categories whose posts are inherently local (default to user's region).
// All other categories default to null (= nationwide).
export const LOCAL_CATEGORIES = new Set<PostCategory>([
  "general",
  "realestate",
  "hospital",
  "kids",
  "classifieds",
]);
