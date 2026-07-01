import { useCallback, useEffect, useRef, useState } from "react";

const SCROLL_DELTA = 6;
const TOP_REVEAL_OFFSET = 48;
const IDLE_REVEAL_DELAY_MS = 140;

type UseNavbarScrollRevealOptions = {
  isDisabled?: boolean;
};

export function useNavbarScrollReveal({
  isDisabled = false,
}: UseNavbarScrollRevealOptions = {}) {
  const [isHidden, setIsHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const lastScrollY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearIdleTimer = useCallback(() => {
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  const scheduleIdleReveal = useCallback(() => {
    clearIdleTimer();
    idleTimer.current = setTimeout(() => {
      setIsHidden(false);
    }, IDLE_REVEAL_DELAY_MS);
  }, [clearIdleTimer]);

  useEffect(() => {
    if (isDisabled) {
      setIsHidden(false);
      setIsHovered(false);
      clearIdleTimer();
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    lastScrollY.current = window.scrollY;

    const onScroll = () => {
      if (isHovered) {
        lastScrollY.current = window.scrollY;
        return;
      }

      const scrollY = window.scrollY;
      const delta = scrollY - lastScrollY.current;

      if (scrollY <= TOP_REVEAL_OFFSET) {
        setIsHidden(false);
      } else if (delta > SCROLL_DELTA) {
        setIsHidden(true);
      } else if (delta < -SCROLL_DELTA) {
        setIsHidden(false);
      }

      lastScrollY.current = scrollY;
      scheduleIdleReveal();
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearIdleTimer();
    };
  }, [clearIdleTimer, isDisabled, isHovered, scheduleIdleReveal]);

  const onMouseEnter = useCallback(() => {
    setIsHovered(true);
    setIsHidden(false);
    clearIdleTimer();
  }, [clearIdleTimer]);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return {
    isHidden: isHidden && !isHovered,
    revealInstant: isHovered,
    onMouseEnter,
    onMouseLeave,
  };
}
