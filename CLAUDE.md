# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sori (소리)** — A Korean-American community & business platform for the NY/NJ area (Fort Lee, Palisades Park, Flushing, Manhattan).

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom coral/navy theme
- **Database**: Supabase (PostgreSQL with RLS policies)
- **Icons**: Lucide React
- **Deploy**: Vercel

## Development Commands

```bash
npm run dev      # Start dev server on http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
```

## Architecture

### App Router Structure (`app/`)

- `page.tsx` — Home with Hero, Categories, Featured Businesses, Community Feed
- `directory/page.tsx` — Business directory with search and filters
- `directory/[id]/page.tsx` — Business detail page (2-column layout with sticky sidebar)
- `community/page.tsx` — Community feed
- `jobs/page.tsx` — Job board (coming soon)
- `advertise/page.tsx` — Advertising info
- `more/page.tsx` — Additional links
- `api/businesses/route.ts` — REST API for business search/filter

### Component Organization (`components/`)

- `layout/` — Header, MobileNav
- `home/` — HeroCard, CategoryGrid, FeaturedBusinesses, CommunityFeed, JobsBanner
- `directory/` — BusinessCard, BusinessList, BusinessSearch, CategoryFilterBar
- `community/` — PostCard, HotTopics, CreatePostButton
- `ui/` — Toaster, ComingSoon (shared UI primitives)

### Styling System

**Theme Colors** (defined in `tailwind.config.ts`):

- `coral.DEFAULT` (#FF5C5C) — Primary brand color
- `coral.dark` (#E03E3E) — Hover state
- `coral.soft` (#FFF0F0) — Backgrounds
- `navy.DEFAULT` (#0F1B2D) — Dark backgrounds
- `navy.mid` (#1E3050) — Secondary dark

**Component Classes** (defined in `globals.css`):

- `.btn-coral` — Primary button
- `.btn-outline` — Secondary button
- `.card` — Card with hover shadow/border effect
- `.chip` / `.chip-active` — Filter chips
- `.badge-verified` / `.badge-premium` — Status badges
- `.input-field` — Form inputs

**Typography**: Pretendard font for Korean, Noto Sans KR via next/font

### Database Schema (Supabase)

Key tables in `supabase/migrations/001_initial.sql`:

- `profiles` — User profiles linked to auth.users
- `businesses` — Business listings with category, location, ratings
- `reviews` — Business reviews with trigger updating business rating
- `posts` — Community posts with like/comment counts
- `comments` — Post comments with trigger updating post comment_count
- `post_likes` — Many-to-many likes with trigger updating post like_count

**RLS Policies**: Public read access on all tables. Write access restricted to own data only.

### Type System (`types/index.ts`)

- `Category` — Business categories (hospital, lawyer, restaurant, etc.)
- `PostCategory` — Post categories (hospital, jobs, realestate, etc.)
- `Business` — Full business entity type
- `Post` — Community post with author
- `BusinessFilters` — Filter state for directory

### Constants (`lib/constants.ts`)

- `CATEGORIES` — Business category labels with emojis
- `CATEGORY_LIST` — Array version for mapping
- `POST_CATEGORIES` — Community category labels
- `TARGET_CITIES` — Filter cities for hyperlocal search

## Important Patterns

### Client/Server Split

Directory page uses `Suspense` + client component pattern:

- `directory/page.tsx` — Server component with Suspense boundary
- `directory/DirectoryClient.tsx` — Client component with search/filter state

This enables URL-based filtering with `useSearchParams` while showing skeleton loading states.

### Mock Data Phase

API routes currently return mock data. Supabase client is configured in `lib/supabase.ts` but not yet actively queried. Database schema is ready for migration when moving to Phase 2.

### CSS Rule

Never use CSS variables inside Tailwind arbitrary values with opacity modifiers (e.g., `bg-[--color]/30` is NOT supported). Always use explicit hex: `bg-[#FF5C5C]/30`.

## Environment Setup

Copy `.env.example` to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Python Scraper (Optional)

`scripts/scraper/` contains Python tools for data collection:

- `google_places.py` — Google Places API scraper
- Run in virtual environment: `cd scripts && source .venv/bin/activate`
