import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://oursori.com",
  ),
  title: {
    default: "소리 Sori — 뉴욕·뉴저지 한인 커뮤니티 & 비즈니스",
    template: "%s | 소리 Sori",
  },
  description:
    "뉴욕·뉴저지 한인 커뮤니티. 포트리·팰팍·플러싱 한인 병원·변호사·회계사·식당·부동산 찾기 & 생활 정보 공유.",
  keywords: [
    "한인 커뮤니티",
    "뉴저지 한인",
    "뉴욕 한인",
    "한인 병원",
    "한인 변호사",
    "한인 회계사",
    "포트리 한인",
    "팰리세이즈파크 한인",
    "플러싱 한인",
    "뉴저지 한인 커뮤니티",
    "뉴욕 한인 커뮤니티",
    "한인 비즈니스",
    "Korean American",
    "Fort Lee Korean",
    "Palisades Park Korean",
    "Flushing Korean",
    "Korean community New York New Jersey",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: "소리 Sori",
    title: "소리 Sori — 뉴욕·뉴저지 한인 커뮤니티 & 비즈니스",
    description:
      "포트리·팰팍·플러싱 한인들의 커뮤니티. 한인 병원·변호사·회계사·식당 찾기 & 생활 정보.",
  },
  twitter: {
    card: "summary_large_image",
    title: "소리 Sori — 뉴욕·뉴저지 한인 커뮤니티",
    description: "포트리·팰팍·플러싱 한인들의 커뮤니티 & 비즈니스 디렉토리",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  verification: {
    google: "tdhlOztmDLChIn5Ykx7OWFjsDshDZLC2beUk_qY-OT4",
  },
  alternates: {
    canonical: "https://oursori.com",
  },
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "소리 Sori" },
};

export const viewport: Viewport = {
  themeColor: "#FF5C5C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="min-h-screen pb-20 lg:pb-0 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="hidden lg:block border-t border-gray-100 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-400">
            <span>© 2026 소리 Sori. All rights reserved.</span>
            <a href="mailto:hello@oursori.com" className="hover:text-[#FF5C5C] transition-colors">
              hello@oursori.com
            </a>
          </div>
        </footer>
        <MobileNav />
      </body>
    </html>
  );
}
