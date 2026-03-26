import Link from "next/link";
import { Star, CheckCircle, Crown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { getFeaturedBusinesses } from "@/lib/queries";
import type { Business } from "@/types";

export async function FeaturedBusinesses() {
  const businesses = await getFeaturedBusinesses();

  if (businesses.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {businesses.map((biz) => {
        const cat = CATEGORIES[biz.category];
        return (
          <Link key={biz.id} href={`/directory/${biz.id}`} className="block">
            <div className="card overflow-hidden group">
              <div className="h-28 bg-gray-50 flex items-center justify-center text-4xl relative">
                {cat.emoji}
                {biz.is_premium && (
                  <span className="absolute top-2 left-2 badge-premium">
                    <Crown className="w-2.5 h-2.5" /> 추천
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-sm text-gray-900 group-hover:text-[#FF5C5C] transition-colors truncate">
                  {biz.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">{biz.city}, {biz.state}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-semibold">{biz.rating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({biz.review_count})</span>
                </div>
                {biz.is_verified && (
                  <span className="badge-verified mt-2 inline-flex">
                    <CheckCircle className="w-2.5 h-2.5" /> 인증됨
                  </span>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
