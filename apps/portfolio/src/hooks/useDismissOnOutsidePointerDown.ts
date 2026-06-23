import { useEffect, type RefObject } from "react";

function useDismissOnOutsidePointerDown(
  isActive: boolean,
  onDismiss: () => void,
  menuRef: RefObject<HTMLElement | null>,
  excludeRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!isActive) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (
        menuRef.current?.contains(target) ||
        excludeRef.current?.contains(target)
      ) {
        return;
      }

      onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isActive, onDismiss, menuRef, excludeRef]);
}

export default useDismissOnOutsidePointerDown;
