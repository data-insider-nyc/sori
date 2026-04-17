"use client";

import { useAuth } from "@/lib/auth-context";

/**
 * Returns isAdmin/loading from the global AuthProvider context.
 * No per-component Supabase auth calls — eliminates navigator.locks contention.
 */
export function useIsAdmin() {
  const { isAdmin, loading } = useAuth();
  return { isAdmin, loading };
}
