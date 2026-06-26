import { useLayoutEffect, useRef, type RefObject } from "react";

const WIDTH_TRANSITION = "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)";
const MOBILE_MEDIA_QUERY = "(max-width: 639px)";

function clearInlineWidth(element: HTMLElement) {
  element.style.width = "";
  element.style.transition = "";
  element.classList.remove("site-island--resizing");
}

function useAnimatedWidth(
  ref: RefObject<HTMLElement | null>,
  syncKey?: unknown,
) {
  const committedWidthRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    const mediaQuery = window.matchMedia(MOBILE_MEDIA_QUERY);

    if (mediaQuery.matches) {
      clearInlineWidth(element);
      committedWidthRef.current = null;
      return;
    }

    let removeTransitionListener: (() => void) | undefined;

    const syncWidth = () => {
      removeTransitionListener?.();
      removeTransitionListener = undefined;

      if (mediaQuery.matches) {
        clearInlineWidth(element);
        committedWidthRef.current = null;
        return;
      }

      element.style.width = "auto";
      const nextWidth = element.getBoundingClientRect().width;

      if (isFirstRenderRef.current) {
        isFirstRenderRef.current = false;
        committedWidthRef.current = nextWidth;
        return;
      }

      const previousWidth = committedWidthRef.current ?? nextWidth;

      if (Math.abs(previousWidth - nextWidth) < 0.5) {
        committedWidthRef.current = nextWidth;
        return;
      }

      element.classList.add("site-island--resizing");
      element.style.width = `${previousWidth}px`;
      element.style.transition = WIDTH_TRANSITION;

      requestAnimationFrame(() => {
        element.style.width = `${nextWidth}px`;
      });

      const finish = () => {
        clearInlineWidth(element);
        committedWidthRef.current = nextWidth;
      };

      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.target !== element || event.propertyName !== "width") {
          return;
        }

        element.removeEventListener("transitionend", handleTransitionEnd);
        removeTransitionListener = undefined;
        finish();
      };

      element.addEventListener("transitionend", handleTransitionEnd);
      removeTransitionListener = () => {
        element.removeEventListener("transitionend", handleTransitionEnd);
      };
    };

    syncWidth();
    mediaQuery.addEventListener("change", syncWidth);

    return () => {
      removeTransitionListener?.();
      mediaQuery.removeEventListener("change", syncWidth);
    };
  }, [ref, syncKey]);
}

export default useAnimatedWidth;
