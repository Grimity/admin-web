import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { usePost } from '@/api/posts/getPost';
import { PostCommentList } from '@/components/PostCommentList/PostCommentList';
import { formatDateTime } from '@/utils/formatDate';
import { POST_TYPE_LABEL } from '@/types/admin/post';
import styles from './PostDetailPage.module.scss';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = usePost(id);

  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;

  return (
    <div className={styles.root}>
      <Link to="/posts" className={styles.backLink}>
        ← 목록으로
      </Link>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && isNotFound && (
        <div className={styles.notFound}>존재하지 않는 게시글입니다.</div>
      )}

      {isError && !isNotFound && (
        <div className={styles.error}>
          게시글을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {data && (
        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.titleRow}>
              <span className={`${styles.badge} ${styles[`badge_${data.type}`]}`}>
                {POST_TYPE_LABEL[data.type]}
              </span>
              <h1 className={styles.title}>{data.title}</h1>
            </div>
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
          </div>

          {data.thumbnail && (
            <img className={styles.thumbnail} src={data.thumbnail} alt="" loading="lazy" />
          )}

          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: data.content }}
          />
        </article>
      )}

      {data && <PostCommentList postId={data.id} />}
    </div>
  );
}
