import { PostCard } from "@/components/community/PostCard";
import type { Post } from "@/types";

const POSTS: Post[] = [
  { id: "1", author: { id: "u1", nickname: "김민준" }, category: "hospital", content: "플러싱에서 포트리로 이사왔는데 한인 소아과 추천 해주실 분 계신가요? 아이가 5살입니다 😊", tags: ["병원추천","소아과"], like_count: 32, comment_count: 14, location: "Fort Lee, NJ", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "2", author: { id: "u2", nickname: "박지현" }, category: "jobs", content: "뉴욕에서 한국 회사 취업하신 분 계신가요? 비자 스폰서 해주는 곳 찾고 있어요. 마케팅 5년차입니다.", tags: ["취업","비자","H1B"], like_count: 21, comment_count: 8, location: "Manhattan, NY", created_at: new Date(Date.now() - 18000000).toISOString() },
];

export function CommunityFeed() {
  return (
    <div className="space-y-4">
      {POSTS.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
