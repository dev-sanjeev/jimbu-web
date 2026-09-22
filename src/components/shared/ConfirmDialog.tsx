import { useEffect, useRef } from 'react';
import { Text } from '@/shared/Text';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => onCancel();
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onCancel]);

  const confirmBtnClass =
    variant === 'destructive'
      ? 'flex-1 h-11 rounded-xl bg-destructive text-white font-semibold text-label cursor-pointer border-0'
      : 'flex-1 h-11 rounded-xl bg-accent text-white font-semibold text-label cursor-pointer border-0';

  return (
    <dialog
      ref={dialogRef}
      onClick={(e) => {
        if (e.target === dialogRef.current) onCancel();
      }}
      className={`border-none rounded-card p-0 w-11/12 max-w-dialog-sm overflow-hidden${open ? ' flex flex-col' : ''}`}
    >
      <div className="bg-card p-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Text variant="h3" className="text-foreground">
            {title}
          </Text>
          <Text variant="body" className="text-muted-foreground">
            {message}
          </Text>
        </div>

        <div className="flex flex-row gap-3 mt-1">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 h-11 rounded-xl bg-muted text-foreground font-semibold text-label cursor-pointer border-0"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={confirmBtnClass}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
