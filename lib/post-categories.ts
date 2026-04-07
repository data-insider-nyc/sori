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
}

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  general:     MessageCircle,
  food:        UtensilsCrossed,
  local:       MapPin,
  jobs:        Briefcase,
  housing:     Building2,
  family:      Baby,
  market:      ShoppingBag,
  immigration: Plane,
  health:      Stethoscope,
};

export function getCategoryIcon(value: string): LucideIcon {
  return CATEGORY_ICONS[value] ?? MessageCircle;
}

export const DEFAULT_CATEGORY = "general";

export const CATEGORIES: PostCategoryItem[] = [
  { value: "general",     label: "자유"   },
  { value: "food",        label: "맛집"   },
  { value: "local",       label: "생활"   },
  { value: "jobs",        label: "커리어" },
  { value: "housing",     label: "부동산" },
  { value: "family",      label: "육아"   },
  { value: "market",      label: "중고"   },
  { value: "immigration", label: "비자"   },
  { value: "health",      label: "병원"   },
];

export function getCategoryLabel(value: string): string {
  return CATEGORIES.find((c) => c.value === value)?.label ?? value;
}

