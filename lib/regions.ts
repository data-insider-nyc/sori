import {
  Building2,
  Sun,
  Waves,
  Wind,
  GraduationCap,
  Leaf,
  Star,
  Landmark,
  CloudRain,
  Globe,
  type LucideIcon,
} from "lucide-react";

export interface Region {
  value: string;
  label: string;
}

export const REGION_ICONS: Record<string, LucideIcon> = {
  nyc:     Building2,
  la:      Sun,
  sf:      Waves,
  chicago: Wind,
  boston:  GraduationCap,
  atlanta: Leaf,
  dallas:  Star,
  dc:      Landmark,
  seattle: CloudRain,
  other:   Globe,
};

export function getRegionIcon(value: string): LucideIcon {
  return REGION_ICONS[value] ?? Globe;
}

export const REGIONS: Region[] = [
  { value: "nyc",     label: "NYC Metro"    },
  { value: "la",      label: "Los Angeles"  },
  { value: "sf",      label: "Bay Area"     },
  { value: "chicago", label: "Chicago"      },
  { value: "dc",      label: "Washington DC"},
  { value: "seattle", label: "Seattle"      },
  { value: "boston",  label: "Boston"       },
  { value: "atlanta", label: "Atlanta"      },
  { value: "dallas",  label: "DFW"          },
  { value: "other",   label: "Others"       },
];

export function getRegionLabel(value: string): string {
  return REGIONS.find((r) => r.value === value)?.label ?? value;
}

export type MetroArea = Region["value"];
