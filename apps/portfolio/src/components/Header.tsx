import { useState } from "react";

import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
import NavigationName from "./navigation/NavigationName";
import MobileNavigation from "./navigation/MobileNavigation";
import MenuToggle from "./navigation/MenuToggle";
import type { NavigationLinkData } from "@shared/database/types/link";
import type { Language } from "@shared/database/types/language";
import type { Translations } from "../locales/translations";

type HeaderProps = {
  navigationItems: NavigationLinkData[];
  language: Language;
  navigationText: Translations["navigation"];
};

function Header({ navigationItems, language, navigationText }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getLabel = (item: NavigationLinkData) =>
    language === "pl" ? item.labelPl : item.labelEn;

  return (
    <header className="site-header">
      <div className="relative mr-auto w-fit sm:mx-auto">
        <nav aria-label={navigationText.mainLabel} className="site-pill--nav">
          <MenuToggle
            isOpen={isMenuOpen}
            openLabel={navigationText.openMenu}
            closeLabel={navigationText.closeMenu}
            onToggle={() => setIsMenuOpen((current) => !current)}
          />

          <NavigationName>Krajewski</NavigationName>

          <NavigationLinks>
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.id}
                label={getLabel(item)}
                href={item.href}
              />
            ))}
          </NavigationLinks>
        </nav>

        {isMenuOpen && (
          <MobileNavigation label={navigationText.mobileLabel}>
            <NavigationLinks mobile>
              {navigationItems.map((item) => (
                <NavigationItem
                  key={item.id}
                  label={getLabel(item)}
                  href={item.href}
                  mobile
                  onNavigate={() => setIsMenuOpen(false)}
                />
              ))}
            </NavigationLinks>
          </MobileNavigation>
        )}
      </div>
    </header>
  );
}

export default Header;
