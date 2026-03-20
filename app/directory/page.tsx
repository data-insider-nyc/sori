import { Suspense } from "react";
import { DirectoryClient } from "./DirectoryClient";

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
