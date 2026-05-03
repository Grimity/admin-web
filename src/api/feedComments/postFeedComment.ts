import { axiosInstance } from '@/api/axiosInstance';

export interface PostFeedCommentPayload {
  feedId: string;
  parentCommentId?: string;
  content: string;
  mentionedUserId?: string;
}

export async function postFeedComment(payload: PostFeedCommentPayload): Promise<void> {
  await axiosInstance.post('/admin/feed-comments', payload);
}
