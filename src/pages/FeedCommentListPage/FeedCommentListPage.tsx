import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeedComments } from '@/api/feedComments/getFeedComments';
import { FeedCommentRow } from '@/components/FeedCommentRow/FeedCommentRow';
import styles from './FeedCommentListPage.module.scss';

export function FeedCommentListPage() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useFeedComments();

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const comments = data?.pages.flatMap((p) => p.comments) ?? [];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>피드 댓글</h1>
        <span className={styles.count}>총 {comments.length}개 로드됨</span>
      </header>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && (
        <div className={styles.error}>
          댓글을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {!isLoading && !isError && comments.length === 0 && (
        <div className={styles.state}>표시할 댓글이 없습니다.</div>
      )}

      {comments.length > 0 && (
        <div className={styles.list}>
          {comments.map((comment) => (
            <FeedCommentRow
              key={comment.id}
              comment={comment}
              onClick={(feedId) => navigate(`/feeds/${feedId}`)}
            />
          ))}
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}

      {isFetchingNextPage && <div className={styles.loadingMore}>불러오는 중...</div>}

      {!hasNextPage && comments.length > 0 && (
        <div className={styles.endMessage}>마지막 페이지입니다.</div>
      )}
    </div>
  );
}
