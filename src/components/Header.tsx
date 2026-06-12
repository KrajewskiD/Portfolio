import { useState } from "react";

import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
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
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center sm:hidden"
            aria-label={isMenuOpen ? "Zamknij menu" : "Otwórz menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
            </span>
          </button>

          <span className="px-3 py-2 font-semibold">
            Krajewski
          </span>

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