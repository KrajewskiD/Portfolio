import type { ReactNode } from "react";

import AdminButton from "./AdminButton";
import AdminDeleteButton from "./AdminDeleteButton";
import type { AdminSortableDragHandleProps } from "./AdminSortableList";
import arrowDownIcon from "@shared/assets/icons/arrow-down.svg";

type AdminExpandableSettingRowProps = {
  title: string;
  isExpanded: boolean;
  disabled?: boolean;
  nested?: boolean;
  dragHandle?: AdminSortableDragHandleProps;
  onToggle: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  deleteLabel?: string;
  children: ReactNode;
};

function AdminExpandableSettingRow({
  title,
  isExpanded,
  disabled = false,
  nested = false,
  dragHandle,
  onToggle,
  onDelete,
  deleteDisabled = false,
  deleteLabel = "Usuń",
  children,
}: AdminExpandableSettingRowProps) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border bg-neutral-900/50",
        nested ? "ml-4 border-white/5" : "border-white/10",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {dragHandle ? (
            <button
              type="button"
              className="admin-drag-handle"
              aria-label="Zmień kolejność"
              title="Przeciągnij, aby zmienić kolejność"
              draggable={dragHandle.draggable}
              disabled={!dragHandle.draggable}
              onDragStart={(event) => {
                event.dataTransfer.effectAllowed = "move";
                dragHandle.onDragStart();
              }}
              onDragEnd={dragHandle.onDragEnd}
            >
              <span aria-hidden className="admin-drag-handle__grip">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </span>
            </button>
          ) : null}

          <span className="min-w-0 truncate font-bold text-white">{title}</span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {onDelete ? (
            <AdminDeleteButton
              label={deleteLabel}
              disabled={disabled || deleteDisabled}
              onClick={onDelete}
            />
          ) : null}

          <AdminButton
            type="button"
            variant="secondary"
            disabled={disabled}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Zwiń" : "Rozwiń"}
            title={isExpanded ? "Zwiń" : "Rozwiń"}
            className="admin-icon-button"
            onClick={onToggle}
          >
            <img
              src={arrowDownIcon}
              alt=""
              aria-hidden
              className={[
                "h-4 w-4 brightness-0 invert transition-transform",
                isExpanded ? "rotate-180" : "",
              ].join(" ")}
            />
          </AdminButton>
        </div>
      </div>

      {isExpanded ? (
        <div className="border-t border-white/10 px-4 py-4">{children}</div>
      ) : null}
    </div>
  );
}

export default AdminExpandableSettingRow;
