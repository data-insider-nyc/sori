const TOPICS = [
  { rank: 1, text: "뉴저지 한인 소아과 추천",    count: 47 },
  { rank: 2, text: "H1B 비자 갱신 경험 공유",   count: 32 },
  { rank: 3, text: "맨해튼 한인 부동산 시세",    count: 28 },
  { rank: 4, text: "플러싱 vs 팰리세이즈파크",   count: 19 },
  { rank: 5, text: "뉴욕 삼성 취업 후기",        count: 15 },
];

export function HotTopics() {
  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">🔥 지금 핫한 토픽</h3>
      <div className="space-y-1">
        {TOPICS.map((t) => (
          <div key={t.rank} className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-white rounded-lg px-2 -mx-2 transition-colors">
            <span className="text-sm font-bold text-[#FF5C5C] w-4">{t.rank}</span>
            <span className="text-sm text-gray-800 flex-1 leading-tight">{t.text}</span>
            <span className="text-xs text-gray-400">댓글 {t.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
