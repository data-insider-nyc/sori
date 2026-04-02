"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-browser";

let cachedUserId: string | null = null;
let cachedIsAdmin: boolean = false;

export function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useState(cachedIsAdmin);
  const [loading, setLoading] = useState(!cachedUserId);

  useEffect(() => {
    if (cachedUserId !== null) {
      setIsAdmin(cachedIsAdmin);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        cachedUserId = "";
        cachedIsAdmin = false;
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      cachedUserId = user.id;
      cachedIsAdmin = data?.is_admin ?? false;
      setIsAdmin(cachedIsAdmin);
      setLoading(false);
    });
  }, []);

  return { isAdmin, loading };
}
