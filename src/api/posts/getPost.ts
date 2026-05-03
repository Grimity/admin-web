import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import type { AdminPostDetail } from '@/types/admin/post';

export async function getPost(id: string): Promise<AdminPostDetail> {
  const res = await axiosInstance.get<AdminPostDetail>(`/admin/posts/${id}`);
  return res.data;
}

export function usePost(id: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'post', id],
    queryFn: () => getPost(id as string),
    enabled: !!id,
  });
}
