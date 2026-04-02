"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Mail, Check } from "lucide-react";

export default function LoginPage() {
  const [oauthLoading, setOauthLoading] = useState<"google" | "kakao" | null>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const supabase = createClient();

  async function handleOAuth(provider: "google" | "kakao") {
    setOauthLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailLoading(true);
    setEmailError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });
    setEmailLoading(false);
    if (error) {
      setEmailError("이메일 전송에 실패했어요. 다시 시도해주세요.");
    } else {
      setEmailSent(true);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8 w-full max-w-sm text-center">
        {/* Logo */}
        <div className="mb-6">
          <span className="text-4xl font-black text-[#FF5C5C]">소리</span>
          <p className="text-xs text-gray-400 font-medium tracking-widest mt-1">SORI</p>
        </div>

        <h1 className="text-xl font-bold text-gray-900 mb-1">로그인</h1>
        <p className="text-sm text-gray-500 mb-8">한인 커뮤니티에 참여하세요</p>

        {emailSent ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <Check className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-sm font-semibold text-gray-800">이메일을 확인하세요</p>
            <p className="text-xs text-gray-400 leading-relaxed">
              <span className="font-medium text-gray-600">{email}</span>로<br />
              로그인 링크를 보냈어요
            </p>
            <p className="text-[11px] text-gray-400 mt-2">
              로컬 개발 환경에서는{" "}
              <a
                href="http://127.0.0.1:54324"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FF5C5C] underline"
              >
                Inbucket
              </a>
              에서 확인하세요
            </p>
            <button
              onClick={() => { setEmailSent(false); setEmail(""); }}
              className="text-xs text-gray-400 underline mt-1"
            >
              다른 이메일로 재시도
            </button>
          </div>
        ) : (
          <>
            {/* Email magic link */}
            <form onSubmit={handleMagicLink} className="mb-4">
              <div className="relative mb-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소"
                  className="input-field pl-10"
                  disabled={emailLoading}
                  required
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mb-2">{emailError}</p>
              )}
              <button
                type="submit"
                disabled={emailLoading || !email.trim()}
                className="btn-coral w-full flex items-center justify-center gap-2"
              >
                {emailLoading && (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                )}
                이메일 링크 보내기
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">또는</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Google */}
            <button
              onClick={() => handleOAuth("google")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3 border border-gray-200
                         rounded-xl px-5 py-3 text-sm font-semibold text-gray-700 mb-3
                         hover:border-gray-300 hover:bg-gray-50 transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "google" ? (
                <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Google로 계속하기
            </button>

            {/* KakaoTalk */}
            <button
              onClick={() => handleOAuth("kakao")}
              disabled={!!oauthLoading}
              className="w-full flex items-center justify-center gap-3
                         rounded-xl px-5 py-3 text-sm font-semibold
                         bg-[#FEE500] text-[#191919]
                         hover:bg-[#F0D900] transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {oauthLoading === "kakao" ? (
                <span className="w-5 h-5 border-2 border-[#191919]/30 border-t-[#191919] rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#191919">
                  <path d="M12 3C6.477 3 2 6.477 2 10.8c0 2.7 1.61 5.08 4.04 6.54L5 21l4.37-2.33C10.22 18.88 11.1 19 12 19c5.523 0 10-3.477 10-7.8S17.523 3 12 3z" />
                </svg>
              )}
              카카오로 계속하기
            </button>
          </>
        )}

        <p className="mt-6 text-xs text-gray-400 leading-relaxed">
          로그인 시 소리의{" "}
          <span className="text-gray-600 underline cursor-pointer">이용약관</span>과{" "}
          <span className="text-gray-600 underline cursor-pointer">개인정보처리방침</span>에
          동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
