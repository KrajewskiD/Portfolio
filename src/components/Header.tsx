import { useState } from "react";

import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
import NavigationName from "./navigation/NavigationName";
import MobileNavigation from "./navigation/MobileNavigation";
import MenuToggle from "./navigation/MenuToggle";
import type { NavigationLinkData } from "../types/link";
import type { Language } from "../types/language";

type HeaderProps = {
  navigationItems: NavigationLinkData[];
  language: Language;
};

function Header({ navigationItems, language }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getLabel = (item: NavigationLinkData) =>
    language === "pl" ? item.labelPl : item.labelEn;

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="relative mr-auto w-fit sm:mx-auto">
        <nav
          aria-label="Główna nawigacja"
          className="flex items-center gap-1 rounded-full border bg-white px-2 py-1"
        >
          <MenuToggle
            isOpen={isMenuOpen}
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
          <MobileNavigation>
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