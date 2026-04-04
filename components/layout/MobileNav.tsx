"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Search,
  MessageSquare,
  Briefcase,
  MoreHorizontal,
  PenSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase-browser";
import { ProfileAvatar } from "@/components/ui/ProfileCard";

const TABS = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/community", icon: MessageSquare, label: "커뮤니티" },
  { href: "/community/new", icon: PenSquare, label: "글쓰기" },
  { href: "/jobs", icon: Briefcase, label: "채용" },
  { href: "/more", icon: MoreHorizontal, label: "더보기" },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data?.user ?? null);
      if (data?.user) {
        (async () => {
          const { data: prof } = await supabase
            .from("profiles")
            .select("nickname, avatar_url")
            .eq("id", data.user.id)
            .single();
          if (mounted) setProfile(prof ?? null);
        })();
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (!u) {
          setProfile(null);
          return;
        }
        (async () => {
          const { data: prof } = await supabase
            .from("profiles")
            .select("nickname, avatar_url")
            .eq("id", u.id)
            .single();
          if (mounted) setProfile(prof ?? null);
        })();
      },
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  async function handleWrite() {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      router.push("/auth/login");
      return;
    }
    router.push("/community/new");
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="relative">
        <div className="bg-white/95 backdrop-blur-sm border-t border-gray-100">
          <div className="flex">
            {TABS.map(({ href, icon: Icon, label }) => {
              if (href === "/more") {
                if (user) {
                  const active = pathname === "/profile";
                  return (
                    <Link
                      key="profile"
                      href="/profile"
                      className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                        active
                          ? "text-[#FF5C5C]"
                          : "text-gray-400 hover:text-gray-600",
                      )}
                    >
                      {profile?.avatar_url ? (
                        <ProfileAvatar
                          nickname={profile.nickname ?? "U"}
                          avatarUrl={profile.avatar_url}
                          size="sm"
                          className="w-6 h-6"
                        />
                      ) : (
                        <User className="w-5 h-5" />
                      )}
                      <span
                        className={cn(
                          "text-[10px]",
                          active ? "font-semibold" : "font-medium",
                        )}
                      >
                        프로필
                      </span>
                    </Link>
                  );
                } else {
                  const active = pathname === "/auth/login";
                  return (
                    <Link
                      key="signup"
                      href="/auth/login"
                      className={cn(
                        "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                        active
                          ? "text-[#FF5C5C]"
                          : "text-gray-400 hover:text-gray-600",
                      )}
                    >
                      <User className="w-5 h-5" />
                      <span
                        className={cn(
                          "text-[10px]",
                          active ? "font-semibold" : "font-medium",
                        )}
                      >
                        로그인
                      </span>
                    </Link>
                  );
                }
              }

              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors",
                    active
                      ? "text-[#FF5C5C]"
                      : "text-gray-400 hover:text-gray-600",
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 1.8} />
                  <span
                    className={cn(
                      "text-[10px]",
                      active ? "font-semibold" : "font-medium",
                    )}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
