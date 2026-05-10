import { axiosInstance } from '@/api/axiosInstance';
import type { UpdateNoticePayload } from '@/types/admin/notice';

export async function putNotice(id: string, payload: UpdateNoticePayload): Promise<void> {
  await axiosInstance.put(`/admin/notices/${id}`, payload);
}
