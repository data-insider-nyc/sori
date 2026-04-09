import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { avatarPalette } from "@/lib/utils";
import { NicknameEditor } from "./NicknameEditor";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { ProfileActivity } from "./ProfileActivity";
import { BioEditor } from "./BioEditor";
import { LocationEditor } from "./LocationEditor";
import { AvatarEditor } from "./AvatarEditor";
import { LogoutButton } from "./LogoutButton";
import { ProfileAvatar } from "@/components/ui/ProfileCard";
import { MapPin, FileText, MessageCircle, CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "내 프로필" };

function formatJoinDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });
}

function daysUntilChange(changedAt: string | null): number | null {
  if (!changedAt) return null;
  const elapsed = Math.floor(
    (Date.now() - new Date(changedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  const remaining = 1 - elapsed;
  return remaining > 0 ? remaining : null;
}

function daysUntilChange90(changedAt: string | null): number | null {
  if (!changedAt) return null;
  const elapsed = Math.floor(
    (Date.now() - new Date(changedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  const remaining = 90 - elapsed;
  return remaining > 0 ? remaining : null;
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`text-[10px] font-bold tracking-widest uppercase text-gray-400 px-1 mb-2 mt-1 ${className ?? ""}`}
    >
      {children}
    </p>
  );
}

function SettingsCard({
  children,
  danger,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm p-5 ${
        danger ? "border border-red-100" : "border border-gray-100"
      }`}
    >
      {children}
    </div>
  );
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "nickname, display_name, handle, bio, location, joined_at, nickname_changed_at, handle_changed_at, avatar_url",
    )
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/nickname");

  const cooldownDays = daysUntilChange(profile.nickname_changed_at);
  const handleCooldownDays = daysUntilChange90(profile.handle_changed_at);

  const [{ count: postCount }, { count: commentCount }] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("comments")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  const palette = avatarPalette(profile.nickname);

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-5">
      {/* ── Identity banner ───────────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden hero-gradient px-6 py-8 lg:px-10 lg:py-10">
        {/* Personalized color glow — unique to this user */}
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
              className="rounded-full"
              style={{
                background: `linear-gradient(135deg, ${palette.color}80, ${palette.color}20)`,
              }}
            >
              <div className="rounded-full bg-[#0F1B2D]">
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
                {profile.nickname}
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
            ) : (
              <p className="text-sm text-white/25 mt-2 italic">
                한 줄 소개를 추가해보세요
              </p>
            )}

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                <FileText className="w-3.5 h-3.5" />
                <span>
                  <span className="text-white font-bold">{postCount ?? 0}</span>{" "}
                  개의 글
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                <MessageCircle className="w-3.5 h-3.5" />
                <span>
                  <span className="text-white font-bold">
                    {commentCount ?? 0}
                  </span>{" "}
                  개의 댓글
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium">
                <CalendarDays className="w-3.5 h-3.5" />
                <span>{formatJoinDate(profile.joined_at)} 가입</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_320px] gap-5 lg:items-start">
        {/* LEFT — Activity feed (order-2 on mobile so settings appear first) */}
        <div className="order-2 lg:order-1">
          <ProfileActivity
            userId={user.id}
            initialPostCount={postCount ?? 0}
            initialCommentCount={commentCount ?? 0}
          />
        </div>

        {/* RIGHT — Settings (order-1 on mobile = top, order-2 on desktop = right column) */}
        <div className="order-1 lg:order-2 space-y-2 lg:sticky lg:top-24">
          {/* Profile settings group */}
          <SectionLabel>프로필 설정</SectionLabel>

          <SettingsCard>
            <AvatarEditor
              userId={user.id}
              nickname={profile.nickname}
              currentAvatarUrl={profile.avatar_url ?? null}
            />
          </SettingsCard>

          <SettingsCard>
            <BioEditor userId={user.id} currentBio={profile.bio} />
          </SettingsCard>

          <SettingsCard>
            <LocationEditor
              userId={user.id}
              currentLocation={profile.location ?? "other"}
            />
          </SettingsCard>

          <SettingsCard>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-gray-700">닉네임 변경</p>
              {cooldownDays && (
                <span className="text-xs text-gray-400">
                  {cooldownDays}일 후 변경 가능
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mb-4">
              7일에 한 번 변경할 수 있어요.
            </p>
            <NicknameEditor
              userId={user.id}
              currentNickname={profile.nickname}
              currentHandle={profile.handle ?? null}
              cooldownDays={cooldownDays}
              handleCooldown={handleCooldownDays}
            />
          </SettingsCard>

          {/* Account group */}
          <SectionLabel className="mt-4">계정</SectionLabel>

          <SettingsCard>
            <LogoutButton />
          </SettingsCard>

          {/* Danger zone */}
          <SectionLabel className="mt-4">위험 영역</SectionLabel>

          <SettingsCard danger>
            <p className="text-sm font-semibold text-red-500 mb-1">계정 삭제</p>
            <p className="text-xs text-gray-400 mb-4">
              삭제 시 프로필 및 모든 데이터가 영구 삭제되며 복구할 수 없어요.
            </p>
            <DeleteAccountButton />
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
