import { useFeedCommentsByFeed } from '@/api/feedComments/getFeedCommentsByFeed';
import { formatDateTime } from '@/utils/formatDate';
import type {
  AdminFeedChildComment,
  AdminFeedComment,
  AdminFeedCommentWriter,
} from '@/types/admin/feedComment';
import type { FeedCommentListProps } from './FeedCommentList.types';
import styles from './FeedCommentList.module.scss';

function Avatar({ writer }: { writer: AdminFeedCommentWriter }) {
  return writer.image ? (
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
  mentionedUser,
}: {
  writer: AdminFeedCommentWriter;
  createdAt: string;
  likeCount: number;
  content: string;
  mentionedUser?: AdminFeedCommentWriter | null;
}) {
  return (
    <div className={styles.body}>
      <div className={styles.metaLine}>
        <span className={styles.writerName}>{writer.name}</span>
        <span className={styles.date}>{formatDateTime(createdAt)}</span>
        <span className={styles.likeCount}>♥ {likeCount.toLocaleString()}</span>
      </div>
      <p className={styles.content}>
        {mentionedUser && <span className={styles.mention}>@{mentionedUser.name}</span>}
        {content}
      </p>
    </div>
  );
}

function ChildCommentItem({ comment }: { comment: AdminFeedChildComment }) {
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

function CommentItem({ comment }: { comment: AdminFeedComment }) {
  return (
    <li className={styles.commentItem}>
      <div className={styles.commentRow}>
        <Avatar writer={comment.writer} />
        <CommentBody
          writer={comment.writer}
          createdAt={comment.createdAt}
          likeCount={comment.likeCount}
          content={comment.content}
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

export function FeedCommentList({ feedId }: FeedCommentListProps) {
  const { data, isLoading, isError, error } = useFeedCommentsByFeed(feedId);

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

      {data && data.length === 0 && <div className={styles.state}>아직 댓글이 없습니다.</div>}

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
