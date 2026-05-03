import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { postNotice } from '@/api/notices/postNotice';
import { TinyMCEEditor } from '@/components/TinyMCEEditor/TinyMCEEditor';
import styles from './NoticeCreatePage.module.scss';

export function NoticeCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const mutation = useMutation({
    mutationFn: postNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/posts');
    },
  });

  const disabled = !title.trim() || !content.trim() || mutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    mutation.mutate({ title: title.trim(), content });
  };

  const errorMessage =
    mutation.error instanceof AxiosError
      ? (mutation.error.response?.data as { message?: string } | undefined)?.message ??
        mutation.error.message
      : (mutation.error as Error | null)?.message;

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>공지사항 작성</h1>
      </header>

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
          <div className={styles.error}>등록에 실패했습니다. {errorMessage}</div>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.submit} disabled={disabled}>
            {mutation.isPending ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </div>
  );
}
