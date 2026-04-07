import { createClient as createBrowserClient } from "@/lib/supabase-browser";

export interface PostCategoryItem {
  id: number;
  value: string;
  label: string;
  emoji: string;
  sort_order: number;
}

export const DEFAULT_CATEGORY = "general";

export function getCategoryLabel(value: string, categories?: PostCategoryItem[]): string {
  const list = categories ?? FALLBACK_CATEGORIES;
  return list.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryEmoji(value: string, categories?: PostCategoryItem[]): string {
  const list = categories ?? FALLBACK_CATEGORIES;
  return list.find((c) => c.value === value)?.emoji ?? "💬";
}

let cache: PostCategoryItem[] | null = null;
let cacheTime = 0;
const TTL = 5 * 60 * 1000;

export async function getPostCategories(): Promise<PostCategoryItem[]> {
  if (cache && Date.now() - cacheTime < TTL) return cache;

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("post_categories")
    .select("id, value, label, emoji, sort_order")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to fetch post_categories:", error);
    return FALLBACK_CATEGORIES;
  }

  cache = data as PostCategoryItem[];
  cacheTime = Date.now();
  return cache;
}

// Fallback while DB loads (mirrors current DB data)
export const FALLBACK_CATEGORIES: PostCategoryItem[] = [
  { id: 1,  value: "general",     label: "자유",   emoji: "💬", sort_order: 1 },
  { id: 2,  value: "food",        label: "맛집",   emoji: "🍜", sort_order: 2 },
  { id: 3,  value: "local",       label: "생활",   emoji: "📍", sort_order: 3 },
  { id: 4,  value: "jobs",        label: "커리어", emoji: "💼", sort_order: 4 },
  { id: 5,  value: "housing",     label: "부동산", emoji: "🏠", sort_order: 5 },
  { id: 6,  value: "family",      label: "육아",   emoji: "👶", sort_order: 6 },
  { id: 7,  value: "market",      label: "중고",   emoji: "🛍️", sort_order: 7 },
  { id: 8,  value: "immigration", label: "비자",   emoji: "✈️", sort_order: 8 },
  { id: 9,  value: "health",      label: "병원",   emoji: "🏥", sort_order: 9 },
];

