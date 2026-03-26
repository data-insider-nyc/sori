import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { avatarTextColor, getInitials } from "@/lib/utils";
import { NicknameEditor } from "./NicknameEditor";
import { DeleteAccountButton } from "./DeleteAccountButton";
import { ProfileActivity } from "./ProfileActivity";
import { BioEditor } from "./BioEditor";

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
    .select("nickname, bio, joined_at, nickname_changed_at")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/nickname");

  const cooldownDays = daysUntilChange(profile.nickname_changed_at);

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

  const textColor = avatarTextColor(profile.nickname);
  const avatarChar = getInitials(profile.nickname);

  return (
    <div className="py-8 max-w-lg mx-auto space-y-4">
      <h1 className="text-2xl font-black text-gray-900">내 프로필</h1>

      {/* ── Hero card ────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 flex items-center gap-4">
        {/* Avatar — neutral bg, colored text */}
        <div
          style={{ color: textColor }}
          className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-xl font-black bg-gray-100 select-none"
        >
          {avatarChar}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-lg font-black text-gray-900 truncate">
            {profile.nickname}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            가입일 {formatDate(profile.joined_at)}
          </p>
        </div>
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
          cooldownDays={cooldownDays}
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
