import { Megaphone, Bookmark, Flame, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type SidebarWidgetId =
  | "announcements"
  | "pinned"
  | "hot_comments"
  | "hot_likes";

export type SidebarWidget = {
  id: SidebarWidgetId;
  title: string;
  icon: LucideIcon;
  enabled: boolean;
  limit: number;
};

export const SIDEBAR_WIDGETS: SidebarWidget[] = [
  {
    id: "announcements",
    title: "공지사항",
    icon: Megaphone,
    enabled: true,
    limit: 5,
  },
  {
    id: "pinned",
    title: "추천글",
    icon: Bookmark,
    enabled: true,
    limit: 5,
  },
  {
    id: "hot_comments",
    title: "댓글 많은 글",
    icon: Flame,
    enabled: true,
    limit: 5,
  },
  {
    id: "hot_likes",
    title: "인기글",
    icon: Heart,
    enabled: true,
    limit: 5,
  },
];
