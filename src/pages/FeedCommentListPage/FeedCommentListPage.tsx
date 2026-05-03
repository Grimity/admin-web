import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useFeedComments } from '@/api/feedComments/getFeedComments';
import { deleteFeedComment } from '@/api/feedComments/deleteFeedComment';
import { FeedCommentRow } from '@/components/FeedCommentRow/FeedCommentRow';
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';
import styles from './FeedCommentListPage.module.scss';

export function FeedCommentListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
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

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: deleteFeedComment,
    onSuccess: () => {
      setPendingDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['admin', 'feed-comments'] });
    },
    onError: (err) => {
      setPendingDeleteId(null);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        alert('이미 삭제된 댓글입니다.');
        queryClient.invalidateQueries({ queryKey: ['admin', 'feed-comments'] });
        return;
      }
      alert('댓글 삭제 중 오류가 발생했습니다.');
    },
  });

  const handleDelete = (commentId: string) => {
    setPendingDeleteId(commentId);
  };

  const handleConfirmDelete = () => {
    if (!pendingDeleteId) return;
    deleteMutation.mutate(pendingDeleteId);
  };

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
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}

      {isFetchingNextPage && <div className={styles.loadingMore}>불러오는 중...</div>}

      {!hasNextPage && comments.length > 0 && (
        <div className={styles.endMessage}>마지막 페이지입니다.</div>
      )}

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="댓글 삭제"
        message="이 댓글을 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isPending={deleteMutation.isPending}
      />
    </div>
  );
}
