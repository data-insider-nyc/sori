import { Suspense } from "react";
import type { Metadata } from "next";
import { DirectoryClient } from "./DirectoryClient";
import { PAGE_META } from "@/lib/copy";

export const metadata: Metadata = {
  title: PAGE_META.directory.title,
  description: PAGE_META.directory.description,
  openGraph: {
    url: "/directory",
    title: PAGE_META.directory.ogTitle,
    description: PAGE_META.directory.ogDescription,
  },
};

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="py-4 lg:py-8">
          <div className="h-10 w-48 bg-gray-100 rounded-2xl animate-pulse mb-6" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-28 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <DirectoryClient />
    </Suspense>
  );
}
