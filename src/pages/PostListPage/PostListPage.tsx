import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '@/api/posts/getPosts';
import { PostRow } from '@/components/PostRow/PostRow';
import {
  POST_TYPE_FILTER_OPTIONS,
  type AdminPostTypeFilter,
} from '@/types/admin/post';
import styles from './PostListPage.module.scss';

export function PostListPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<AdminPostTypeFilter>('ALL');
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } =
    usePosts(type);

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

  const posts = data?.pages.flatMap((p) => p.posts) ?? [];

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>게시글</h1>
        <div className={styles.controls}>
          <select
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value as AdminPostTypeFilter)}
            aria-label="게시글 타입 필터"
          >
            {POST_TYPE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className={styles.count}>총 {posts.length}개 로드됨</span>
        </div>
      </header>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && (
        <div className={styles.error}>
          게시글을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {!isLoading && !isError && posts.length === 0 && (
        <div className={styles.state}>표시할 게시글이 없습니다.</div>
      )}

      {posts.length > 0 && (
        <div className={styles.list}>
          {posts.map((post) => (
            <PostRow key={post.id} post={post} onClick={(id) => navigate(`/posts/${id}`)} />
          ))}
        </div>
      )}

      {hasNextPage && <div ref={sentinelRef} className={styles.sentinel} />}

      {isFetchingNextPage && <div className={styles.loadingMore}>불러오는 중...</div>}

      {!hasNextPage && posts.length > 0 && (
        <div className={styles.endMessage}>마지막 페이지입니다.</div>
      )}
    </div>
  );
}
