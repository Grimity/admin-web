import { formatDateTime } from '@/utils/formatDate';
import styles from './FeedRow.module.scss';
import type { FeedRowProps } from './FeedRow.types';

export function FeedRow({ feed, onClick }: FeedRowProps) {
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
        <div className={styles.title}>{feed.title}</div>
        <div className={styles.author}>{feed.author.name}</div>
        <div className={styles.meta}>
          <span>조회 {feed.viewCount.toLocaleString()}</span>
          <span>좋아요 {feed.likeCount.toLocaleString()}</span>
          <span>댓글 {feed.commentCount.toLocaleString()}</span>
          <span className={styles.date}>{formatDateTime(feed.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
