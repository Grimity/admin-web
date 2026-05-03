import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import type { AdminFeedComment } from '@/types/admin/feedComment';

export async function getFeedCommentsByFeed(feedId: string): Promise<AdminFeedComment[]> {
  const res = await axiosInstance.get<AdminFeedComment[]>('/admin/feed-comments/by-feed', {
    params: { feedId },
  });
  return res.data;
}

export function useFeedCommentsByFeed(feedId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'feed-comments', 'by-feed', feedId],
    queryFn: () => getFeedCommentsByFeed(feedId as string),
    enabled: !!feedId,
  });
}
