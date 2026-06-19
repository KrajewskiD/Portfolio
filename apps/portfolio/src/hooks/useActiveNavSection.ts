import { useEffect, useState } from "react";

import type { NavigationLinkData } from "@shared/database/types/link";

const SECTION_START_VIEWPORT_RATIO = 0.45;

const SECTION_NAV_ALIASES: Record<string, string> = {
  showcase: "projects",
};

function hrefToSectionId(href: string): string {
  return href.replace(/^#/, "");
}

function resolveNavSectionId(
  sectionId: string,
  navSectionIds: Set<string>,
): string | null {
  const navId = SECTION_NAV_ALIASES[sectionId] ?? sectionId;

  return navSectionIds.has(navId) ? navId : null;
}

function useActiveNavSection(navigationItems: NavigationLinkData[]) {
  const [activeSectionId, setActiveSectionId] = useState(
    () => navigationItems[0]?.id ?? null,
  );

  useEffect(() => {
    if (!navigationItems.length) {
      return;
    }

    const navSectionIds = new Set(navigationItems.map((item) => item.id));

    const getObservedElements = () =>
      navigationItems
        .flatMap((item) => {
          const sectionId = hrefToSectionId(item.href);

          return sectionId === "projects"
            ? [sectionId, "showcase"]
            : [sectionId];
        })
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null)
        .sort((left, right) => {
          const leftTop = left.getBoundingClientRect().top;
          const rightTop = right.getBoundingClientRect().top;

          return leftTop - rightTop;
        });

    const updateActiveSection = () => {
      const elements = getObservedElements();

      if (!elements.length) {
        return;
      }

      const sectionStartThreshold =
        window.innerHeight * SECTION_START_VIEWPORT_RATIO;

      let nextActive = navigationItems[0].id;

      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        const hasEnteredViewport = rect.top <= sectionStartThreshold;
        const isVisible = rect.bottom > 0;

        if (!hasEnteredViewport || !isVisible) {
          continue;
        }

        const navId = resolveNavSectionId(element.id, navSectionIds);

        if (navId) {
          nextActive = navId;
        }
      }

      setActiveSectionId((current) =>
        current === nextActive ? current : nextActive,
      );
    };

    updateActiveSection();

    let frame = 0;
    const scheduleUpdate = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActiveSection);
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    const main = document.querySelector(".site-main");

    const mutationObserver = new MutationObserver(scheduleUpdate);

    if (main) {
      mutationObserver.observe(main, { childList: true, subtree: true });
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      mutationObserver.disconnect();
    };
  }, [navigationItems]);

  return activeSectionId;
}

export default useActiveNavSection;
