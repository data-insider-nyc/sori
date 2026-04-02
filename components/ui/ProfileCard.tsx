"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { cn, avatarPalette } from "@/lib/utils";
import { getRegionEmoji, getRegionLabel } from "@/lib/regions";

interface Props {
  nickname: string;
  handle?: string | null;
  location?: string | number | null;
  avatarUrl?: string | null;
  /** sm = 32px (comments), md = 40px (feed/popover), lg = 56px (profile page) */
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Whether to show location badge (default: false) */
  showLocation?: boolean;
}

const SIZE = {
  sm: { avatar: "w-8 h-8 text-sm", text: "text-[13px]", handle: "text-[11px]" },
  md: { avatar: "w-10 h-10 text-base", text: "text-sm", handle: "text-xs" },
  lg: { avatar: "w-14 h-14 text-xl", text: "text-base", handle: "text-xs" },
} as const;

export function ProfileCard({
  nickname,
  handle,
  location,
  avatarUrl,
  size = "md",
  className,
  showLocation = false,
}: Props) {
  const s = SIZE[size];
  const [displayLocation, setDisplayLocation] = useState<string | null>(null);

  useEffect(() => {
    if (!location) {
      setDisplayLocation(null);
      return;
    }

    (async () => {
      const emoji = await getRegionEmoji(location);
      const label = await getRegionLabel(location);
      // Show emoji + first word of label (e.g., "🗽 NY")
      const firstWord = label.split(" ")[0];
      setDisplayLocation(`${emoji} ${firstWord}`);
    })();
  }, [location]);

  return (
    <div className={cn("profile-card", className)}>
      <ProfileAvatar nickname={nickname} avatarUrl={avatarUrl} size={size} />
      <div className="profile-info">
        <div className={cn("display-name", s.text)}>
          <span className="truncate">{nickname}</span>
          {displayLocation && showLocation && (
            <span className="badge badge-loc">{displayLocation}</span>
          )}
        </div>
        {handle && <div className={cn("handle", s.handle)}>@{handle}</div>}
      </div>
    </div>
  );
}

/** Stand-alone avatar only — for tight spaces */
export function ProfileAvatar({
  nickname,
  avatarUrl,
  size = "sm",
  className,
}: {
  nickname: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const s = SIZE[size];
  const palette = avatarPalette(nickname);

  if (avatarUrl) {
    return (
      <div className={cn("rounded-full flex-shrink-0 overflow-hidden", s.avatar, className)}>
        <Image
          src={avatarUrl}
          alt={nickname}
          width={56}
          height={56}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-medium flex-shrink-0 select-none leading-none",
        s.avatar,
        className,
      )}
      style={palette}
    >
      {nickname[0]}
    </div>
  );
}
