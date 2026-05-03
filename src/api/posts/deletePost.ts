import { axiosInstance } from '@/api/axiosInstance';

export async function deletePost(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/posts/${id}`);
}
