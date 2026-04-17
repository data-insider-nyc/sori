/**
 * lib/copy.ts
 * Single source of truth for all site branding & copy strings.
 * Change here → changes everywhere.
 */

export const SITE = {
  name: "소리 Sori",
  shortName: "소리",
  url: "https://oursori.com",
  email: "hello@oursori.com",
  copyright: "© 2026 소리 Sori. All rights reserved.",
} as const;

/** One-liner taglines used in headers, hero badges, meta tags */
export const TAGLINE = {
  /** Short badge text — shown in hero chip */
  badge: "미국 한인 커뮤니티",
  /** Full tagline for meta titles */
  full: "미국 한인 커뮤니티 & 비즈니스",
  /** Directory-specific tagline */
  directory: "미국 한인 비즈니스 디렉토리",
  /** Community-specific tagline */
  community: "미국 한인 생활 정보 커뮤니티",
} as const;

/** Page-level metadata (title + description) */
export const PAGE_META = {
  home: {
    title: `${SITE.name} — ${TAGLINE.full} 디렉토리`,
    description:
      "미국 한인들의 커뮤니티. 한인 병원·변호사·회계사·식당·부동산·학원 찾기, 이민 생활 정보 공유.",
    ogTitle: `${SITE.name} — ${TAGLINE.full}`,
    ogDescription: "미국 한인들의 커뮤니티 & 비즈니스 디렉토리",
  },
  directory: {
    title: "한인 비즈니스 디렉토리",
    description:
      "미국 한인 병원·치과·변호사·회계사·식당·뷰티·부동산·학원 찾기. 미국 지역 한인 비즈니스 디렉토리.",
    ogTitle: `${SITE.name} — ${TAGLINE.directory}`,
    ogDescription: "미국 한인 비즈니스 검색 & 리뷰",
  },
  community: {
    title: "커뮤니티",
    description:
      "미국 한인들의 이야기. 병원 추천, 부동산, 육아, 비자·이민, 취업 정보를 함께 나눠요.",
    ogTitle: `소리 커뮤니티 — ${TAGLINE.community}`,
    ogDescription: "미국 한인들의 실시간 커뮤니티 피드",
  },
} as const;

/** Hero section copy */
export const HERO_COPY = {
  badge: TAGLINE.badge,
  headline: ["우리의 이야기,", "우리의"],
  headlineBrand: "소리",
  sub: "미국 한인들이 만들어가는 커뮤니티 — 어디서든, 누구든",
} as const;

/** Layout-level metadata (used in app/layout.tsx) */
export const LAYOUT_META = {
  defaultTitle: `${SITE.name} — ${TAGLINE.full}`,
  titleTemplate: `%s | ${SITE.name}`,
  description:
    "미국 한인 커뮤니티. 미국 한인 병원·변호사·회계사·식당·부동산 찾기 & 생활 정보 공유.",
  keywords: [
    "한인 커뮤니티",
    "미국 한인",
    "한인 병원",
    "한인 변호사",
    "한인 회계사",
    "포트리 한인",
    "팰리세이즈파크 한인",
    "플러싱 한인",
    "한인 비즈니스",
    "Korean American",
    "Fort Lee Korean",
    "Palisades Park Korean",
    "Flushing Korean",
    "Korean community New York New Jersey",
  ],
  ogTitle: `${SITE.name} — ${TAGLINE.full}`,
  ogDescription:
    "미국 한인들의 커뮤니티. 한인 병원·변호사·회계사·식당 찾기 & 생활 정보.",
  twitterTitle: `${SITE.name} — ${TAGLINE.full}`,
  twitterDescription: "미국 한인들의 커뮤니티 & 비즈니스 디렉토리",
} as const;

/** JSON-LD structured data strings */
export const JSON_LD = {
  websiteName: SITE.name,
  websiteDescription: TAGLINE.directory,
  orgName: SITE.name,
  orgDescription: `${TAGLINE.full} 플랫폼`,
  areaServed: [
    "Fort Lee, NJ",
    "Palisades Park, NJ",
    "Flushing, NY",
    "Manhattan, NY",
  ],
} as const;
