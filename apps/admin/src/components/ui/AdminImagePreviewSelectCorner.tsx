import type { ReactNode } from "react";

import AdminImagePreviewCorner from "./AdminImagePreviewCorner";

type AdminImagePreviewSelectCornerProps = {
  children: ReactNode;
};

function AdminImagePreviewSelectCorner({
  children,
}: AdminImagePreviewSelectCornerProps) {
  return (
    <AdminImagePreviewCorner position="bottom-right">
      <div className="admin-image-preview__corner-actions">{children}</div>
    </AdminImagePreviewCorner>
  );
}

export default AdminImagePreviewSelectCorner;
