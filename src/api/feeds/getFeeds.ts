import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import type { AdminFeedListResponse } from '@/types/admin/feed';

export interface GetFeedsParams {
  cursor?: string;
  size?: number;
}

export async function getFeeds(params: GetFeedsParams = {}): Promise<AdminFeedListResponse> {
  const res = await axiosInstance.get<AdminFeedListResponse>('/admin/feeds', { params });
  return res.data;
}

export function useFeeds(size = 20) {
  return useInfiniteQuery({
    queryKey: ['admin', 'feeds', { size }],
    queryFn: ({ pageParam }) =>
      getFeeds({ cursor: pageParam as string | undefined, size }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
