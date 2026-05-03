import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useFeed } from '@/api/feeds/getFeed';
import { formatDateTime } from '@/utils/formatDate';
import styles from './FeedDetailPage.module.scss';

export function FeedDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useFeed(id);

  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;

  return (
    <div className={styles.root}>
      <Link to="/feeds" className={styles.backLink}>
        ← 목록으로
      </Link>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && isNotFound && (
        <div className={styles.notFound}>존재하지 않는 피드입니다.</div>
      )}

      {isError && !isNotFound && (
        <div className={styles.error}>
          피드를 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {data && (
        <article className={styles.article}>
          <header className={styles.header}>
            <h1 className={styles.title}>{data.title}</h1>
            <div className={styles.authorRow}>
              <div className={styles.author}>
                {data.author.image ? (
                  <img className={styles.avatar} src={data.author.image} alt="" />
                ) : (
                  <div className={styles.avatarEmpty} />
                )}
                <span className={styles.authorName}>{data.author.name}</span>
              </div>
              <span className={styles.date}>{formatDateTime(data.createdAt)}</span>
            </div>
          </header>

          <div className={styles.metaRow}>
            <span>조회 {data.viewCount.toLocaleString()}</span>
            <span>좋아요 {data.likeCount.toLocaleString()}</span>
            <span>댓글 {data.commentCount.toLocaleString()}</span>
            {data.album && <span className={styles.album}>앨범: {data.album.name}</span>}
          </div>

          {data.cards.length > 0 && (
            <div className={styles.cards}>
              {data.cards.map((src, i) => (
                <img key={i} className={styles.card} src={src} alt="" loading="lazy" />
              ))}
            </div>
          )}

          {data.content && <pre className={styles.content}>{data.content}</pre>}

          {data.tags.length > 0 && (
            <div className={styles.tags}>
              {data.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      )}
    </div>
  );
}
