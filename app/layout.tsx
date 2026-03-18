import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header }    from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "소리 Sori — 한인 커뮤니티 & 비즈니스",
    template: "%s | 소리 Sori",
  },
  description: "뉴욕·뉴저지 한인 커뮤니티. 한인 병원·변호사·회계사 찾기 & 생활 정보.",
  keywords: [
    "한인 커뮤니티", "뉴저지 한인", "뉴욕 한인", "한인 병원", "한인 변호사",
    "포트리 한인", "팰리세이즈파크", "Korean American", "Fort Lee Korean",
  ],
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "소리 Sori" },
};

export const viewport: Viewport = {
  themeColor: "#FF5C5C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSansKR.variable}>
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Header />
        <main className="min-h-screen pb-20 lg:pb-0 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <MobileNav />
      </body>
    </html>
  );
}
