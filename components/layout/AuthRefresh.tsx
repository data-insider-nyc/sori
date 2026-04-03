"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

/**
 * Invisible component mounted in the root layout.
 * Calls router.refresh() on actual Supabase auth state changes so that
 * server components (Header, etc.) re-render with the latest session.
 */
export function AuthRefresh() {
  const router = useRouter();
  // useRef prevents a new client instance on every render, which would
  // cause the useEffect to re-run and create an infinite refresh loop.
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const { data: { subscription } } = supabaseRef.current.auth.onAuthStateChange((event) => {
      // Skip INITIAL_SESSION — only refresh on real auth transitions.
      if (event === "INITIAL_SESSION") return;
      router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router]);

  return null;
}
