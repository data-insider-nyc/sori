import { NextRequest, NextResponse } from "next/server";

// Mock data — replace with Supabase query after setup
const BUSINESSES = [
  { id: "1", name: "포트리 한인 내과", category: "hospital", subcategory: "가정의학과", city: "Fort Lee", state: "NJ", phone: "2015550101", languages: ["ko","en"], is_verified: true, is_premium: true, rating: 4.9, review_count: 127 },
  { id: "2", name: "김앤파트너스 법률", category: "lawyer", subcategory: "이민법·형사법", city: "Manhattan", state: "NY", phone: "2125550202", languages: ["ko","en"], is_verified: true, is_premium: true, rating: 4.7, review_count: 89 },
  { id: "3", name: "이성민 CPA 회계사무소", category: "accountant", subcategory: "세금·법인회계", city: "Palisades Park", state: "NJ", phone: "2015550303", languages: ["ko","en"], is_verified: true, is_premium: false, rating: 4.8, review_count: 54 },
  { id: "4", name: "우리집 한식당", category: "restaurant", subcategory: "한식·국밥", city: "Flushing", state: "NY", phone: "7185550404", languages: ["ko"], is_verified: true, is_premium: false, rating: 4.6, review_count: 203 },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const search   = searchParams.get("search");

  let results = BUSINESSES as typeof BUSINESSES;
  if (category) results = results.filter((b) => b.category === category);
  if (search)   results = results.filter((b) => b.name.toLowerCase().includes(search.toLowerCase()));

  return NextResponse.json({ data: results, total: results.length });
}
