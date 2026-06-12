import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="sticky top-4 z-50 px-4">
      <div className="relative mx-auto w-fit">
        <nav
          aria-label="Główna nawigacja"
          className="flex items-center gap-1 rounded-full border bg-white px-2 py-1"
        >
          <a className="px-3 py-2 font-semibold" href="/">
            Portfolio
          </a>

          <div className="hidden items-center gap-1 sm:flex">
            <a className="px-3 py-2" href="#about">O mnie</a>
            <a className="px-3 py-2" href="#projects">Projekty</a>
            <a className="px-3 py-2" href="#skills">Umiejętności</a>
          </div>

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
            className="absolute top-full left-1/2 mt-2 flex w-56 -translate-x-1/2 flex-col rounded-2xl border bg-white p-2 sm:hidden"
          >
            <a className="rounded-xl px-4 py-3" href="#about" onClick={closeMenu}>
              O mnie
            </a>
            <a className="rounded-xl px-4 py-3" href="#projects" onClick={closeMenu}>
              Projekty
            </a>
            <a className="rounded-xl px-4 py-3" href="#skills" onClick={closeMenu}>
              Umiejętności
            </a>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;