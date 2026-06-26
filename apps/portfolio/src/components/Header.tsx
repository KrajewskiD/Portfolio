import { useCallback, useRef, useState, type MouseEvent } from "react";

import HeaderInfoButton from "./toolbar/HeaderInfoButton";
import LanguageSelector from "./toolbar/LanguageSelector";
import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
import MobileNavigation from "./navigation/MobileNavigation";
import MenuToggle from "./navigation/MenuToggle";
import useActiveNavSection from "@portfolio/hooks/useActiveNavSection";
import useAnimatedWidth from "@portfolio/hooks/useAnimatedWidth";
import useDismissOnOutsidePointerDown from "@portfolio/hooks/useDismissOnOutsidePointerDown";
import { createLanguageSectionHref } from "@portfolio/utils/languageUrl";
import type { NavigationLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Project } from "@shared/database/types/project";
import type { Translations } from "../locales/translations";

type HeaderProps = {
  navigationItems: NavigationLinkData[];
  language: Language;
  navigationText: Translations["navigation"];
  headerText: Translations["header"];
  projectText: Translations["projects"];
  featuredProject?: Project;
  onLanguageChange: (language: Language) => void;
};

function Header({
  navigationItems,
  language,
  navigationText,
  headerText,
  projectText,
  featuredProject,
  onLanguageChange,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);
  const activeSectionId = useActiveNavSection(navigationItems);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useDismissOnOutsidePointerDown(isMenuOpen, closeMenu, menuRef, menuToggleRef);

  const getLabel = (item: NavigationLinkData) =>
    language === "pl" ? item.labelPl : item.labelEn;

  const scrollToTop = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    event.preventDefault();
    window.history.replaceState(window.history.state, "", `/${language}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useAnimatedWidth(islandRef, language);

  return (
    <header className="site-chrome max-sm:w-full">
      <a
        className="site-chrome__wordmark"
        href={`/${language}`}
        onClick={scrollToTop}
      >
        Krajewski
      </a>

      <div
        ref={islandRef}
        className="site-island max-sm:w-full max-sm:max-w-none"
      >
        <nav
          aria-label={navigationText.mainLabel}
          className="site-island__nav max-sm:w-full max-sm:justify-between"
        >
          <div className="site-island__brand">
            <MenuToggle
              ref={menuToggleRef}
              isOpen={isMenuOpen}
              openLabel={navigationText.openMenu}
              closeLabel={navigationText.closeMenu}
              onToggle={() => setIsMenuOpen((current) => !current)}
            />
            <a
              className="site-island__mobile-wordmark"
              href={`/${language}`}
              onClick={scrollToTop}
            >
              Krajewski
            </a>
          </div>

          <NavigationLinks className="site-island__links max-sm:hidden">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                label={getLabel(item)}
                href={createLanguageSectionHref(item.href, language)}
                isActive={item.id === activeSectionId}
              />
            ))}
          </NavigationLinks>

          <LanguageSelector language={language} onChange={onLanguageChange} />

          <HeaderInfoButton
            title={headerText.infoTitle}
            closeLabel={headerText.closeModalLabel}
            emptyMessage={headerText.infoEmptyMessage}
            project={featuredProject}
            projectText={projectText}
            language={language}
          />
        </nav>

        {isMenuOpen ? (
          <MobileNavigation ref={menuRef} label={navigationText.mobileLabel}>
            <NavigationLinks mobile>
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  label={getLabel(item)}
                  href={createLanguageSectionHref(item.href, language)}
                  mobile
                  isActive={item.id === activeSectionId}
                  onNavigate={closeMenu}
                />
              ))}
            </NavigationLinks>
          </MobileNavigation>
        ) : null}
      </div>
    </header>
  );
}

export default Header;
