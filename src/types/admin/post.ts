export type AdminPostType = 'NORMAL' | 'QUESTION' | 'FEEDBACK' | 'NOTICE';
export type AdminPostTypeFilter = AdminPostType | 'ALL';

export interface AdminPostAuthor {
  id: string;
  name: string;
  url: string;
  image: string | null;
}

export interface AdminPostListItem {
  id: string;
  type: AdminPostType;
  title: string;
  thumbnail: string | null;
  createdAt: string;
  viewCount: number;
  commentCount: number;
  author: AdminPostAuthor;
}

export interface AdminPostListResponse {
  nextCursor: string | null;
  posts: AdminPostListItem[];
}

export interface AdminPostDetail {
  id: string;
  type: AdminPostType;
  title: string;
  content: string;
  thumbnail: string | null;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author: AdminPostAuthor;
}

export const POST_TYPE_LABEL: Record<AdminPostType, string> = {
  NORMAL: '일반',
  QUESTION: '질문',
  FEEDBACK: '피드백',
  NOTICE: '공지',
};

export const POST_TYPE_FILTER_OPTIONS: { value: AdminPostTypeFilter; label: string }[] = [
  { value: 'ALL', label: '전체' },
  { value: 'NORMAL', label: '일반' },
  { value: 'QUESTION', label: '질문' },
  { value: 'FEEDBACK', label: '피드백' },
  { value: 'NOTICE', label: '공지' },
];
