# Google OAuth with Next.js + Supabase (Local Dev)

## Overview

This covers the full setup for Google OAuth in a **Next.js App Router** app using **Supabase Auth** — both local dev and production — including the pitfalls that will silently break your flow.

---

## The Auth Flow

```
User clicks "Sign in with Google"
  → Browser → Supabase Auth Server (/auth/v1/authorize)
  → Supabase → Google OAuth consent
  → Google → Supabase Auth Server (/auth/v1/callback)  ← exchanges token
  → Supabase → Your App (/auth/callback?code=...)
  → Your App → Supabase (exchangeCodeForSession)
  → Redirect: new user → /auth/nickname, returning user → /
```

**Important:** The URL briefly shows `127.0.0.1:54321` during local dev — that's normal. It's the local Supabase auth server. The final destination should always be your app on `localhost:3000`.

---

## Setup Checklist

### 1. Google Cloud Console

- Create an **OAuth 2.0 Web Client ID**
- Add this exact redirect URI:
  ```
  http://127.0.0.1:54321/auth/v1/callback
  ```
  > Google only talks to Supabase's auth server, not your Next.js app directly. The `localhost:3000/auth/callback` URL is irrelevant to Google.

### 2. `supabase/config.toml`

```toml
[auth]
site_url = "http://localhost:3000"
additional_redirect_urls = [
  "http://localhost:3000/**",
  "http://127.0.0.1:3000/**"
]

[auth.external.google]
enabled = true
client_id = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID)"
secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET)"
skip_nonce_check = true   # required for local dev
```

### 3. Environment Variables

There are **two separate env files** — don't mix them up:

**`supabase/.env`** — read by the Supabase CLI. Put OAuth credentials here:

```env
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-client-secret
```

The CLI automatically loads this file when running `supabase start`. The `env(VAR_NAME)` syntax in `config.toml` resolves from here.

**`.env.local`** — read by Next.js. Put app-level variables here:

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> ⚠️ Make sure `supabase/.env` is gitignored. Check your root `.gitignore` includes `.env` — never commit OAuth secrets.
>
> `NEXT_PUBLIC_APP_URL` should be treated as your canonical/public site URL for metadata and links. Auth callbacks should return to the **current app origin** that started the flow.

### 4. `/app/auth/callback/route.ts`

```ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Return to the same host that initiated auth.
  // This keeps local dev working even when using prod Supabase credentials.
  const origin = request.nextUrl.origin;
  const code = searchParams.get("code");

  if (code) {
    const supabase = /* createServerClient with cookies */;
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles").select("id").eq("id", user.id).maybeSingle();

        return NextResponse.redirect(
          new URL(profile ? "/" : "/auth/nickname", origin)
        );
      }
    }
  }
  return NextResponse.redirect(new URL("/auth/login", origin));
}
```

### 5. New User Onboarding

After redirect to `/auth/nickname`:

- Collect `nickname`, `handle`, `location`
- `upsert` into `public.profiles` (your app's user table — separate from `auth.users`)
- Redirect home

---

## Pitfalls

### ❌ Wrong redirect URI in Google Console
Adding `localhost:3000/auth/callback` to Google Console does nothing. Google only redirects to Supabase's auth server. The correct URI is `127.0.0.1:54321/auth/v1/callback`.

### ❌ `additional_redirect_urls` too narrow
If your `redirectTo` URL (set in `signInWithOAuth`) isn't in Supabase's allow-list, Supabase silently falls back to `site_url` — skipping your callback route entirely. The user ends up on the home page **without a session established in the app**.

### ❌ `127.0.0.1` vs `localhost` mismatch
`site_url = "http://127.0.0.1:3000"` and running Next.js on `localhost:3000` are different origins to the browser. Cookies set on one won't apply to the other. Always set `site_url` to match your actual dev URL, and make your auth callback return to the current request origin.

### ❌ Local `HTTP ERROR 431` after login
If local auth works in production but fails in `next dev` with `HTTP ERROR 431`, the request headers are usually too large because Supabase SSR auth cookies are chunked across multiple cookies. This is more likely when you're developing locally against a production Supabase project.

Increase the local Node header limit for dev:

```json
"dev": "NODE_OPTIONS='--max-http-header-size=32768' next dev"
```

Apply the same override to any custom local dev scripts like `dev:local` or `dev:prod`.

### ❌ Using `.single()` for profile check
`.single()` throws a PGRST116 error if no row is found. Use `.maybeSingle()` when a missing row is a valid, expected state (e.g., new user who hasn't set up a profile yet).

### ❌ Forgetting to restart Supabase
`config.toml` changes have **no effect** until you run `supabase stop && supabase start`. This is the most common "why isn't this working" moment.

### ❌ Putting Supabase credentials in `.env.local`
The Supabase CLI reads `env(VAR_NAME)` substitutions from **`supabase/.env`**, not from the Next.js `.env.local`. These are two separate files for two separate tools. OAuth credentials go in `supabase/.env`; app-level public vars go in `.env.local`.

---

## Best Practices

- **Two separate tables**: `auth.users` (Supabase-managed) and `public.profiles` (your app data). Never store app-specific data in `auth.users`.
- **App-managed profile creation**: Redirect new users to an onboarding page rather than auto-inserting a blank row via SQL trigger. This lets you collect required fields (nickname, handle) before they enter the app.
- **`NEXT_PUBLIC_APP_URL`**: Use this for canonical metadata, sitemap, and other public links. For auth callbacks, return to the current request origin so local dev, previews, and production each land back on the host that initiated auth.
- **`skip_nonce_check = true` for local only**: Google's nonce verification doesn't work with Supabase local auth. This flag is safe locally but should not be set in production config.
- **Wildcard redirect URLs**: Use `http://localhost:3000/**` in `additional_redirect_urls` rather than exact paths so any future callback routes work without config changes.

---

## Production vs Local

| | Local | Production |
|---|---|---|
| Supabase URL | `http://127.0.0.1:54321` | `https://xxx.supabase.co` |
| Google redirect URI | `http://127.0.0.1:54321/auth/v1/callback` | `https://xxx.supabase.co/auth/v1/callback` |
| `site_url` | `http://localhost:3000` | `https://yourdomain.com` |
| `skip_nonce_check` | `true` | `false` (default) |
| Google credentials | Shell env vars | Supabase dashboard → Auth → Providers |
