import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/api/axiosInstance';
import type { AdminPostComment } from '@/types/admin/postComment';

export async function getPostComments(postId: string): Promise<AdminPostComment[]> {
  const res = await axiosInstance.get<AdminPostComment[]>('/admin/post-comments', {
    params: { postId },
  });
  return res.data;
}

export function usePostComments(postId: string | undefined) {
  return useQuery({
    queryKey: ['admin', 'post-comments', postId],
    queryFn: () => getPostComments(postId as string),
    enabled: !!postId,
  });
}
