import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useAuthStore } from '@/states/authStore';
import styles from './AdminLayout.module.scss';

export function AdminLayout() {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [open, setOpen] = useState(!isMobile);
  const location = useLocation();
  const navigate = useNavigate();
  const clearToken = useAuthStore((s) => s.clearToken);

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) setOpen(false);
  }, [location.pathname, isMobile]);

  const handleLogout = () => {
    clearToken();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.root}>
      <Sidebar
        open={open}
        isMobile={isMobile}
        onClose={() => setOpen(false)}
        onLogout={handleLogout}
      />
      {isMobile && (
        <header className={styles.header}>
          <button
            type="button"
            className={styles.menuButton}
            onClick={() => setOpen((v) => !v)}
            aria-label="메뉴 열기"
          >
            <span />
            <span />
            <span />
          </button>
          <span className={styles.headerBrand}>Grimity Admin</span>
        </header>
      )}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
