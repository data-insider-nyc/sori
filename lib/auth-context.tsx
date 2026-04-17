"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type AuthState = {
  userId: string | null;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({
  userId: null,
  isAdmin: false,
  loading: true,
});

// Module-level admin cache — avoids repeat DB queries across navigations
const adminCache = new Map<string, boolean>();

/**
 * Single auth provider for the entire app.
 * - ONE getSession() call on mount (localStorage read — no network, no lock)
 * - ONE onAuthStateChange subscription (replaces AuthRefresh)
 * - All components read userId/isAdmin from context instead of calling Supabase
 *
 * This eliminates navigator.locks contention caused by many components
 * (e.g., PostMenu × 20 per page) each calling getUser() simultaneously.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabaseRef = useRef(createClient());

  useEffect(() => {
    const supabase = supabaseRef.current;
    let mounted = true;

    async function syncUser(uid: string | null) {
      if (!mounted) return;
      setUserId(uid);

      if (!uid) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Serve from cache to avoid repeat DB queries
      if (adminCache.has(uid)) {
        setIsAdmin(adminCache.get(uid)!);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", uid)
        .single();

      if (!mounted) return;
      const admin = data?.is_admin ?? false;
      adminCache.set(uid, admin);
      setIsAdmin(admin);
      setLoading(false);
    }

    // getSession() reads from localStorage — no network round-trip, no lock
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user?.id ?? null);
    });

    // ONE subscription for the whole app (replaces per-component subscriptions)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "INITIAL_SESSION") return; // already handled by getSession above
      // Refresh server components (Header etc.) on real auth transitions
      router.refresh();
      syncUser(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ userId, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
