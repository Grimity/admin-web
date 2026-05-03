import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { postLogin } from '@/api/auth/postLogin';
import { useAuthStore } from '@/states/authStore';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((s) => s.accessToken);
  const setToken = useAuthStore((s) => s.setToken);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      navigate('/feeds', { replace: true });
    }
  }, [accessToken, navigate]);

  const mutation = useMutation({
    mutationFn: postLogin,
    onSuccess: (data) => {
      setToken(data.accessToken);
      navigate('/feeds', { replace: true });
    },
    onError: (err) => {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        setErrorMsg('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else {
        setErrorMsg('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!id || !password) {
      setErrorMsg('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }
    mutation.mutate({ id, password });
  };

  return (
    <div className={styles.root}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Grimity Admin</h1>
        <p className={styles.subtitle}>운영자 로그인</p>

        <label className={styles.field}>
          <span className={styles.label}>아이디</span>
          <input
            className={styles.input}
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            autoComplete="username"
            disabled={mutation.isPending}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>비밀번호</span>
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            disabled={mutation.isPending}
          />
        </label>

        {errorMsg && <div className={styles.error}>{errorMsg}</div>}

        <button type="submit" className={styles.submit} disabled={mutation.isPending}>
          {mutation.isPending ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
