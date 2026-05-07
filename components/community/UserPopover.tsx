"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { createClient } from "@/lib/supabase-browser";
import { getRegionLabel, getRegionIcon } from "@/lib/regions";
import { ProfileCard } from "@/components/ui/ProfileCard";

interface PopoverProfile {
  nickname: string;
  handle: string | null;
  location: string | null;
  bio: string | null;
  joined_at: string;
  post_count: number;
  avatar_url: string | null;
}

interface PopoverState extends PopoverProfile {
  locationLabel?: string;
}

interface Props {
  userId: string;
  nickname: string;
  children: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
}

export function UserPopover({
  userId,
  nickname,
  children,
  onOpenChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<PopoverState | null>(null);
  const [loading, setLoading] = useState(false);

  const triggerRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fetchedRef = useRef(false);

  function cancelOpen() {
    clearTimeout(openTimerRef.current);
  }
  function cancelClose() {
    clearTimeout(closeTimerRef.current);
  }

  function scheduleOpen() {
    cancelClose();
    openTimerRef.current = setTimeout(() => {
      setOpen(true);
      if (!fetchedRef.current) {
        fetchedRef.current = true;
        fetchProfile();
      }
    }, 400);
  }

  function scheduleClose() {
    cancelOpen();
    closeTimerRef.current = setTimeout(() => setOpen(false), 150);
  }

  async function fetchProfile() {
    setLoading(true);
    const supabase = createClient();
    const [{ data: prof }, { count }] = await Promise.all([
      supabase
        .from("profiles")
        .select("nickname, handle, location, bio, joined_at, avatar_url")
        .eq("id", userId)
        .single(),
      supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
    ]);
    if (prof) {
      const locationLabel = prof.location
        ? getRegionLabel(prof.location)
        : undefined;
      setProfile({
        ...prof,
        post_count: count ?? 0,
        locationLabel,
      });
    }
    setLoading(false);
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    cancelOpen();
    cancelClose();
    if (!open) {
      setOpen(true);
      if (!fetchedRef.current) {
        fetchedRef.current = true;
        fetchProfile();
      }
    } else {
      setOpen(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  useEffect(
    () => () => {
      cancelOpen();
      cancelClose();
    },
    [],
  );

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={scheduleOpen}
        onMouseLeave={scheduleClose}
        onClick={handleClick}
        className="relative cursor-pointer select-none"
      >
        {children}
        {open && (
          <div
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            className="absolute left-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl"
          >
            {loading || !profile ? (
              <div className="space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-gray-100" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-3/4 rounded bg-gray-100" />
                    <div className="h-3 w-1/2 rounded bg-gray-100" />
                  </div>
                </div>
                <div className="h-3 rounded bg-gray-100" />
                <div className="h-3 w-4/5 rounded bg-gray-100" />
              </div>
            ) : (
              <>
                <ProfileCard
                  nickname={profile.nickname}
                  handle={profile.handle}
                  location={profile.location}
                  avatarUrl={profile.avatar_url}
                  size="md"
                  className="mb-3"
                />

                {profile.location && profile.locationLabel && (() => {
                  const LocIcon = getRegionIcon(profile.location!);
                  return (
                    <p className="mb-3 flex items-center gap-1 border-t border-gray-50 pt-3 text-xs text-gray-600">
                      <span className="text-gray-400">활동지역:</span>
                      <LocIcon className="h-3 w-3" strokeWidth={2} />
                      {profile.locationLabel}
                    </p>
                  );
                })()}

                {profile.bio && (
                  <p className="mb-3 border-t border-gray-50 pt-3 text-xs leading-relaxed text-gray-600">
                    {profile.bio}
                  </p>
                )}

                <div className="flex items-center gap-3 border-t border-gray-50 pt-3 text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(profile.joined_at).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span>게시글 {profile.post_count}개</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
