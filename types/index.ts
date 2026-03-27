// types/index.ts
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

// PostCategory is defined in lib/constants.ts — do not duplicate here.
import type { PostCategory, Region } from "@/lib/constants";
export type { PostCategory, Region };

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
  author: { id: string; nickname: string; handle?: string | null; location?: string | null; avatar_url?: string };
  category: PostCategory;
  region: Region | null;
  title: string;
  content: string;
  tags: string[];
  images?: string[];
  like_count: number;
  comment_count: number;
  is_liked?: boolean;
  location?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author: { id: string; nickname: string; handle?: string | null; location?: string | null };
  content: string;
  created_at: string;
  replies?: Comment[];
}

export interface BusinessFilters {
  category?: Category;
  city?: string;
  is_verified?: boolean;
  search?: string;
}
