import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { ProfileCard } from "@/components/ui/ProfileCard";
import { NicknameEditor } from "./NicknameEditor";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { ProfileActivity } from "./ProfileActivity";
import { BioEditor } from "./BioEditor";
import { LocationEditor } from "./LocationEditor";

export const metadata: Metadata = { title: "내 프로필" };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function daysUntilChange(changedAt: string | null): number | null {
  if (!changedAt) return null;
  const elapsed = Math.floor(
    (Date.now() - new Date(changedAt).getTime()) / (1000 * 60 * 60 * 24),
  );
  const remaining = 14 - elapsed;
  return remaining > 0 ? remaining : null;
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
      "nickname, display_name, handle, bio, location, joined_at, nickname_changed_at, handle_changed_at",
    )
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/nickname");

  function daysUntilChange90(changedAt: string | null): number | null {
    if (!changedAt) return null;
    const elapsed = Math.floor(
      (Date.now() - new Date(changedAt).getTime()) / (1000 * 60 * 60 * 24),
    );
    const remaining = 90 - elapsed;
    return remaining > 0 ? remaining : null;
  }

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

  return (
    <div className="py-8 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-black text-gray-900">내 프로필</h1>

      {/* ── Hero card ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <ProfileCard
          nickname={profile.nickname}
          handle={profile.handle}
          location={profile.location}
          size="lg"
        />
        <p className="text-xs text-gray-400 mt-3 ml-[70px]">
          가입일 {formatDate(profile.joined_at)}
        </p>
      </div>

      {/* ── Activity: tabs with stats ─────────────────────────────── */}
      <ProfileActivity
        userId={user.id}
        initialPostCount={postCount ?? 0}
        initialCommentCount={commentCount ?? 0}
      />

      {/* ── Bio card ──────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <BioEditor userId={user.id} currentBio={profile.bio} />
      </div>

      {/* ── Location card ─────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <LocationEditor userId={user.id} currentLocation={profile.location ?? null} />
      </div>

      {/* ── Nickname change card ───────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-gray-700">닉네임 변경</p>
          {cooldownDays && (
            <span className="text-xs text-gray-400">
              {cooldownDays}일 후 변경 가능
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mb-4">
          14일에 한 번 변경할 수 있어요.
        </p>
        <NicknameEditor
          userId={user.id}
          currentNickname={profile.nickname}
          currentHandle={profile.handle ?? null}
          cooldownDays={cooldownDays}
          handleCooldown={handleCooldownDays}
        />
      </div>

      {/* ── Account deletion card (danger zone) ───────────────────── */}
      <div className="bg-white border border-red-100 rounded-2xl shadow-sm p-6">
        <p className="text-sm font-semibold text-red-500 mb-1">계정 삭제</p>
        <p className="text-xs text-gray-400 mb-4">
          삭제 시 프로필 및 모든 데이터가 영구 삭제되며 복구할 수 없어요.
        </p>
        <DeleteAccountButton />
      </div>
    </div>
  );
}
