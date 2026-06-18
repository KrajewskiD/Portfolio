import type { ReactNode } from "react";

type AdminModalProps = {
  isOpen: boolean;
  children: ReactNode;
  labelledBy?: string;
  busy?: boolean;
  onBackdropClick?: () => void;
};

function AdminModal({
  isOpen,
  children,
  labelledBy,
  busy = false,
  onBackdropClick,
}: AdminModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-busy={busy}
      onClick={onBackdropClick}
    >
      <div
        className="w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default AdminModal;
