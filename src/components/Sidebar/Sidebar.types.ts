export interface SidebarNavItem {
  to: string;
  label: string;
}

export interface SidebarProps {
  open: boolean;
  isMobile: boolean;
  onClose: () => void;
  onLogout: () => void;
}
