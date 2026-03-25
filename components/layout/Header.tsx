import Link from "next/link";
import { Search } from "lucide-react";
import { createClient } from "@/lib/supabase-server";
import { NavLinks } from "./NavLinks";
import { UserMenu, LoginButton } from "./UserMenu";

export async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let nickname: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", user.id)
      .single();
    nickname = profile?.nickname ?? null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 hidden lg:block">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="text-2xl font-bold text-[#FF5C5C] leading-none">
            소리
          </span>
          <span className="text-[10px] text-gray-400 font-medium tracking-widest mt-1">
            SORI
          </span>
        </Link>

        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="병원, 변호사, 식당 검색..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm
                         focus:outline-none focus:ring-2 focus:ring-[#FF5C5C]/20 focus:border-[#FF5C5C] transition-all"
            />
          </div>
        </div>

        <NavLinks />

        <div className="flex items-center gap-2 ml-auto">
          {user && nickname ? (
            <UserMenu nickname={nickname} />
          ) : (
            <LoginButton />
          )}
          <Link href="/advertise" className="btn-coral text-sm !py-1.5 !px-4">
            광고 시작
          </Link>
        </div>
      </div>
    </header>
  );
}
