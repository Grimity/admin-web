import type { AdminFeedCommentListItem } from '@/types/admin/feedComment';

export interface FeedCommentRowProps {
  comment: AdminFeedCommentListItem;
  onClick: (feedId: string) => void;
}
