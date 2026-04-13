import type { Business } from "@/types";

type BusinessRecommendationInput = Pick<
  Business,
  "is_premium" | "is_verified" | "rating" | "review_count"
>;

export type BusinessRecommendationTier = "premium" | "editorial" | null;

const MIN_EDITORIAL_RATING = 4.7;
const MIN_EDITORIAL_REVIEWS = 12;

export function getBusinessRecommendationTier(
  business: BusinessRecommendationInput,
): BusinessRecommendationTier {
  if (business.is_premium) return "premium";
  if (
    business.is_verified &&
    business.rating >= MIN_EDITORIAL_RATING &&
    business.review_count >= MIN_EDITORIAL_REVIEWS
  ) {
    return "editorial";
  }
  return null;
}

export function isRecommendedBusiness(
  business: BusinessRecommendationInput,
): boolean {
  return getBusinessRecommendationTier(business) !== null;
}

export function getBusinessPriorityScore(
  business: BusinessRecommendationInput,
): number {
  const tier = getBusinessRecommendationTier(business);
  const base =
    tier === "premium"
      ? 20000
      : tier === "editorial"
        ? 10000
        : business.is_verified
          ? 5000
          : 0;

  return base + business.rating * 100 + Math.min(business.review_count, 999);
}
