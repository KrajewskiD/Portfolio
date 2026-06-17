import type { ReactNode } from "react";

type AdminImagePreviewCornerProps = {
  position: "top-left" | "bottom-right";
  children: ReactNode;
};

function AdminImagePreviewCorner({
  position,
  children,
}: AdminImagePreviewCornerProps) {
  return (
    <div
      className={[
        "admin-image-preview__corner",
        position === "top-left"
          ? "admin-image-preview__corner--top-left"
          : "admin-image-preview__corner--bottom-right",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export default AdminImagePreviewCorner;
