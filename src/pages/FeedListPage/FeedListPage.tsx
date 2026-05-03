import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFeeds } from '@/api/feeds/getFeeds';
import { FeedRow } from '@/components/FeedRow/FeedRow';
import styles from './FeedListPage.module.scss';

export function FeedListPage() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    useFeeds();

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

  const feeds = data?.pages.flatMap((p) => p.feeds) ?? [];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>피드</h1>
        <span className={styles.count}>총 {feeds.length}개 로드됨</span>
      </header>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && (
        <div className={styles.error}>
          피드를 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {!isLoading && !isError && feeds.length === 0 && (
        <div className={styles.state}>표시할 피드가 없습니다.</div>
      )}

      {feeds.length > 0 && (
        <div className={styles.list}>
          {feeds.map((feed) => (
            <FeedRow key={feed.id} feed={feed} onClick={(id) => navigate(`/feeds/${id}`)} />
          ))}
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}

      {isFetchingNextPage && <div className={styles.loadingMore}>불러오는 중...</div>}

      {!hasNextPage && feeds.length > 0 && (
        <div className={styles.endMessage}>마지막 페이지입니다.</div>
      )}
    </div>
  );
}
