import type { Category, PostCategory } from "@/types";

export const CATEGORIES: Record<Category, { label: string; emoji: string }> = {
  hospital:   { label: "병원·치과",  emoji: "🏥" },
  lawyer:     { label: "변호사",     emoji: "⚖️" },
  accountant: { label: "회계사",     emoji: "🧾" },
  restaurant: { label: "식당·카페",  emoji: "🍜" },
  beauty:     { label: "뷰티·미용",  emoji: "✂️" },
  realestate: { label: "부동산",     emoji: "🏠" },
  education:  { label: "학원·교육",  emoji: "📚" },
  jobs:       { label: "채용·구인",  emoji: "💼" },
  other:      { label: "기타",       emoji: "📌" },
};

export const CATEGORY_LIST = Object.entries(CATEGORIES).map(
  ([value, meta]) => ({ value: value as Category, ...meta })
);

export const POST_CATEGORIES: Record<PostCategory, string> = {
  all:         "전체",
  hospital:    "병원추천",
  jobs:        "취업·이민",
  realestate:  "부동산",
  kids:        "육아·교육",
  classifieds: "중고거래",
  visa:        "비자·이민",
  general:     "자유게시판",
};

// ─── Hyperlocal target cities (English only, no Edgewater)
export const TARGET_CITIES = [
  { value: "",                label: "All Cities" },
  { value: "Fort Lee",        label: "Fort Lee, NJ" },
  { value: "Palisades Park",  label: "Palisades Park, NJ" },
  { value: "Flushing",        label: "Flushing, NY" },
  { value: "Manhattan",       label: "Manhattan, NY" },
] as const;

// ─── Google Places API search centers (5km radius)
export const SCRAPER_CENTERS = [
  { name: "Fort Lee, NJ",       lat: 40.8504, lng: -73.9710 },
  { name: "Palisades Park, NJ", lat: 40.8468, lng: -73.9932 },
  { name: "Flushing, NY",       lat: 40.7675, lng: -73.8330 },
  { name: "Manhattan, NY",      lat: 40.7580, lng: -73.9855 },
] as const;
