/**
 * Module-level store for recent like toggles.
 * Survives component unmount/remount within the same browser tab.
 *
 * LikeButton writes here after a successful toggle.
 * CommunityListing reads here when hydrating from feedCache so stale
 * like_count / is_liked values are replaced with the user's latest action.
 */

type LikeState = { likeCount: number; isLiked: boolean };
const store = new Map<string, LikeState>();

export function recordLikeToggle(postId: string, likeCount: number, isLiked: boolean) {
  store.set(postId, { likeCount, isLiked });
}

export function applyLikeOverrides<
  T extends { id: string; like_count: number; is_liked?: boolean },
>(posts: T[]): T[] {
  if (store.size === 0) return posts;
  return posts.map((p) => {
    const override = store.get(p.id);
    if (!override) return p;
    return { ...p, like_count: override.likeCount, is_liked: override.isLiked };
  });
}
