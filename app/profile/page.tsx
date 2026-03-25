import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase-server";
import { getInitials, avatarColor } from "@/lib/utils";
import { NicknameEditor } from "./NicknameEditor";
import { DeleteAccountButton } from "./DeleteAccountButton";

export const metadata: Metadata = { title: "내 프로필" };

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "numeric",
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, avatar_url, joined_at, nickname_changed_at")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/auth/nickname");

  const cooldownDays = daysUntilChange(profile.nickname_changed_at);
  const colorClass = avatarColor(profile.nickname);

  return (
    <div className="py-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-6">내 프로필</h1>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-6">
        {/* Avatar + info */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={profile.nickname}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center text-2xl font-bold ${colorClass}`}>
                {getInitials(profile.nickname)}
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{profile.nickname}</p>
            <p className="text-sm text-gray-400">
              가입일 {formatDate(profile.joined_at)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100" />

        {/* Nickname editor */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-gray-700">닉네임 변경</p>
            {cooldownDays && (
              <span className="text-xs text-gray-400">{cooldownDays}일 후 변경 가능</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mb-4">14일에 한 번 변경할 수 있어요.</p>
          <NicknameEditor
            userId={user.id}
            currentNickname={profile.nickname}
            cooldownDays={cooldownDays}
          />
        </div>

        <div className="border-t border-gray-100" />

        {/* Account deletion */}
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-1">계정 삭제</p>
          <p className="text-xs text-gray-400 mb-4">
            삭제 시 프로필 및 모든 데이터가 영구 삭제되며 복구할 수 없어요.
          </p>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
