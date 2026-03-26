import Link from "next/link";
import { getHotTopics } from "@/lib/queries";

export async function HotTopics() {
  const topics = await getHotTopics();

  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">🔥 지금 핫한 토픽</h3>
      {topics.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">아직 게시글이 없어요</p>
      ) : (
        <div className="space-y-1">
          {topics.map((t, i) => (
            <Link
              key={t.id}
              href={`/community/${t.id}`}
              className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 hover:bg-white rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="text-sm font-bold text-[#FF5C5C] w-4 flex-shrink-0">{i + 1}</span>
              <span className="text-sm text-gray-800 flex-1 leading-tight line-clamp-1">{t.title ?? "(제목 없음)"}</span>
              <span className="text-xs text-gray-400 flex-shrink-0">댓글 {t.comment_count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
