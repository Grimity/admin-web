export interface AdminPostCommentWriter {
  id: string;
  name: string;
  url: string;
  image: string | null;
}

export interface AdminPostChildComment {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  writer: AdminPostCommentWriter | null;
  mentionedUser: AdminPostCommentWriter | null;
}

export interface AdminPostComment {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isDeleted: boolean;
  writer: AdminPostCommentWriter | null;
  childComments: AdminPostChildComment[];
}
