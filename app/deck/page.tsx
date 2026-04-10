import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import path from "node:path";
import DeckClient from "@/app/deck/DeckClient";
import { SITE } from "@/lib/copy";

export const metadata: Metadata = {
  title: `Deck | ${SITE.name}`,
  description: "소리 브랜드와 사업계획서를 기반으로 정리한 공개 deck 페이지",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DeckPage() {
  const markdown = await readFile(
    path.join(process.cwd(), "docs", "pitch-deck.md"),
    "utf8",
  );

  return <DeckClient markdown={markdown} />;
}
