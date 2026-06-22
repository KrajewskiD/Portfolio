import { useRef, useState } from "react";

import LanguageSelector from "./toolbar/LanguageSelector";
import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
import NavigationName from "./navigation/NavigationName";
import MobileNavigation from "./navigation/MobileNavigation";
import MenuToggle from "./navigation/MenuToggle";
import useActiveNavSection from "@portfolio/hooks/useActiveNavSection";
import useAnimatedWidth from "@portfolio/hooks/useAnimatedWidth";
import type { NavigationLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Translations } from "../locales/translations";

type HeaderProps = {
  navigationItems: NavigationLinkData[];
  language: Language;
  navigationText: Translations["navigation"];
  onLanguageChange: (language: Language) => void;
};

function Header({
  navigationItems,
  language,
  navigationText,
  onLanguageChange,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);
  const activeSectionId = useActiveNavSection(navigationItems);

  const getLabel = (item: NavigationLinkData) =>
    language === "pl" ? item.labelPl : item.labelEn;

  useAnimatedWidth(islandRef);

  return (
    <header className="site-chrome">
      <div ref={islandRef} className="site-island">
        <nav aria-label={navigationText.mainLabel} className="site-island__nav">
          <div className="site-island__brand">
            <MenuToggle
              isOpen={isMenuOpen}
              openLabel={navigationText.openMenu}
              closeLabel={navigationText.closeMenu}
              onToggle={() => setIsMenuOpen((current) => !current)}
            />

            <NavigationName>DK</NavigationName>
          </div>

          <NavigationLinks className="site-island__links">
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
          <MobileNavigation label={navigationText.mobileLabel}>
            <NavigationLinks mobile>
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  label={getLabel(item)}
                  href={item.href}
                  mobile
                  isActive={item.id === activeSectionId}
                  onNavigate={() => setIsMenuOpen(false)}
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
