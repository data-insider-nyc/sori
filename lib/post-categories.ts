import { createClient as createBrowserClient } from "@/lib/supabase-browser";

export interface PostCategory {
  id: number;
  value: string;
  label: string;
  emoji: string;
  sort_order: number;
}

let cache: PostCategory[] | null = null;
let cacheTime = 0;
const TTL = 5 * 60 * 1000;

export async function getPostCategories(): Promise<PostCategory[]> {
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

  cache = data as PostCategory[];
  cacheTime = Date.now();
  return cache;
}

// Fallback while DB loads (matches migration seed data exactly)
export const FALLBACK_CATEGORIES: PostCategory[] = [
  { id: 1, value: "general",     label: "자유게시판",  emoji: "💬", sort_order: 1 },
  { id: 2, value: "restaurant",  label: "식당·카페",   emoji: "🍜", sort_order: 2 },
  { id: 3, value: "hospital",    label: "병원·의료",   emoji: "🏥", sort_order: 3 },
  { id: 4, value: "jobs",        label: "취업·커리어", emoji: "💼", sort_order: 4 },
  { id: 5, value: "realestate",  label: "부동산·이사", emoji: "🏠", sort_order: 5 },
  { id: 6, value: "kids",        label: "육아·교육",   emoji: "👶", sort_order: 6 },
  { id: 7, value: "classifieds", label: "중고거래",    emoji: "🛍️", sort_order: 7 },
  { id: 8, value: "visa",        label: "비자·이민",   emoji: "✈️", sort_order: 8 },
];

