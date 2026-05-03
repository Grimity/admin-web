export interface AdminFeedAuthor {
  id: string;
  name: string;
  image: string | null;
  url: string;
}

export interface AdminFeedListItem {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author: AdminFeedAuthor;
}

export interface AdminFeedListResponse {
  nextCursor: string | null;
  feeds: AdminFeedListItem[];
}

export interface AdminFeedDetail {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  content: string;
  tags: string[];
  author: AdminFeedAuthor;
  album: { id: string; name: string } | null;
}
