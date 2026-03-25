import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length === 10)
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
  return phone;
}

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  // For generated nicknames (3-part: 형용사고 형용사한 엔티티), show the entity (last word)
  if (parts.length >= 2) return parts[parts.length - 1];
  // For custom nicknames, show first 2 chars
  return name.substring(0, 2).toUpperCase();
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


const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #FF5C5C 0%, #FF8C42 100%)",  // coral → orange
  "linear-gradient(135deg, #4F46E5 0%, #818CF8 100%)",  // indigo → lavender
  "linear-gradient(135deg, #059669 0%, #34D399 100%)",  // emerald
  "linear-gradient(135deg, #DB2777 0%, #F472B6 100%)",  // pink
  "linear-gradient(135deg, #2563EB 0%, #60A5FA 100%)",  // blue
  "linear-gradient(135deg, #D97706 0%, #FCD34D 100%)",  // amber
];

export function avatarGradient(name: string): string {
  return AVATAR_GRADIENTS[name.charCodeAt(0) % AVATAR_GRADIENTS.length];
}
