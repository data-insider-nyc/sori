import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import { NavLinks } from "./NavLinks";
import { UserMenu, LoginButton } from "./UserMenu";

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let nickname: string | null = null;
  let avatarUrl: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname, avatar_url")
      .eq("id", user.id)
      .single();
    nickname = profile?.nickname ?? null;
    avatarUrl = profile?.avatar_url ?? null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 hidden lg:block">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
          <span className="text-2xl font-bold text-[#FF5C5C] leading-none">
            소리
          </span>
          <span className="text-[12px] text-gray-400 font-medium tracking-widest leading-none">
            SORI
          </span>
        </Link>

        {/* Tagline — fills center space, keeps layout balanced */}
        <p className="flex-1 text-sm text-gray-600 font-medium tracking-wide truncate leading-none">
          미국 한인들이 만들어가는 커뮤니티 — 어디서든, 누구든
        </p>

        <NavLinks />

        <div className="flex items-center gap-2 ml-auto">
          {user && nickname ? (
            <UserMenu nickname={nickname} avatarUrl={avatarUrl} />
          ) : (
            <LoginButton />
          )}
          {/* <Link href="/advertise" className="btn-coral text-sm !py-1.5 !px-4">
            광고 시작
          </Link> */}
        </div>
      </div>
    </header>
  );
}
