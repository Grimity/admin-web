import { axiosInstance } from '@/api/axiosInstance';

export interface PostPostCommentPayload {
  postId: string;
  parentCommentId?: string;
  content: string;
  mentionedUserId?: string;
}

export async function postPostComment(payload: PostPostCommentPayload): Promise<void> {
  await axiosInstance.post('/admin/post-comments', payload);
}
