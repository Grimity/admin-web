import type { AdminFeedListItem } from '@/types/admin/feed';

export interface FeedRowProps {
  feed: AdminFeedListItem;
  onClick: (id: string) => void;
}
