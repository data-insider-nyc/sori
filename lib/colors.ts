/**
 * Color tokens for regions and post categories.
 * Colors live here in code — NOT in the database.
 * To change a color, edit this file only.
 */

// ── Region badge colors ────────────────────────────────────────────────────────
// Used in PostCard badge and CommunityListing active tab.
export const REGION_COLORS: Record<string, { bg: string; text: string }> = {
  nyc:     { bg: "bg-violet-100",  text: "text-violet-700"  },
  la:      { bg: "bg-amber-100",   text: "text-amber-800"   },
  sf:      { bg: "bg-blue-100",    text: "text-blue-700"    },
  chicago: { bg: "bg-red-100",     text: "text-red-700"     },
  boston:  { bg: "bg-green-100",   text: "text-green-700"   },
  atlanta: { bg: "bg-yellow-100",  text: "text-yellow-800"  },
  dallas:  { bg: "bg-teal-100",    text: "text-teal-700"    },
  dc:      { bg: "bg-indigo-100",  text: "text-indigo-700"  },
  austin:  { bg: "bg-pink-100",    text: "text-pink-700"    },
  houston: { bg: "bg-sky-100",     text: "text-sky-700"     },
  seattle: { bg: "bg-emerald-100", text: "text-emerald-700" },
  other:   { bg: "bg-gray-100",    text: "text-gray-600"    },
};

export function getRegionColor(value: string): { bg: string; text: string } {
  return REGION_COLORS[value] ?? { bg: "bg-gray-100", text: "text-gray-600" };
}

// ── Post category badge colors ─────────────────────────────────────────────────
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  general:     { bg: "bg-gray-100",   text: "text-gray-600"   },
  restaurant:  { bg: "bg-orange-100", text: "text-orange-700" },
  hospital:    { bg: "bg-rose-100",   text: "text-rose-700"   },
  jobs:        { bg: "bg-blue-100",   text: "text-blue-700"   },
  realestate:  { bg: "bg-green-100",  text: "text-green-700"  },
  kids:        { bg: "bg-purple-100", text: "text-purple-700" },
  classifieds: { bg: "bg-amber-100",  text: "text-amber-800"  },
  visa:        { bg: "bg-sky-100",    text: "text-sky-700"    },
};

export function getCategoryColor(value: string): { bg: string; text: string } {
  return CATEGORY_COLORS[value] ?? { bg: "bg-gray-100", text: "text-gray-600" };
}
