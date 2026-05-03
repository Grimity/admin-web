import { axiosInstance } from '@/api/axiosInstance';
import type { CreateNoticePayload, CreateNoticeResponse } from '@/types/admin/notice';

export async function postNotice(payload: CreateNoticePayload): Promise<CreateNoticeResponse> {
  const res = await axiosInstance.post<CreateNoticeResponse>('/admin/notices', payload);
  return res.data;
}
