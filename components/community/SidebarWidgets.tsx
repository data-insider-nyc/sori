import Link from "next/link";
import {
  getPinnedPosts,
  getAdminAnnouncements,
  getHotTopics,
  getHotByLikes,
} from "@/lib/queries";
import { SIDEBAR_WIDGETS, type SidebarWidget } from "@/lib/sidebar-config";

type PostItem = { id: string; title: string | null; comment_count: number };

async function fetchWidgetData(widget: SidebarWidget): Promise<PostItem[]> {
  switch (widget.id) {
    case "announcements": return getAdminAnnouncements(widget.limit);
    case "pinned":        return getPinnedPosts(widget.limit);
    case "hot_comments":  return getHotTopics(widget.limit);
    case "hot_likes":     return getHotByLikes(widget.limit);
  }
}

function WidgetSection({
  widget,
  posts,
}: {
  widget: SidebarWidget;
  posts: PostItem[];
}) {
  const Icon = widget.icon;

  return (
    <div className="bg-gray-50 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-[#FF5C5C]" strokeWidth={2.5} />
        {widget.title}
      </h3>

      {posts.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">
          {widget.id === "announcements" ? "공지사항이 없습니다" :
           widget.id === "pinned"        ? "추천된 글이 없습니다" :
                                           "아직 게시글이 없어요"}
        </p>
      ) : (
        <div className="space-y-1">
          {posts.map((post, i) => (
            <Link
              key={post.id}
              href={`/community/${post.id}`}
              className="flex items-center gap-3 py-2.5 border-b border-gray-100 last:border-0 hover:bg-white rounded-lg px-2 -mx-2 transition-colors"
            >
              <span className="text-sm font-bold text-[#FF5C5C] w-4 flex-shrink-0">
                {i + 1}
              </span>
              <span className="text-sm text-gray-800 flex-1 leading-tight line-clamp-1">
                {post.title ?? "(제목 없음)"}
              </span>
              <span className="text-xs text-gray-400 flex-shrink-0">
                댓글 {post.comment_count}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export async function SidebarWidgets() {
  const activeWidgets = SIDEBAR_WIDGETS.filter((w) => w.enabled);

  if (activeWidgets.length === 0) return null;

  const allData = await Promise.all(activeWidgets.map(fetchWidgetData));

  return (
    <div className="space-y-4">
      {activeWidgets.map((widget, i) => (
        <WidgetSection key={widget.id} widget={widget} posts={allData[i]} />
      ))}
    </div>
  );
}
