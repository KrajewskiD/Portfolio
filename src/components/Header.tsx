import { useState } from "react";

import NavigationItem from "./navigation/NavigationItem";
import NavigationLinks from "./navigation/NavigationLinks";
import type { LinkData } from "../types/link";

type HeaderProps = {
  navigationItems: LinkData[];
};

function Header({ navigationItems }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="relative mx-auto w-fit">
        <nav
          aria-label="Główna nawigacja"
          className="flex items-center gap-1 rounded-full border bg-white px-2 py-1"
        >
          <a href="/" className="px-3 py-2 font-semibold">
            Portfolio
          </a>

          <NavigationLinks>
            {navigationItems.map((item) => (
              <NavigationItem
                key={item.href}
                label={item.label}
                href={item.href}
              />
            ))}
          </NavigationLinks>

          <button
            type="button"
            className="min-h-11 px-3 sm:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            Menu
          </button>
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
                  key={item.href}
                  label={item.label}
                  href={item.href}
                  mobile
                  onNavigate={closeMenu}
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