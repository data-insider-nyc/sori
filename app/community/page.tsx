"use client";

import { useState }           from "react";
import { PostCard }           from "@/components/community/PostCard";
import { HotTopics }          from "@/components/community/HotTopics";
import { CreatePostButton }   from "@/components/community/CreatePostButton";
import { POST_CATEGORIES }    from "@/lib/constants";
import { cn }                 from "@/lib/utils";
import type { PostCategory, Post } from "@/types";

const MOCK_POSTS: Post[] = [
  {
    id: "1",
    author: { id: "u1", nickname: "김민준" },
    category: "hospital",
    content: "플러싱에서 포트리로 이사왔는데 한인 소아과 추천 해주실 분 계신가요? 아이가 5살인데 영어 잘 하는 선생님이면 더 좋겠어요 😊",
    tags: ["병원추천", "소아과", "포트리"],
    like_count: 32,
    comment_count: 14,
    location: "Fort Lee, NJ",
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
  },
  {
    id: "2",
    author: { id: "u2", nickname: "박지현" },
    category: "jobs",
    content: "뉴욕에서 한국 회사 취업하신 분 계신가요? 비자 스폰서 해주는 곳 찾고 있어요. 마케팅 5년차입니다.",
    tags: ["취업", "비자", "H1B"],
    like_count: 21,
    comment_count: 8,
    location: "Manhattan, NY",
    created_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
  },
  {
    id: "3",
    author: { id: "u3", nickname: "이수연" },
    category: "jobs",
    content: "뉴욕 삼성 본사 입사하신 분 계신가요? OPT로 시작해서 H1B 스폰서 받으셨는지 궁금합니다 🙏",
    tags: ["삼성", "OPT", "H1B"],
    like_count: 7,
    comment_count: 3,
    location: "Manhattan, NY",
    created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    author: { id: "u4", nickname: "최준혁" },
    category: "classifieds",
    content: "아이패드 프로 11인치 팝니다. 거의 새것 $600. 포트리 직거래 가능합니다.",
    tags: ["중고거래", "아이패드", "포트리"],
    like_count: 4,
    comment_count: 5,
    location: "Fort Lee, NJ",
    created_at: new Date(Date.now() - 3600 * 1000).toISOString(),
  },
];

export default function CommunityPage() {
  const [active, setActive] = useState<PostCategory>("all");

  const posts = active === "all"
    ? MOCK_POSTS
    : MOCK_POSTS.filter((p) => p.category === active);

  return (
    <div className="py-4 lg:py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">커뮤니티</h1>
          <p className="text-gray-500 mt-1 text-sm">한인들의 생생한 생활 정보</p>
        </div>
        <CreatePostButton />
      </div>

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        <div className="lg:col-span-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6">
            {(Object.entries(POST_CATEGORIES) as [PostCategory, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActive(key)}
                className={cn("chip flex-shrink-0", active === key && "chip-active")}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {posts.map((post, i) => (
              <div key={post.id} className={cn("animate-fade-in-up", `stagger-${Math.min(i + 1, 4)}`)}>
                <PostCard post={post} />
              </div>
            ))}
            {posts.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">💬</p>
                <p className="text-sm">아직 글이 없어요. 첫 번째 글을 써보세요!</p>
              </div>
            )}
          </div>
        </div>

        <aside className="hidden lg:block space-y-6">
          <HotTopics />
          <div className="card p-5 text-center">
            <div className="text-2xl mb-2">📢</div>
            <div className="font-semibold text-sm text-gray-800 mb-1">비즈니스 광고 문의</div>
            <div className="text-xs text-gray-500 mb-3">한인 고객에게 직접 도달하세요</div>
            <a href="/advertise" className="btn-coral text-sm py-2 px-4 rounded-lg inline-block">
              광고 시작하기
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
