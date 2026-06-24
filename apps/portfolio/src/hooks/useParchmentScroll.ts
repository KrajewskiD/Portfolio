import { type RefObject, useEffect } from "react";

const FLAT_LINE = 0.7;
const MAX_ANGLE = 15;
const PAGE_BLEND_DISTANCE = 360;

const PARCHMENT_ITEM_SELECTOR = [
  ".site-section--hero",
  ".site-section--default",
].join(", ");

function smoothstep(value: number): number {
  const t = Math.min(Math.max(value, 0), 1);
  return t * t * (3 - 2 * t);
}

function computeRotateX(y: number, scrollY: number): number {
  const pageBlend = smoothstep(scrollY / PAGE_BLEND_DISTANCE);

  if (pageBlend <= 0) {
    return 0;
  }

  const angle =
    (y < FLAT_LINE
      ? -MAX_ANGLE * smoothstep(1 - y / FLAT_LINE)
      : MAX_ANGLE * smoothstep((y - FLAT_LINE) / (1 - FLAT_LINE))) * pageBlend;

  return angle;
}

function useParchmentScroll(tiltRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const update = () => {
      const tiltRoot = tiltRef.current;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;

      if (!tiltRoot || prefersReducedMotion) {
        return;
      }

      const elements = tiltRoot.querySelectorAll<HTMLElement>(
        PARCHMENT_ITEM_SELECTOR,
      );

      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const y = (rect.top + rect.height * 0.5) / viewportHeight;
        const angle = computeRotateX(y, scrollY);

        element.style.transform = `rotateX(${angle.toFixed(3)}deg)`;
      });
    };

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    const bootFrame = requestAnimationFrame(update);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const observer = new MutationObserver(schedule);
    const tiltRoot = tiltRef.current;

    if (tiltRoot) {
      observer.observe(tiltRoot, { childList: true, subtree: true });
    }

    return () => {
      cancelAnimationFrame(bootFrame);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();

      tiltRoot
        ?.querySelectorAll<HTMLElement>(PARCHMENT_ITEM_SELECTOR)
        .forEach((element) => {
          element.style.removeProperty("transform");
        });
    };
  }, [tiltRef]);
}

export default useParchmentScroll;
