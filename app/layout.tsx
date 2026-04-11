import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { AuthRefresh } from "@/components/layout/AuthRefresh";
import { Toaster } from "@/components/ui/Toaster";
import { LAYOUT_META, SITE } from "@/lib/copy";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
    default: LAYOUT_META.defaultTitle,
    template: LAYOUT_META.titleTemplate,
  },
  description: LAYOUT_META.description,
  keywords: [...LAYOUT_META.keywords],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: "en_US",
    siteName: SITE.name,
    title: LAYOUT_META.ogTitle,
    description: LAYOUT_META.ogDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: LAYOUT_META.twitterTitle,
    description: LAYOUT_META.twitterDescription,
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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.shortName,
  },
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
        <AuthRefresh />
        <Header />
        <main className="min-h-screen pb-20 lg:pb-0 lg:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="hidden lg:block border-t border-gray-100 bg-white mt-12">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between text-sm text-gray-400">
            <span>{SITE.copyright}</span>
            <div className="flex items-center gap-6">
              <a
                href="/terms"
                className="hover:text-[#FF5C5C] transition-colors"
              >
                Terms
              </a>
              <a
                href="/privacy"
                className="hover:text-[#FF5C5C] transition-colors"
              >
                Privacy
              </a>
              <a
                href="mailto:hello@oursori.com"
                className="hover:text-[#FF5C5C] transition-colors"
              >
                hello@oursori.com
              </a>
            </div>
          </div>
        </footer>
        <MobileNav />
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
