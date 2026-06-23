import { useCallback, useRef, useState } from "react";

import HeaderInfoButton from "./toolbar/HeaderInfoButton";
import LanguageSelector from "./toolbar/LanguageSelector";
import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
import MobileNavigation from "./navigation/MobileNavigation";
import MenuToggle from "./navigation/MenuToggle";
import useActiveNavSection from "@portfolio/hooks/useActiveNavSection";
import useAnimatedWidth from "@portfolio/hooks/useAnimatedWidth";
import useDismissOnOutsidePointerDown from "@portfolio/hooks/useDismissOnOutsidePointerDown";
import type { NavigationLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Translations } from "../locales/translations";

type HeaderProps = {
  navigationItems: NavigationLinkData[];
  language: Language;
  navigationText: Translations["navigation"];
  headerText: Translations["header"];
  infoText: string;
  onLanguageChange: (language: Language) => void;
};

function Header({
  navigationItems,
  language,
  navigationText,
  headerText,
  infoText,
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

  useDismissOnOutsidePointerDown(
    isMenuOpen,
    closeMenu,
    menuRef,
    menuToggleRef,
  );

  const getLabel = (item: NavigationLinkData) =>
    language === "pl" ? item.labelPl : item.labelEn;

  useAnimatedWidth(islandRef);

  return (
    <header className="site-chrome max-sm:w-full">
      <HeaderInfoButton
        title={headerText.infoTitle}
        text={infoText}
        emptyMessage={headerText.infoEmptyMessage}
      />

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
          </div>

          <NavigationLinks className="site-island__links max-sm:hidden">
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                label={getLabel(item)}
                href={item.href}
                isActive={item.id === activeSectionId}
              />
            ))}
          </NavigationLinks>

          <LanguageSelector language={language} onChange={onLanguageChange} />
        </nav>

        {isMenuOpen ? (
          <MobileNavigation ref={menuRef} label={navigationText.mobileLabel}>
            <NavigationLinks mobile>
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  label={getLabel(item)}
                  href={item.href}
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
