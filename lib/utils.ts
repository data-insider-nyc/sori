import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RECENCY_LABEL_BUCKETS } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "방금 전";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`;
  return `${Math.floor(seconds / 86400)}일 전`;
}

export function recencyLabel(date: string | Date): string {
  const ageMs = Math.max(0, Date.now() - new Date(date).getTime());
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  return (
    RECENCY_LABEL_BUCKETS.find((bucket) => ageDays <= bucket.maxAgeDays)?.label ??
    RECENCY_LABEL_BUCKETS[RECENCY_LABEL_BUCKETS.length - 1].label
  );
}

export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10)
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return phone;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";

  const isKorean = /[가-힣ㄱ-ㅎㅏ-ㅣ]/.test(name);

  if (isKorean) {
    // Single word: up to 3 chars ("홍길동" → "홍길동")
    if (parts.length === 1) return parts[0].substring(0, 3);
    // Multi-word: first char of each word, up to 3 ("용감한 빠른 호랑이" → "용빠호")
    return parts.slice(0, 3).map(p => p[0]).join("");
  }

  // English: standard initials ("Karl Kwon" → "KK")
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "bg-red-100 text-red-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-purple-100 text-purple-700",
  "bg-amber-100 text-amber-700",
  "bg-teal-100 text-teal-700",
];

export function avatarColor(name: string): string {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

// Vivid version for large profile avatars — white text on saturated background
const VIVID_AVATAR_COLORS = [
  "bg-[#FF5C5C] text-white",    // coral
  "bg-blue-500 text-white",
  "bg-emerald-500 text-white",
  "bg-violet-500 text-white",
  "bg-orange-500 text-white",
  "bg-pink-500 text-white",
];

export function avatarColorVivid(name: string): string {
  return VIVID_AVATAR_COLORS[name.charCodeAt(0) % VIVID_AVATAR_COLORS.length];
}

// Text-only colors for avatars — use inline style to avoid Tailwind purge
const AVATAR_TEXT_COLORS = [
  "#E03E3E",  // coral-dark
  "#2563EB",  // blue-600
  "#059669",  // emerald-600
  "#7C3AED",  // violet-600
  "#F97316",  // orange-500
  "#DB2777",  // pink-600
];

export function avatarTextColor(name: string): string {
  return AVATAR_TEXT_COLORS[name.charCodeAt(0) % AVATAR_TEXT_COLORS.length];
}


// Soft pastel bg + matching text — matches reference design (av1–av6)
const AVATAR_PALETTES = [
  { background: "#FFF0EE", color: "#E8321C" }, // coral/red
  { background: "#EEF2FF", color: "#4F46E5" }, // indigo
  { background: "#EDFDF5", color: "#059669" }, // green
  { background: "#FDF2F8", color: "#DB2777" }, // pink
  { background: "#FFF8EE", color: "#D97706" }, // amber
  { background: "#EFF6FF", color: "#2563EB" }, // blue
];

export function avatarPalette(name: string): { background: string; color: string } {
  const hash = [...name].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
}
