import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePosts } from '@/api/posts/getPosts';
import { PostRow } from '@/components/PostRow/PostRow';
import styles from './NoticeListPage.module.scss';

export function NoticeListPage() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    usePosts('NOTICE');

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

  const notices = data?.pages.flatMap((p) => p.posts) ?? [];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>공지사항</h1>
        <div className={styles.controls}>
          <span className={styles.count}>총 {notices.length}개 로드됨</span>
          <Link to="/notices/new" className={styles.createButton}>
            공지 작성
          </Link>
        </div>
      </header>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && (
        <div className={styles.error}>
          공지사항을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {!isLoading && !isError && notices.length === 0 && (
        <div className={styles.state}>표시할 공지사항이 없습니다.</div>
      )}

      {notices.length > 0 && (
        <div className={styles.list}>
          {notices.map((notice) => (
            <PostRow
              key={notice.id}
              post={notice}
              onClick={(id) => navigate(`/notices/${id}`)}
            />
          ))}
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}

      {isFetchingNextPage && <div className={styles.loadingMore}>불러오는 중...</div>}

      {!hasNextPage && notices.length > 0 && (
        <div className={styles.endMessage}>마지막 페이지입니다.</div>
      )}
    </div>
  );
}
