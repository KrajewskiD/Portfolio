import { useLayoutEffect, useRef, type RefObject } from "react";

const WIDTH_TRANSITION = "width 0.35s cubic-bezier(0.4, 0, 0.2, 1)";

function useAnimatedWidth(
  ref: RefObject<HTMLElement | null>,
  dependencies: unknown[],
) {
  const committedWidthRef = useRef<number | null>(null);
  const isFirstRenderRef = useRef(true);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
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
      element.style.width = "";
      element.style.transition = "";
      element.classList.remove("site-island--resizing");
      committedWidthRef.current = nextWidth;
    };

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== element || event.propertyName !== "width") {
        return;
      }

      element.removeEventListener("transitionend", handleTransitionEnd);
      finish();
    };

    element.addEventListener("transitionend", handleTransitionEnd);

    return () => {
      element.removeEventListener("transitionend", handleTransitionEnd);
    };
  }, dependencies);
}

export default useAnimatedWidth;
