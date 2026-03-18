import Link from "next/link";
import { MapPin, Phone, Star, CheckCircle, Crown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatPhone } from "@/lib/utils";
import type { Business } from "@/types";

interface Props { business: Business; variant?: "list" | "featured" | "compact" }

export function BusinessCard({ business, variant = "list" }: Props) {
  const cat = CATEGORIES[business.category];

  return (
    <Link href={`/directory/${business.id}`} className="block">
      <div className="card p-5 flex gap-4 group">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 bg-gray-50">
          {cat.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 text-[15px] group-hover:text-[#FF5C5C] transition-colors leading-tight">
                {business.name}
              </h3>
              <p className="text-gray-500 text-xs mt-0.5">{business.subcategory ?? cat.label}</p>
            </div>
            <div className="flex flex-col gap-1 flex-shrink-0">
              {business.is_premium  && <span className="badge-premium"><Crown className="w-2.5 h-2.5" />추천</span>}
              {business.is_verified && <span className="badge-verified"><CheckCircle className="w-2.5 h-2.5" />인증</span>}
            </div>
          </div>

          {business.review_count > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-3 h-3 text-amber-400" fill={i < Math.round(business.rating) ? "currentColor" : "none"} />
              ))}
              <span className="text-xs font-semibold text-gray-700">{business.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400">({business.review_count})</span>
            </div>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />{business.city}, {business.state}
            </span>
            {business.phone && (
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Phone className="w-3 h-3" />{formatPhone(business.phone)}
              </span>
            )}
          </div>

          {business.languages.includes("ko") && (
            <span className="inline-block mt-2 text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
              한국어 가능
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
