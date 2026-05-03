import { axiosInstance } from '@/api/axiosInstance';

export async function deleteFeed(id: string): Promise<void> {
  await axiosInstance.delete(`/admin/feeds/${id}`);
}
