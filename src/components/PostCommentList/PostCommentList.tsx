import { usePostComments } from '@/api/postComments/getPostComments';
import { formatDateTime } from '@/utils/formatDate';
import type {
  AdminPostChildComment,
  AdminPostComment,
  AdminPostCommentWriter,
} from '@/types/admin/postComment';
import type { PostCommentListProps } from './PostCommentList.types';
import styles from './PostCommentList.module.scss';

const DELETED_NAME = '(삭제된 사용자)';

function Avatar({ writer }: { writer: AdminPostCommentWriter | null }) {
  return writer?.image ? (
    <img className={styles.avatar} src={writer.image} alt="" />
  ) : (
    <div className={styles.avatarEmpty} />
  );
}

function CommentBody({
  writer,
  createdAt,
  likeCount,
  content,
  isDeleted = false,
  mentionedUser,
}: {
  writer: AdminPostCommentWriter | null;
  createdAt: string;
  likeCount: number;
  content: string;
  isDeleted?: boolean;
  mentionedUser?: AdminPostCommentWriter | null;
}) {
  return (
    <div className={styles.body}>
      <div className={styles.metaLine}>
        <span className={styles.writerName}>{writer?.name ?? DELETED_NAME}</span>
        <span className={styles.date}>{formatDateTime(createdAt)}</span>
        {isDeleted && <span className={styles.deletedBadge}>삭제됨</span>}
        <span className={styles.likeCount}>♥ {likeCount.toLocaleString()}</span>
      </div>
      {isDeleted ? (
        <p className={styles.deletedContent}>삭제된 댓글입니다.</p>
      ) : (
        <p className={styles.content}>
          {mentionedUser && (
            <span className={styles.mention}>@{mentionedUser.name}</span>
          )}
          {content}
        </p>
      )}
    </div>
  );
}

function ChildCommentItem({ comment }: { comment: AdminPostChildComment }) {
  return (
    <div className={styles.childRow}>
      <Avatar writer={comment.writer} />
      <CommentBody
        writer={comment.writer}
        createdAt={comment.createdAt}
        likeCount={comment.likeCount}
        content={comment.content}
        mentionedUser={comment.mentionedUser}
      />
    </div>
  );
}

function CommentItem({ comment }: { comment: AdminPostComment }) {
  return (
    <li className={styles.commentItem}>
      <div className={styles.commentRow}>
        <Avatar writer={comment.writer} />
        <CommentBody
          writer={comment.writer}
          createdAt={comment.createdAt}
          likeCount={comment.likeCount}
          content={comment.content}
          isDeleted={comment.isDeleted}
        />
      </div>
      {comment.childComments.length > 0 && (
        <div className={styles.children}>
          {comment.childComments.map((child) => (
            <ChildCommentItem key={child.id} comment={child} />
          ))}
        </div>
      )}
    </li>
  );
}

export function PostCommentList({ postId }: PostCommentListProps) {
  const { data, isLoading, isError, error } = usePostComments(postId);

  const totalCount = data
    ? data.reduce((sum, c) => sum + 1 + c.childComments.length, 0)
    : 0;

  return (
    <section className={styles.root}>
      <div className={styles.header}>
        <h2 className={styles.title}>댓글</h2>
        {data && <span className={styles.count}>{totalCount.toLocaleString()}개</span>}
      </div>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && (
        <div className={styles.error}>
          댓글을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {data && data.length === 0 && (
        <div className={styles.state}>아직 댓글이 없습니다.</div>
      )}

      {data && data.length > 0 && (
        <ul className={styles.list}>
          {data.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </ul>
      )}
    </section>
  );
}
