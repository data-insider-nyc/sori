import { REGIONS } from "@/lib/regions";

export interface DirectoryCity {
  value: string;
  label: string;
  region: string;
}

export const DIRECTORY_CITIES: DirectoryCity[] = [
  // ─── NYC Metro ──────────────────────────────────────────
  { value: "Fort Lee", label: "포트리 (Fort Lee, NJ)", region: "nyc" },
  {
    value: "Palisades Park",
    label: "팰리세이즈 파크 (Palisades Park, NJ)",
    region: "nyc",
  },
  { value: "Englewood", label: "잉글우드 (Englewood, NJ)", region: "nyc" },
  { value: "Flushing", label: "플러싱 (Flushing, NY)", region: "nyc" },
  { value: "Manhattan", label: "맨해튼 (Manhattan, NY)", region: "nyc" },

  // ─── Los Angeles ────────────────────────────────────────
  { value: "Koreatown LA", label: "한인타운 (Koreatown, LA)", region: "la" },
  { value: "Glendale", label: "글렌데일 (Glendale, CA)", region: "la" },
  { value: "Torrance", label: "토렌스 (Torrance, CA)", region: "la" },
  {
    value: "Garden Grove",
    label: "가든 그로브 (Garden Grove, CA)",
    region: "la",
  },
  { value: "Irvine", label: "어바인 (Irvine, CA)", region: "la" },

  // ─── Bay Area ───────────────────────────────────────────
  { value: "San Jose", label: "산호세 (San Jose, CA)", region: "sf" },
  { value: "Fremont", label: "프레몬트 (Fremont, CA)", region: "sf" },
  { value: "Sunnyvale", label: "선니베일 (Sunnyvale, CA)", region: "sf" },
  { value: "Cupertino", label: "쿠퍼티노 (Cupertino, CA)", region: "sf" },
  {
    value: "San Francisco",
    label: "샌프란시스코 (San Francisco, CA)",
    region: "sf",
  },

  // ─── Chicago ─────────────────────────────────────────────
  {
    value: "Chicago Koreatown",
    label: "시카고 한인타운 (Chicago Koreatown, IL)",
    region: "chicago",
  },
  {
    value: "Schaumburg",
    label: "샤움버그 (Schaumburg, IL)",
    region: "chicago",
  },
  {
    value: "Naperville",
    label: "네이퍼빌 (Naperville, IL)",
    region: "chicago",
  },
  { value: "Skokie", label: "스코키 (Skokie, IL)", region: "chicago" },

  // ─── Washington DC ──────────────────────────────────────
  { value: "Arlington", label: "알링턴 (Arlington, VA)", region: "dc" },
  { value: "Annandale", label: "애넌데일 (Annandale, VA)", region: "dc" },
  { value: "Alexandria", label: "알렉산드리아 (Alexandria, VA)", region: "dc" },
  { value: "Bethesda", label: "베세스다 (Bethesda, MD)", region: "dc" },

  // ─── Seattle ────────────────────────────────────────────
  {
    value: "Seattle International District",
    label: "국제 지구 (International District, WA)",
    region: "seattle",
  },
  { value: "Bellevue", label: "벨뷰 (Bellevue, WA)", region: "seattle" },
  { value: "Redmond", label: "레드먼드 (Redmond, WA)", region: "seattle" },
  { value: "Shoreline", label: "쇼어라인 (Shoreline, WA)", region: "seattle" },

  // ─── Boston ─────────────────────────────────────────────
  {
    value: "Boston Chinatown",
    label: "보스턴 중국타운 (Boston, MA)",
    region: "boston",
  },
  { value: "Quincy", label: "퀸시 (Quincy, MA)", region: "boston" },
  { value: "Cambridge", label: "캠브리지 (Cambridge, MA)", region: "boston" },
  { value: "Waltham", label: "월섬 (Waltham, MA)", region: "boston" },

  // ─── Atlanta ────────────────────────────────────────────
  { value: "Duluth", label: "덜루스 (Duluth, GA)", region: "atlanta" },
  {
    value: "Alpharetta",
    label: "알파레타 (Alpharetta, GA)",
    region: "atlanta",
  },
  {
    value: "Johns Creek",
    label: "존스 크릭 (Johns Creek, GA)",
    region: "atlanta",
  },
  { value: "Marietta", label: "마리에타 (Marietta, GA)", region: "atlanta" },

  // ─── Dallas-Fort Worth ──────────────────────────────────
  { value: "Irving", label: "어빙 (Irving, TX)", region: "dallas" },
  { value: "Plano", label: "플래노 (Plano, TX)", region: "dallas" },
  { value: "Coppell", label: "코펠 (Coppell, TX)", region: "dallas" },
  { value: "Carrollton", label: "캐롤턴 (Carrollton, TX)", region: "dallas" },
];

export const DIRECTORY_REGION_OPTIONS = [
  { value: "all", label: "전체 지역" },
  ...REGIONS,
] as const;

const CITIES_BY_REGION = DIRECTORY_CITIES.reduce<
  Record<string, DirectoryCity[]>
>((acc, city) => {
  if (!acc[city.region]) acc[city.region] = [];
  acc[city.region].push(city);
  return acc;
}, {});

const CITY_TO_REGION = DIRECTORY_CITIES.reduce<Record<string, string>>(
  (acc, city) => {
    acc[city.value] = city.region;
    return acc;
  },
  {},
);

export function getDirectoryCitiesByRegion(region: string): DirectoryCity[] {
  if (!region || region === "all") return DIRECTORY_CITIES;
  return CITIES_BY_REGION[region] ?? [];
}

export function getDirectoryCityValuesByRegion(region: string): string[] {
  return getDirectoryCitiesByRegion(region).map((city) => city.value);
}

export function getRegionForCity(city: string): string | null {
  return CITY_TO_REGION[city] ?? null;
}

export function inferRegionFromCities(cities: string[]): string {
  if (cities.length === 0) return "all";
  const regions = new Set(
    cities
      .map((city) => getRegionForCity(city))
      .filter((region): region is string => Boolean(region)),
  );
  if (regions.size !== 1) return "all";
  return regions.values().next().value ?? "all";
}
