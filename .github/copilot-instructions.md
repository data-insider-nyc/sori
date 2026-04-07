# Project Guidelines

Sori is a Next.js 16 App Router app for a Korean-American community and business platform.

## Build and Test

- `npm run dev` starts local development on `http://localhost:3000`
- `npm run build` builds production assets
- `npm run start` runs production server
- Playwright E2E is configured in `playwright.config.ts` with specs in `tests/`
- No linter is configured in package scripts

## Architecture

- Follow the App Router server/client split for filterable pages:
  - `app/directory/page.tsx` is the server component and owns `Suspense`
  - `app/directory/DirectoryClient.tsx` is the client component and owns `useSearchParams` state
- Keep the global layout shell behavior from `app/layout.tsx`:
  - Header on desktop and bottom mobile nav are already wired
  - Do not override main spacing (`pb-20 lg:pb-0 lg:pt-16`) in page components
- Current data boundary is transitional:
  - `app/api/businesses/route.ts` still uses mock inline data
  - Some components already query Supabase directly

## Conventions

- Use `@/` imports (repo-root alias)
- Prefer shared UI classes from `app/globals.css` (`.btn-coral`, `.card`, `.chip`, etc.) over ad hoc duplicates
- Use existing theme tokens from `tailwind.config.ts` (coral/navy palette)
- Never use CSS variables inside Tailwind arbitrary values with opacity modifiers:
  - Invalid: `bg-[--color]/30`
  - Valid: `bg-[#FF5C5C]/30`
- Reuse domain constants and types from:
  - `lib/constants.ts`
  - `types/index.ts`
- Reuse utility helpers from `lib/utils.ts` (`cn`, `timeAgo`, `formatPhone`, `avatarColor`)

## Supabase and Auth

- Use the existing Supabase client modules (`lib/supabase-browser.ts`, `lib/supabase-server.ts`, `lib/supabase-admin.ts`) based on runtime context
- Do not add extra Supabase Storage `remotePatterns`; `next.config.js` already allowlists required domains
- Ensure required env vars are present in `.env.local` before auth/data work

## Linked Docs

- Project overview and setup: `README.md`
- OAuth setup and callback pitfalls: `docs/auth-google-supabase.md`
- Database schema and migrations: `supabase/README.md` and `supabase/migrations/`
- Additional implementation notes for Claude tooling parity: `CLAUDE.md`
