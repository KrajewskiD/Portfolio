import type { ReactNode } from "react";

import AdminButton from "./AdminButton";
import AdminDeleteButton from "./AdminDeleteButton";
import AdminInlineEditableTitle from "./AdminInlineEditableTitle";
import type { AdminSortableDragHandleProps } from "./AdminSortableList";
import arrowDownIcon from "@shared/assets/icons/arrow-down.svg";

type AdminEditableTitleProps = {
  id: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  onChange: (value: string) => void;
};

type AdminExpandableSettingRowProps = {
  title?: string;
  editableTitle?: AdminEditableTitleProps;
  isExpanded?: boolean;
  disabled?: boolean;
  nested?: boolean;
  dragHandle?: AdminSortableDragHandleProps;
  onToggle?: () => void;
  onDelete?: () => void;
  deleteDisabled?: boolean;
  deleteLabel?: string;
  children?: ReactNode;
};

function AdminSettingDragHandle({
  dragHandle,
}: {
  dragHandle: AdminSortableDragHandleProps;
}) {
  return (
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
  );
}

function AdminSettingRowTitle({
  title,
  editableTitle,
  disabled,
}: {
  title: string;
  editableTitle?: AdminEditableTitleProps;
  disabled: boolean;
}) {
  if (editableTitle) {
    return <AdminInlineEditableTitle {...editableTitle} disabled={disabled} />;
  }

  return <span className="min-w-0 truncate font-bold text-white">{title}</span>;
}

function AdminSettingRowActions({
  disabled,
  deleteDisabled,
  deleteLabel,
  isExpandable,
  isExpanded,
  onDelete,
  onToggle,
}: Pick<
  AdminExpandableSettingRowProps,
  "disabled" | "deleteDisabled" | "isExpanded" | "onDelete" | "onToggle"
> & {
  deleteLabel: string;
  isExpandable: boolean;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      {onDelete ? (
        <AdminDeleteButton
          label={deleteLabel}
          disabled={disabled || deleteDisabled}
          onClick={onDelete}
        />
      ) : null}

      {isExpandable ? (
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
      ) : null}
    </div>
  );
}

function AdminSettingRowHeader({
  title,
  editableTitle,
  disabled,
  dragHandle,
  isExpandable,
  isExpanded,
  onDelete,
  onToggle,
  deleteDisabled,
  deleteLabel,
}: AdminExpandableSettingRowProps & {
  isExpandable: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        {dragHandle ? <AdminSettingDragHandle dragHandle={dragHandle} /> : null}

        <AdminSettingRowTitle
          title={title ?? ""}
          editableTitle={editableTitle}
          disabled={disabled ?? false}
        />
      </div>

      <AdminSettingRowActions
        disabled={disabled}
        deleteDisabled={deleteDisabled}
        deleteLabel={deleteLabel ?? "Usuń"}
        isExpandable={isExpandable}
        isExpanded={isExpanded}
        onDelete={onDelete}
        onToggle={onToggle}
      />
    </div>
  );
}

function AdminExpandableSettingRow({
  title = "",
  editableTitle,
  isExpanded = false,
  disabled = false,
  nested = false,
  dragHandle,
  onToggle,
  onDelete,
  deleteDisabled = false,
  deleteLabel = "Usuń",
  children,
}: AdminExpandableSettingRowProps) {
  const isExpandable = children != null && onToggle != null;

  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border bg-neutral-900/50",
        nested ? "ml-4 border-white/5" : "border-white/10",
      ].join(" ")}
    >
      <AdminSettingRowHeader
        title={title}
        editableTitle={editableTitle}
        isExpanded={isExpanded}
        disabled={disabled}
        dragHandle={dragHandle}
        onToggle={onToggle}
        onDelete={onDelete}
        deleteDisabled={deleteDisabled}
        deleteLabel={deleteLabel}
        isExpandable={isExpandable}
      />

      {isExpandable && isExpanded ? (
        <div className="border-t border-white/10 px-4 py-4">{children}</div>
      ) : null}
    </div>
  );
}

export default AdminExpandableSettingRow;
