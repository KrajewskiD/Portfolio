import type { ReactNode } from "react";
import { useState } from "react";

export type AdminSortableDragHandleProps = {
  draggable: boolean;
  onDragStart: () => void;
  onDragEnd: () => void;
};

type AdminSortableListProps<T> = {
  items: T[];
  getItemId: (item: T) => string;
  onReorder: (items: T[]) => void;
  disabled?: boolean;
  children: (item: T, dragHandle: AdminSortableDragHandleProps) => ReactNode;
};

function AdminSortableList<T>({
  items,
  getItemId,
  onReorder,
  disabled = false,
  children,
}: AdminSortableListProps<T>) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function reorder(dragId: string, dropId: string) {
    const fromIndex = items.findIndex((item) => getItemId(item) === dragId);
    const toIndex = items.findIndex((item) => getItemId(item) === dropId);

    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
      return;
    }

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    onReorder(nextItems);
  }

  return (
    <div className="admin-stack">
      {items.map((item) => {
        const itemId = getItemId(item);
        const isDragging = draggedId === itemId;

        return (
          <div
            key={itemId}
            className={isDragging ? "opacity-50 transition" : "transition"}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverId(itemId);
            }}
            onDragLeave={() => {
              if (dragOverId === itemId) {
                setDragOverId(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();

              if (draggedId) {
                reorder(draggedId, itemId);
              }

              setDraggedId(null);
              setDragOverId(null);
            }}
          >
            {children(item, {
              draggable: !disabled,
              onDragStart: () => setDraggedId(itemId),
              onDragEnd: () => {
                setDraggedId(null);
                setDragOverId(null);
              },
            })}
          </div>
        );
      })}
    </div>
  );
}

export default AdminSortableList;
