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
