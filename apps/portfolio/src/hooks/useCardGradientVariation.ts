import { useEffect } from "react";

const CARD_SURFACE_SELECTOR = [
  ".site-hero-card",
  ".site-card--project",
  ".site-card--skeleton",
  ".site-card--skill",
  ".site-panel--alert",
  ".site-panel--empty",
  ".site-panel--empty-lg",
].join(", ");

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function applyGradientToElement(element: HTMLElement) {
  if (element.dataset.gradientVariant) {
    return;
  }

  element.dataset.gradientVariant = "1";
  element.style.setProperty(
    "--card-gradient-angle",
    `${randomBetween(125, 210).toFixed(0)}deg`,
  );

  if (element.classList.contains("site-card--skill")) {
    return;
  }

  element.style.setProperty(
    "--card-accent-x",
    `${randomBetween(0, 100).toFixed(1)}%`,
  );
  element.style.setProperty(
    "--card-accent-y",
    `${randomBetween(0, 45).toFixed(1)}%`,
  );
  element.style.setProperty(
    "--card-gradient-mid",
    `${randomBetween(38, 54).toFixed(1)}%`,
  );
}

function applyCardGradientVariation(root: ParentNode) {
  root
    .querySelectorAll<HTMLElement>(CARD_SURFACE_SELECTOR)
    .forEach((element) => {
      applyGradientToElement(element);
    });
}

function useCardGradientVariation() {
  useEffect(() => {
    const apply = () => {
      applyCardGradientVariation(document);
    };

    apply();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) {
            return;
          }

          applyCardGradientVariation(node);
        });
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);
}

export default useCardGradientVariation;
