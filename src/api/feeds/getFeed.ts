import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import type { AdminFeedDetail } from '@/types/admin/feed';

export async function getFeed(id: string): Promise<AdminFeedDetail> {
  const res = await axiosInstance.get<AdminFeedDetail>(`/admin/feeds/${id}`);
  return res.data;
}

export function useFeed(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'feed', id],
    queryFn: () => getFeed(id as string),
    enabled: !!id,
  });
}
