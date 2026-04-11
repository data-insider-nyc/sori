"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

const adminCacheByUserId = new Map<string, boolean>();

async function resolveIsAdmin(userId: string): Promise<boolean> {
  const cached = adminCacheByUserId.get(userId);
  if (typeof cached === "boolean") return cached;

  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", userId)
    .single();

  const isAdmin = data?.is_admin ?? false;
  adminCacheByUserId.set(userId, isAdmin);
  return isAdmin;
}

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    let mounted = true;

    async function syncFromUser(userId: string | null) {
      if (!mounted) return;

      if (!userId) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const nextIsAdmin = await resolveIsAdmin(userId);
      if (!mounted) return;
      setIsAdmin(nextIsAdmin);
      setLoading(false);
    }

    supabase.auth
      .getUser()
      .then(({ data: { user } }) => syncFromUser(user?.id ?? null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoading(true);
      void syncFromUser(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { isAdmin, loading };
}
