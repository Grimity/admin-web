import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import type { AdminPostListResponse, AdminPostTypeFilter } from '@/types/admin/post';

export interface GetPostsParams {
  cursor?: string;
  size?: number;
  type?: AdminPostTypeFilter;
}

export async function getPosts(params: GetPostsParams = {}): Promise<AdminPostListResponse> {
  const res = await axiosInstance.get<AdminPostListResponse>('/admin/posts', { params });
  return res.data;
}

export function usePosts(type: AdminPostTypeFilter = 'ALL', size = 20) {
  return useInfiniteQuery({
    queryKey: ['admin', 'posts', { size, type }],
    queryFn: ({ pageParam }) =>
      getPosts({ cursor: pageParam as string | undefined, size, type }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
  });
}
