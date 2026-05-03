import { axiosInstance } from '@/api/axiosInstance';

export async function deletePostComment(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/post-comments/${id}`);
}
