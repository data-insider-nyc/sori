"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

/**
 * Invisible component mounted in the root layout.
 * Calls router.refresh() on every Supabase auth state change so that
 * server components (Header, etc.) re-render with the latest session.
 */
export function AuthRefresh() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.refresh();
    });
    return () => subscription.unsubscribe();
  }, [router, supabase]);

  return null;
}
