import { formatDateTime } from '@/utils/formatDate';
import { POST_TYPE_LABEL } from '@/types/admin/post';
import styles from './PostRow.module.scss';
import type { PostRowProps } from './PostRow.types';

export function PostRow({ post, onClick }: PostRowProps) {
  return (
    <article
      className={styles.row}
      role="button"
      tabIndex={0}
      onClick={() => onClick(post.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(post.id);
        }
      }}
    >
      <div className={styles.thumbWrap}>
        {post.thumbnail ? (
          <img className={styles.thumb} src={post.thumbnail} alt="" loading="lazy" />
        ) : (
          <div className={styles.thumbEmpty} />
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          <span className={`${styles.badge} ${styles[`badge_${post.type}`]}`}>
            {POST_TYPE_LABEL[post.type]}
          </span>
          <span className={styles.title}>{post.title}</span>
        </div>
        <div className={styles.author}>{post.author.name}</div>
        <div className={styles.meta}>
          <span>조회 {post.viewCount.toLocaleString()}</span>
          <span>댓글 {post.commentCount.toLocaleString()}</span>
          <span className={styles.date}>{formatDateTime(post.createdAt)}</span>
        </div>
      </div>
    </article>
  );
}
