import type { AdminPostListItem } from '@/types/admin/post';

export interface PostRowProps {
  post: AdminPostListItem;
  onClick: (id: string) => void;
}
