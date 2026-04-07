import {
  MessageCircle,
  UtensilsCrossed,
  MapPin,
  Briefcase,
  Building2,
  Baby,
  ShoppingBag,
  Plane,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";

export interface PostCategoryItem {
  value: string;
  label: string;
  icon: LucideIcon;
  color?: string;
}

export const DEFAULT_CATEGORY = "general";

export const CATEGORIES: PostCategoryItem[] = [
  { value: "general", label: "자유", icon: MessageCircle },
  { value: "food", label: "맛집", icon: UtensilsCrossed },
  { value: "local", label: "생활", icon: MapPin },
  { value: "jobs", label: "커리어", icon: Briefcase },
  { value: "housing", label: "부동산", icon: Building2, color: "#7C3AED" },
  { value: "family", label: "육아", icon: Baby },
  { value: "market", label: "중고", icon: ShoppingBag },
  { value: "immigration", label: "비자", icon: Plane },
  { value: "health", label: "병원", icon: Stethoscope },
];

export function getCategoryIcon(value: string): LucideIcon {
  return CATEGORIES.find((c) => c.value === value)?.icon ?? MessageCircle;
}

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}
