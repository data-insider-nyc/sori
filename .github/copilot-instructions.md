# Copilot Instructions

**Sori (소리)** — Korean-American community & business platform for NY/NJ (Fort Lee, Palisades Park, Flushing, Manhattan).

## Commands

```bash
npm run dev      # Dev server → http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
```

No test runner or linter is configured.

## Architecture

**Stack**: Next.js 16 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel

### Client/Server Component Pattern

Pages that need `useSearchParams` use a **Suspense + client component split**:

```
app/directory/page.tsx        ← Server component, owns Suspense boundary + skeleton
app/directory/DirectoryClient.tsx  ← 'use client', owns search/filter state
```

This is the pattern to follow for any new filterable/searchable pages.

### API Routes & Data Sources

`app/api/businesses/route.ts` returns **inline mock data** — not yet wired to Supabase.

Several page-level components (`BusinessList`, `CommunityPage`, `FeaturedBusinesses`) already query Supabase directly using `supabase.from("table").select(...)`. Import `supabase` from `@/lib/supabase` — no ORM layer.

### Path Alias

Use `@/` for all imports (maps to repo root). Example: `import { cn } from "@/lib/utils"`.

## Styling Conventions

### Tailwind Theme Colors

Defined in `tailwind.config.ts`:

| Token | Hex | Usage |
|---|---|---|
| `coral` / `coral-DEFAULT` | `#FF5C5C` | Primary brand |
| `coral-dark` | `#E03E3E` | Hover states |
| `coral-soft` | `#FFF0F0` | Soft backgrounds |
| `navy` / `navy-DEFAULT` | `#0F1B2D` | Dark backgrounds |
| `navy-mid` | `#1E3050` | Secondary dark |

**Critical rule**: Never use CSS variables inside Tailwind arbitrary values with opacity modifiers. `bg-[--color]/30` does **not** work. Always use explicit hex: `bg-[#FF5C5C]/30`.

### Reusable CSS Classes (defined in `globals.css`)

Prefer these over rebuilding from scratch:

- `.btn-coral` — primary button
- `.btn-outline` — secondary button
- `.card` — white card with hover coral border + shadow
- `.chip` / `.chip-active` — filter pill (toggle pattern)
- `.badge-verified` / `.badge-premium` — status badges
- `.input-field` — form input
- `.tag` — inline content tag
- `.hero-gradient` — dark navy gradient for hero backgrounds
- `.section-header`, `.section-title`, `.see-all-link` — section layout helpers

### Fonts

- **Pretendard** (CDN, loaded in `globals.css`) — primary UI font, handles Korean well
- **Noto Sans KR** (via `next/font`) — fallback, set as `--font-sans` CSS variable

## Key Utilities (`lib/utils.ts`)

- `cn(...classes)` — `clsx` + `tailwind-merge` for conditional Tailwind classes
- `timeAgo(date)` — returns Korean relative time strings ("방금 전", "3분 전", etc.)
- `formatPhone(phone)` — formats 10-digit strings to `(XXX) XXX-XXXX`
- `avatarColor(name)` — deterministic Tailwind color class pair from name

## Type System (`types/index.ts`)

- `Category` — union of business category slugs (`"hospital" | "lawyer" | ...`)
- `PostCategory` — union of community post category slugs
- `Business` — full business entity (matches Supabase schema)
- `Post` — community post with nested `author` object
- `BusinessFilters` — filter state shape for directory

## Constants (`lib/constants.ts`)

- `CATEGORIES` — `Record<Category, { label: string; emoji: string }>` with Korean labels
- `CATEGORY_LIST` — array form of `CATEGORIES` for mapping in JSX
- `POST_CATEGORIES` — `Record<PostCategory, string>` with Korean labels
- `TARGET_CITIES` — `as const` array of `{ value, label }` for city filter; English city names only

## Database (Supabase)

Schema defined in `supabase/migrations/001_initial.sql`. Key tables: `profiles`, `businesses`, `reviews`, `posts`, `comments`, `post_likes`.

- RLS policies: public read on all tables, writes restricted to own data
- `reviews` → triggers update `businesses.rating`
- `comments` / `post_likes` → triggers update `posts.comment_count` / `like_count`

## Images

`next.config.js` configures Supabase Storage as a remote image pattern. Use `next/image` with Supabase Storage URLs — they are already allowlisted. Don't add additional `remotePatterns` for Supabase domains.

## Layout Shell

`app/layout.tsx` wraps all pages with `<Header>` (top, desktop) and `<MobileNav>` (bottom, mobile). The `<main>` tag includes `pb-20 lg:pb-0 lg:pt-16` to clear both navbars — don't override this padding in page components.
