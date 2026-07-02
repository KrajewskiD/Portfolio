import { useEffect, type RefObject } from "react";

const MOBILE_MAX_WIDTH_PX = 639;
const BASE_BOTTOM_REM = 1;
const FOOTER_GAP_REM = 1;

type UseFixedBottomAboveFooterOptions = {
  footerSelector?: string;
  enabled?: boolean;
};

export function useFixedBottomAboveFooter(
  elementRef: RefObject<HTMLElement | null>,
  {
    footerSelector = ".site-footer",
    enabled = true,
  }: UseFixedBottomAboveFooterOptions = {},
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = elementRef.current;
    if (!element) {
      return;
    }

    const mediaQuery = window.matchMedia(
      `(max-width: ${MOBILE_MAX_WIDTH_PX}px)`,
    );

    const update = () => {
      if (!mediaQuery.matches) {
        element.style.removeProperty("--site-chrome-info-bottom");
        return;
      }

      const footer = document.querySelector<HTMLElement>(footerSelector);
      const rootFontSize =
        Number.parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        ) || 16;
      const baseBottomPx = BASE_BOTTOM_REM * rootFontSize;
      const gapPx = FOOTER_GAP_REM * rootFontSize;

      if (!footer) {
        element.style.setProperty(
          "--site-chrome-info-bottom",
          `${BASE_BOTTOM_REM}rem`,
        );
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (footerRect.top < viewportHeight) {
        const liftedBottomPx = viewportHeight - footerRect.top + gapPx;
        const bottomPx = Math.max(baseBottomPx, liftedBottomPx);
        element.style.setProperty(
          "--site-chrome-info-bottom",
          `${bottomPx / rootFontSize}rem`,
        );
        return;
      }

      element.style.setProperty(
        "--site-chrome-info-bottom",
        `${BASE_BOTTOM_REM}rem`,
      );
    };

    update();

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    const footer = document.querySelector<HTMLElement>(footerSelector);
    const resizeObserver =
      footer && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(update)
        : null;

    if (footer) {
      resizeObserver?.observe(footer);
    }

    mediaQuery.addEventListener("change", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mediaQuery.removeEventListener("change", update);
      resizeObserver?.disconnect();
      element.style.removeProperty("--site-chrome-info-bottom");
    };
  }, [elementRef, enabled, footerSelector]);
}
