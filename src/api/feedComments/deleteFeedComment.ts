import { axiosInstance } from '@/api/axiosInstance';

export async function deleteFeedComment(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/feed-comments/${id}`);
}
