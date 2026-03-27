import { cn, avatarPalette } from "@/lib/utils";

interface Props {
  nickname: string;
  handle?: string | null;
  location?: string | null;
  /** sm = 32px (comments), md = 40px (feed/popover), lg = 56px (profile page) */
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE = {
  sm: { avatar: "w-8 h-8 text-sm",    text: "text-[13px]", handle: "text-[11px]" },
  md: { avatar: "w-10 h-10 text-base", text: "text-sm",    handle: "text-xs"     },
  lg: { avatar: "w-14 h-14 text-xl",   text: "text-base",  handle: "text-xs"     },
} as const;

export function ProfileCard({ nickname, handle, location, size = "md", className }: Props) {
  const s = SIZE[size];
  return (
    <div className={cn("profile-card", className)}>
      <ProfileAvatar nickname={nickname} size={size} />
      <div className="profile-info">
        <div className={cn("display-name", s.text)}>
          <span className="truncate">{nickname}</span>
          {location && <span className="badge badge-loc">{location}</span>}
        </div>
        {handle && (
          <div className={cn("handle", s.handle)}>@{handle}</div>
        )}
      </div>
    </div>
  );
}

/** Stand-alone avatar only — for tight spaces */
export function ProfileAvatar({
  nickname,
  size = "sm",
  className,
}: {
  nickname: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const s = SIZE[size];
  const palette = avatarPalette(nickname);
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
