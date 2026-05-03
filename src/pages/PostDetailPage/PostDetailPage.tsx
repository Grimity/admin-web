import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePost } from '@/api/posts/getPost';
import { deletePost } from '@/api/posts/deletePost';
import { PostCommentList } from '@/components/PostCommentList/PostCommentList';
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';
import { formatDateTime } from '@/utils/formatDate';
import { POST_TYPE_LABEL } from '@/types/admin/post';
import styles from './PostDetailPage.module.scss';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = usePost(id);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;

  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      setConfirmOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      navigate('/posts');
    },
    onError: (err) => {
      setConfirmOpen(false);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        alert('이미 삭제된 게시글입니다.');
        navigate('/posts');
        return;
      }
      alert('게시글 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleConfirmDelete = () => {
    if (!data) return;
    deleteMutation.mutate(data.id);
  };

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
              <button
                type="button"
                className={styles.deleteButton}
                onClick={() => setConfirmOpen(true)}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? '삭제 중...' : '게시글 삭제'}
              </button>
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

      <ConfirmModal
        open={confirmOpen}
        title="게시글 삭제"
        message={'이 게시글을 삭제하시겠습니까?\n댓글/좋아요/저장도 모두 함께 삭제됩니다.'}
        confirmText="게시글 삭제"
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
