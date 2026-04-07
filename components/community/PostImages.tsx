"use client";

import { useState } from "react";
import { ImageLightbox } from "@/components/ui/ImageLightbox";

interface Props {
  images: string[];
}

export function PostImages({ images }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  return (
    <>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
      <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide -mx-6 px-6">
        {images.map((url, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={url}
            alt=""
            onClick={() => setLightboxIndex(i)}
            className={`rounded-xl object-cover flex-shrink-0 bg-gray-100 border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity ${
              images.length === 1 ? "w-full max-h-[360px]" : "w-[210px] h-[280px]"
            }`}
          />
        ))}
      </div>
    </>
  );
}
