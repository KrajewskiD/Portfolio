import { useEffect, useRef, useState } from "react";

import type { Language } from "@shared/database/types/language";

type LanguageSelectorProps = {
  language: Language;
  className?: string;
  onChange: (language: Language) => void;
};

const SLIDE_MS = 320;

function LanguageSelector({
  language,
  className = "",
  onChange,
}: LanguageSelectorProps) {
  const [active, setActive] = useState(language);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const pendingLanguageRef = useRef<Language | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (pendingLanguageRef.current === null) {
      setActive(language);
    }
  }, [language]);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
      }
    };
  }, []);

  const commitLanguageChange = (nextLanguage: Language) => {
    if (pendingLanguageRef.current !== nextLanguage) {
      return;
    }

    pendingLanguageRef.current = null;

    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    onChange(nextLanguage);
  };

  const handleSelect = (nextLanguage: Language) => {
    if (nextLanguage === active || pendingLanguageRef.current !== null) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(nextLanguage);
      onChange(nextLanguage);
      return;
    }

    pendingLanguageRef.current = nextLanguage;
    setActive(nextLanguage);

    const indicator = indicatorRef.current;

    if (!indicator) {
      commitLanguageChange(nextLanguage);
      return;
    }

    const finishSlide = (event: TransitionEvent) => {
      if (event.target !== indicator || event.propertyName !== "transform") {
        return;
      }

      indicator.removeEventListener("transitionend", finishSlide);
      commitLanguageChange(nextLanguage);
    };

    indicator.addEventListener("transitionend", finishSlide, { once: true });

    fallbackTimerRef.current = window.setTimeout(() => {
      indicator.removeEventListener("transitionend", finishSlide);
      commitLanguageChange(nextLanguage);
    }, SLIDE_MS + 80);
  };

  return (
    <div
      className={["site-lang-toggle", className].filter(Boolean).join(" ")}
      data-active={active}
      role="group"
      aria-label="Language"
    >
      <span
        ref={indicatorRef}
        aria-hidden
        className="site-lang-toggle__indicator"
        data-position={active}
      />

      <button
        type="button"
        lang="pl"
        aria-pressed={active === "pl"}
        className={`site-lang-button ${
          active === "pl"
            ? "site-lang-button--active"
            : "site-lang-button--inactive"
        }`}
        onClick={() => handleSelect("pl")}
      >
        PL
      </button>

      <button
        type="button"
        lang="en"
        aria-pressed={active === "en"}
        className={`site-lang-button ${
          active === "en"
            ? "site-lang-button--active"
            : "site-lang-button--inactive"
        }`}
        onClick={() => handleSelect("en")}
      >
        ENG
      </button>
    </div>
  );
}

export default LanguageSelector;
