import { axiosInstance } from '@/api/axiosInstance';
import type { PresignedUrlRequest, PresignedUrlResponse } from '@/types/admin/image';

export async function postPresignedUrl(
  payload: PresignedUrlRequest
): Promise<PresignedUrlResponse> {
  const res = await axiosInstance.post<PresignedUrlResponse>('/images/get-upload-url', payload);
  return res.data;
}
