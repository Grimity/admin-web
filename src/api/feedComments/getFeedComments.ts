import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import type { AdminFeedCommentListResponse } from '@/types/admin/feedComment';

export interface GetFeedCommentsParams {
  cursor?: string;
  size?: number;
}

export async function getFeedComments(
  params: GetFeedCommentsParams = {}
): Promise<AdminFeedCommentListResponse> {
  const res = await axiosInstance.get<AdminFeedCommentListResponse>('/admin/feed-comments', {
    params,
  });
  return res.data;
}

export function useFeedComments(size = 20) {
  return useInfiniteQuery({
    queryKey: ['admin', 'feed-comments', { size }],
    queryFn: ({ pageParam }) =>
      getFeedComments({ cursor: pageParam as string | undefined, size }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
