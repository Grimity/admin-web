import { formatDateTime } from '@/utils/formatDate';
import styles from './FeedCommentRow.module.scss';
import type { FeedCommentRowProps } from './FeedCommentRow.types';

export function FeedCommentRow({ comment, onClick, onDelete, isDeleting }: FeedCommentRowProps) {
  const { feed, writer } = comment;
  const isReply = comment.parentId !== null;

  return (
    <article
      className={styles.row}
      role="button"
      tabIndex={0}
      onClick={() => onClick(feed.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(feed.id);
        }
      }}
    >
      <div className={styles.thumbWrap}>
        {feed.thumbnail ? (
          <img className={styles.thumb} src={feed.thumbnail} alt="" loading="lazy" />
        ) : (
          <div className={styles.thumbEmpty} />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.metaLine}>
          {writer.image ? (
            <img className={styles.avatar} src={writer.image} alt="" />
          ) : (
            <div className={styles.avatarEmpty} />
          )}
          <span className={styles.writerName}>{writer.name}</span>
          {isReply && <span className={styles.replyBadge}>답글</span>}
          <span className={styles.date}>{formatDateTime(comment.createdAt)}</span>
        </div>
        <p className={styles.content}>{comment.content}</p>
        <div className={styles.feedLine}>
          <span className={styles.feedLabel}>피드</span>
          <span className={styles.feedTitle}>{feed.title}</span>
          <button
            type="button"
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(comment.id);
            }}
            disabled={isDeleting}
          >
            삭제
          </button>
        </div>
      </div>
    </article>
  );
}
