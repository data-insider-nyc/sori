export type Category =
  | "hospital"
  | "lawyer"
  | "accountant"
  | "restaurant"
  | "beauty"
  | "realestate"
  | "education"
  | "jobs"
  | "other";

export type PostCategory =
  | "all"
  | "hospital"
  | "jobs"
  | "realestate"
  | "kids"
  | "classifieds"
  | "visa"
  | "general";

export interface Business {
  id: string;
  name: string;
  name_en?: string;
  category: Category;
  subcategory?: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  website?: string;
  hours?: Record<string, string>;
  languages: ("ko" | "en")[];
  is_verified: boolean;
  is_premium: boolean;
  rating: number;
  review_count: number;
  images: string[];
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  author: { id: string; nickname: string; avatar_url?: string };
  category: PostCategory;
  title?: string;
  content: string;
  tags: string[];
  images?: string[];
  like_count: number;
  comment_count: number;
  is_liked?: boolean;
  location?: string;
  created_at: string;
}

export interface BusinessFilters {
  category?: Category;
  city?: string;
  is_verified?: boolean;
  search?: string;
}
