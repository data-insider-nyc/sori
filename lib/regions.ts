import { createClient as createBrowserClient } from "@/lib/supabase-browser";

export interface Region {
  id: number;
  value: string;
  label: string;
  emoji: string;
  status: "open" | "soon" | "hidden";
  sort_order: number;
  created_at?: string;
  updated_at?: string;
}

// In-memory cache for regions
let regionsCache: Region[] | null = null;
let cacheTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function getRegions(): Promise<Region[]> {
  // Check cache freshness
  if (regionsCache && Date.now() - cacheTime < CACHE_TTL) {
    return regionsCache;
  }

  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) {
    console.error("Failed to fetch regions:", error);
    return [];
  }

  regionsCache = data as Region[];
  cacheTime = Date.now();
  return data as Region[];
}

export async function getRegionLabel(idOrValue: number | string): Promise<string> {
  const regions = await getRegions();
  if (typeof idOrValue === "number") {
    return regions.find((r) => r.id === idOrValue)?.label ?? "";
  }
  return regions.find((r) => r.value === idOrValue)?.label ?? idOrValue;
}

export async function getRegionEmoji(idOrValue: number | string): Promise<string> {
  const regions = await getRegions();
  if (typeof idOrValue === "number") {
    return regions.find((r) => r.id === idOrValue)?.emoji ?? "🌍";
  }
  return regions.find((r) => r.value === idOrValue)?.emoji ?? "🌍";
}

export type MetroArea = Region["value"];
