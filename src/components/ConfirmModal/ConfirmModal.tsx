import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './ConfirmModal.module.scss';
import type { ConfirmModalProps } from './ConfirmModal.types';

export function ConfirmModal({
  open,
  title,
  message,
  confirmText = '삭제',
  cancelText = '취소',
  onConfirm,
  onCancel,
  isPending = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isPending) onCancel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isPending, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      className={styles.backdrop}
      onClick={() => {
        if (!isPending) onCancel();
      }}
      role="presentation"
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.body}>
          <h2 id="confirm-modal-title" className={styles.title}>
            {title}
          </h2>
          <p className={styles.message}>{message}</p>
        </div>
        <div className={styles.footer}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
            disabled={isPending}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={styles.confirmButton}
            onClick={onConfirm}
            disabled={isPending}
            autoFocus
          >
            {isPending ? '삭제 중...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
