import { useState } from "react";

import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
import NavigationName from "./navigation/NavigationName";
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
          <nav
            id="mobile-menu"
            aria-label="Mobilna nawigacja"
            className="absolute top-full left-1/2 mt-2 w-56 -translate-x-1/2 rounded-2xl border bg-white p-2 sm:hidden"
          >
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
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;