"""
Sori — Google Places API 데이터 수집 스크립트

사용법:
  cd sori-next16/scripts
  source .venv/bin/activate
  pip install -r scraper/requirements.txt
  cd scraper
  python google_places.py
"""

import os
import time
import requests
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

GOOGLE_API_KEY = os.environ["GOOGLE_PLACES_API_KEY"]
SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ─────────────────────────────────────────────
# 타겟 지역
# ─────────────────────────────────────────────
CENTERS = [
    # {"name": "Fort Lee",        "state": "NJ", "lat": 40.8504, "lng": -73.9710},
    # {"name": "Palisades Park",  "state": "NJ", "lat": 40.8468, "lng": -73.9932},
    # {"name": "Flushing",        "state": "NY", "lat": 40.7675, "lng": -73.8330},
    # {"name": "Manhattan",       "state": "NY", "lat": 40.7580, "lng": -73.9855},
    # {"name": "Carrollton", "state": "TX", "lat": 32.9756, "lng": -96.8899},
    {"name": "Dallas", "state": "TX", "lat": 32.7767, "lng": -96.7970},
]

# ─────────────────────────────────────────────
# 카테고리 — Text Search 쿼리 방식 사용
# Places API (New) Nearby Search는 keyword 지원 X
# → Text Search로 "Korean doctor near Fort Lee NJ" 형태로 검색
# ─────────────────────────────────────────────
CATEGORIES = [
    {"sori_category": "hospital", "keyword": "Korean doctor clinic"},
    {"sori_category": "hospital", "keyword": "Korean dentist"},
    {"sori_category": "lawyer", "keyword": "Korean lawyer attorney"},
    {"sori_category": "accountant", "keyword": "Korean CPA accountant"},
    {"sori_category": "restaurant", "keyword": "Korean restaurant"},
    {"sori_category": "beauty", "keyword": "Korean hair salon beauty"},
    {"sori_category": "education", "keyword": "Korean tutoring academy"},
]

RADIUS = 5000  # 5km


# ─────────────────────────────────────────────
# Text Search (New) — 키워드 + 위치 검색
# ─────────────────────────────────────────────
def text_search(query, lat, lng):
    """
    Places API (New) — Text Search
    https://developers.google.com/maps/documentation/places/web-service/text-search
    """
    url = "https://places.googleapis.com/v1/places:searchText"
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_API_KEY,
        "X-Goog-FieldMask": (
            "places.id,"
            "places.displayName,"
            "places.formattedAddress,"
            "places.addressComponents,"
            "places.location,"
            "places.internationalPhoneNumber,"
            "places.websiteUri,"
            "places.regularOpeningHours,"
            "places.rating,"
            "places.userRatingCount,"
            "places.primaryTypeDisplayName"
        ),
    }
    body = {
        "textQuery": query,
        "locationBias": {
            "circle": {
                "center": {"latitude": lat, "longitude": lng},
                "radius": float(RADIUS),
            }
        },
        "maxResultCount": 20,
        "languageCode": "ko",
    }
    try:
        res = requests.post(url, headers=headers, json=body, timeout=15)
        if res.status_code != 200:
            print(f"  ⚠️  API 오류 {res.status_code}: {res.text[:200]}")
            return []
        return res.json().get("places", [])
    except Exception as e:
        print(f"  ⚠️  요청 오류: {e}")
        return []


# ─────────────────────────────────────────────
# 주소 컴포넌트에서 도시/주 추출
# ─────────────────────────────────────────────
def extract_city_state(address_components):
    city = ""
    state = ""
    for comp in address_components or []:
        types = comp.get("types", [])
        if "locality" in types or "sublocality_level_1" in types:
            city = comp.get("longText", "")
        elif "administrative_area_level_1" in types:
            state = comp.get("shortText", "")
    return city, state


# ─────────────────────────────────────────────
# Places 응답 → Sori DB 형식 변환
# ─────────────────────────────────────────────
def to_business(place, sori_category, center):
    name = place.get("displayName", {}).get("text", "").strip()
    if not name:
        return None

    address = place.get("formattedAddress", "")
    lat = place.get("location", {}).get("latitude")
    lng = place.get("location", {}).get("longitude")

    city, state = extract_city_state(place.get("addressComponents", []))
    if not city:
        city = center["name"]
        state = center["state"]

    # 전화번호 정리
    phone_raw = place.get("internationalPhoneNumber", "") or ""
    phone = phone_raw.replace("+1", "").replace(" ", "").replace("-", "").replace("(", "").replace(")", "").strip()

    # 운영시간
    hours = None
    days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
    descriptions = (place.get("regularOpeningHours", {}) or {}).get("weekdayDescriptions", [])
    if descriptions:
        hours = {}
        for i, desc in enumerate(descriptions):
            if i < 7:
                parts = desc.split(": ", 1)
                hours[days[i]] = parts[1] if len(parts) > 1 else desc

    subcategory = (place.get("primaryTypeDisplayName") or {}).get("text")

    return {
        "google_place_id": place.get("id"),
        "name": name,
        "category": sori_category,
        "subcategory": subcategory,
        "address": address,
        "city": city,
        "state": state,
        "phone": phone or None,
        "website": place.get("websiteUri") or None,
        "hours": hours,
        "languages": ["ko", "en"],
        "is_verified": False,
        "is_premium": False,
        "rating": float(place.get("rating") or 0),
        "review_count": int(place.get("userRatingCount") or 0),
        "images": [],
        "lat": lat,
        "lng": lng,
    }


# ─────────────────────────────────────────────
# Supabase upsert
# ─────────────────────────────────────────────
def upsert_business(biz):
    try:
        supabase.table("businesses").upsert(biz, on_conflict="google_place_id").execute()
        return True
    except Exception as e:
        # google_place_id 없으면 name+city 중복 체크 후 insert
        try:
            biz_clean = {k: v for k, v in biz.items() if k not in ("google_place_id", "lat", "lng")}
            existing = (
                supabase.table("businesses").select("id").eq("name", biz["name"]).eq("city", biz["city"]).execute()
            )
            if existing.data:
                return False
            supabase.table("businesses").insert(biz_clean).execute()
            return True
        except Exception as e2:
            print(f"    ❌ DB 저장 실패: {e2}")
            return False


# ─────────────────────────────────────────────
# 메인
# ─────────────────────────────────────────────
def main():
    print("\n🗺️  Sori — Google Places 데이터 수집 시작")
    print("=" * 50)

    print("\n⚠️  먼저 Supabase SQL Editor에서 아래 SQL을 실행하세요:\n")
    print("  ALTER TABLE businesses ADD COLUMN IF NOT EXISTS google_place_id TEXT UNIQUE;")
    print("  ALTER TABLE businesses ADD COLUMN IF NOT EXISTS lat NUMERIC(10,7);")
    print("  ALTER TABLE businesses ADD COLUMN IF NOT EXISTS lng NUMERIC(10,7);\n")
    input("✅ 완료했으면 Enter 키를 누르세요...")
    print()

    total_saved = 0
    seen_ids = set()

    for center in CENTERS:
        print(f"\n📍 {center['name']}, {center['state']} 수집 중...")
        print("-" * 40)

        for cat in CATEGORIES:
            query = f"{cat['keyword']} near {center['name']} {center['state']}"
            places = text_search(query, center["lat"], center["lng"])
            print(f"  '{query}' → {len(places)}개 발견")

            for place in places:
                pid = place.get("id")
                if not pid or pid in seen_ids:
                    continue
                seen_ids.add(pid)

                biz = to_business(place, cat["sori_category"], center)
                if not biz:
                    continue

                saved = upsert_business(biz)
                if saved:
                    total_saved += 1
                    print(f"    ✅ {biz['name']} ({biz['city']}, {biz['state']}) ★{biz['rating']}")

            time.sleep(0.3)  # rate limit 방지

    print("\n" + "=" * 50)
    print(f"🎉 완료! 총 {total_saved}개 저장")
    print(f"   고유 Place ID 수집: {len(seen_ids)}개")
    print(f"\n👉 Supabase → Table Editor → businesses 에서 확인하세요")


if __name__ == "__main__":
    main()
