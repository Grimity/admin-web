import { axiosInstance } from '@/api/axiosInstance';

export interface PostLoginPayload {
  id: string;
  password: string;
}

export interface PostLoginResponse {
  accessToken: string;
}

export async function postLogin(payload: PostLoginPayload): Promise<PostLoginResponse> {
  const res = await axiosInstance.post<PostLoginResponse>('/admin/login', payload);
  return res.data;
}
