import { useEffect } from "react";

const MODAL_OPEN_CLASS = "site-modal-open";
const MODAL_INERT_SELECTORS = [".site-chrome", ".site-parchment-sheet"] as const;

function setModalInert(inert: boolean) {
  for (const selector of MODAL_INERT_SELECTORS) {
    const element = document.querySelector(selector);

    if (!element) {
      continue;
    }

    if (inert) {
      element.setAttribute("inert", "");
    } else {
      element.removeAttribute("inert");
    }
  }
}

export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const root = document.documentElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.classList.add(MODAL_OPEN_CLASS);
    setModalInert(true);

    return () => {
      document.body.style.overflow = previousOverflow;
      root.classList.remove(MODAL_OPEN_CLASS);
      setModalInert(false);
    };
  }, [isLocked]);
}
