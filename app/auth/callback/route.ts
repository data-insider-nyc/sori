import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  // Use APP_URL env var to avoid 127.0.0.1 vs localhost mismatch in local dev
  const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  const code = searchParams.get("code");           // OAuth (Google, Kakao)
  const token_hash = searchParams.get("token_hash"); // Magic link
  const type = searchParams.get("type") as EmailOtpType | null;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        },
      },
    },
  );

  let sessionError = true;

  if (code) {
    // OAuth flow (Google, Kakao)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) sessionError = false;
  } else if (token_hash && type) {
    // Magic link / OTP flow
    const { error } = await supabase.auth.verifyOtp({ token_hash, type });
    if (!error) sessionError = false;
  }

  if (!sessionError) {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile) {
        // New user — go set up nickname
        return NextResponse.redirect(new URL("/auth/nickname", origin));
      }

      // Returning user — go home
      return NextResponse.redirect(new URL("/", origin));
    }
  }

  // Something went wrong — back to login
  return NextResponse.redirect(new URL("/auth/login", origin));
}
