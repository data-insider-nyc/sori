import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { avatarPalette } from "@/lib/utils";
import { ProfileAvatar } from "@/components/ui/ProfileCard";
import { getRegions } from "@/lib/regions";
import { FileText, CalendarDays, MapPin } from "lucide-react";
import { UserPublicActivity } from "./UserPublicActivity";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, handle, bio")
    .eq("handle", username.toLowerCase())
    .maybeSingle();

  if (!profile) {
    return { title: "프로필을 찾을 수 없어요" };
  }

  return {
    title: `${profile.nickname} (@${profile.handle}) — 소리`,
    description: profile.bio ?? `${profile.nickname}님의 소리 프로필`,
  };
}

function formatJoinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
}

export default async function UserProfilePage({ params }: Props) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, nickname, display_name, handle, bio, location_id, joined_at, avatar_url",
    )
    .eq("handle", username.toLowerCase())
    .maybeSingle();

  if (!profile) notFound();

  const [{ count: postCount }, regions] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id),
    getRegions(),
  ]);

  const region = profile.location_id
    ? regions.find((r) => r.id === profile.location_id)
    : null;
  const locationLabel = region?.label ?? null;
  const locationEmoji = region?.emoji ?? null;

  const palette = avatarPalette(profile.nickname);
  const displayName = profile.display_name ?? profile.nickname;

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-5">
      {/* ── Identity banner ─────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden hero-gradient px-6 py-8 lg:px-10 lg:py-10">
        {/* Personalized color glow */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${palette.background}22 0%, transparent 70%)`,
          }}
        />
        {/* Subtle noise grain */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px 200px",
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Avatar with personalized color ring */}
          <div className="flex-shrink-0">
            <div
              className="rounded-full p-0.5"
              style={{
                background: `linear-gradient(135deg, ${palette.color}80, ${palette.color}20)`,
              }}
            >
              <div className="rounded-full p-0.5 bg-[#0F1B2D]">
                <ProfileAvatar
                  nickname={profile.nickname}
                  avatarUrl={profile.avatar_url}
                  size="lg"
                />
              </div>
            </div>
          </div>

          {/* Identity text */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-baseline gap-2 mb-0.5">
              <h1 className="text-2xl font-black text-white tracking-tight leading-none">
                {displayName}
              </h1>
              {profile.handle && (
                <span className="text-sm text-white/40 font-medium">
                  @{profile.handle}
                </span>
              )}
            </div>

            {profile.bio ? (
              <p className="text-sm text-white/60 mt-2 leading-relaxed max-w-md">
                {profile.bio}
              </p>
            ) : null}

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>
                  <span className="text-white font-bold">{postCount ?? 0}</span>
                  {" "}개의 글
                </span>
              </div>
              {locationLabel && (
                <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    {locationEmoji} {locationLabel}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{formatJoinDate(profile.joined_at)} 가입</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Public posts feed ────────────────────────────────────────── */}
      <UserPublicActivity userId={profile.id} postCount={postCount ?? 0} />
    </div>
  );
}
