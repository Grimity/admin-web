export interface AdminFeedCommentWriter {
  id: string;
  name: string;
  url: string;
  image: string | null;
}

export interface AdminFeedChildComment {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  writer: AdminFeedCommentWriter;
  mentionedUser: AdminFeedCommentWriter | null;
}

export interface AdminFeedComment {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  writer: AdminFeedCommentWriter;
  childComments: AdminFeedChildComment[];
}

export interface AdminFeedCommentListItemFeed {
  id: string;
  title: string;
  thumbnail: string | null;
}

export interface AdminFeedCommentListItem {
  id: string;
  content: string;
  createdAt: string;
  parentId: string | null;
  writer: AdminFeedCommentWriter;
  feed: AdminFeedCommentListItemFeed;
}

export interface AdminFeedCommentListResponse {
  nextCursor: string | null;
  comments: AdminFeedCommentListItem[];
}
