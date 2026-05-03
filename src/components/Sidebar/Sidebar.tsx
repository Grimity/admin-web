import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.scss';
import type { SidebarNavItem, SidebarProps } from './Sidebar.types';

const NAV_ITEMS: SidebarNavItem[] = [
  { to: '/feeds', label: '피드' },
  { to: '/feed-comments', label: '피드 댓글' },
  { to: '/posts', label: '게시글' },
  { to: '/post-comments', label: '게시글 댓글' },
  { to: '/notices', label: '공지사항' },
];

export function Sidebar({ open, isMobile, onClose, onLogout }: SidebarProps) {
  const showBackdrop = isMobile && open;

  return (
    <>
      {showBackdrop && <div className={styles.backdrop} onClick={onClose} />}
      <aside
        className={[
          styles.sidebar,
          isMobile ? styles.sidebarMobile : '',
          isMobile && !open ? styles.sidebarClosed : '',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden={isMobile && !open}
      >
        <div className={styles.brand}>Grimity Admin</div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [styles.navItem, isActive ? styles.navItemActive : ''].filter(Boolean).join(' ')
              }
              onClick={isMobile ? onClose : undefined}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button type="button" className={styles.logout} onClick={onLogout}>
          로그아웃
        </button>
      </aside>
    </>
  );
}
