import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usePost } from '@/api/posts/getPost';
import { putNotice } from '@/api/notices/putNotice';
import { TinyMCEEditor } from '@/components/TinyMCEEditor/TinyMCEEditor';
import styles from './NoticeEditPage.module.scss';

export function NoticeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = usePost(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const initialized = useRef(false);

  useEffect(() => {
    if (data && !initialized.current) {
      setTitle(data.title);
      setContent(data.content);
      initialized.current = true;
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: { title: string; content: string }) =>
      putNotice(id as string, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'post', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] });
      navigate(`/notices/${id}`);
    },
  });

  const isNotFound = axios.isAxiosError(error) && error.response?.status === 404;
  const disabled = !title.trim() || !content.trim() || mutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !id) return;
    mutation.mutate({ title: title.trim(), content });
  };

  const errorMessage =
    mutation.error instanceof AxiosError
      ? (mutation.error.response?.data as { message?: string } | undefined)?.message ??
        mutation.error.message
      : (mutation.error as Error | null)?.message;

  return (
    <div className={styles.root}>
      <Link to={id ? `/notices/${id}` : '/notices'} className={styles.backLink}>
        ← 상세로 돌아가기
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>공지사항 수정</h1>
      </header>

      {isLoading && <div className={styles.state}>불러오는 중...</div>}

      {isError && isNotFound && (
        <div className={styles.notFound}>존재하지 않는 공지사항입니다.</div>
      )}

      {isError && !isNotFound && (
        <div className={styles.error}>
          공지사항을 불러오지 못했습니다. {(error as Error)?.message}
        </div>
      )}

      {data && (
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            className={styles.titleInput}
            type="text"
            placeholder="제목 (1~32자)"
            maxLength={32}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TinyMCEEditor value={content} onChange={setContent} />

          {mutation.isError && (
            <div className={styles.error}>수정에 실패했습니다. {errorMessage}</div>
          )}

          <div className={styles.actions}>
            <button type="submit" className={styles.submit} disabled={disabled}>
              {mutation.isPending ? '수정 중...' : '수정'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
