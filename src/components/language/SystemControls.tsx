import { useEffect, useState } from "react";

import type { Language } from "../../types/language";

type SystemControlsProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

function formatTime(date: Date) {
  return [date.getHours(), date.getMinutes(), date.getSeconds()]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

function SystemControls({
  language,
  onLanguageChange,
}: SystemControlsProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex h-12 items-center justify-end px-4 text-lg leading-none sm:justify-between sm:px-6">
      <time
        className="hidden sm:block"
        dateTime={currentTime.toISOString()}
        >
        {formatTime(currentTime)}
        </time>

        <div className="pointer-events-auto flex items-center gap-2">
        <button
            type="button"
            className={`min-w-10 text-center ${ language === "pl" ? "font-bold" : "font-normal" }`}
            aria-pressed={language === "pl"}
            onClick={() => onLanguageChange("pl")}
        >
            PL
        </button>

        <span>/</span>

        <button
            type="button"
            className={`min-w-10 text-center ${language === "en" ? "font-bold" : "font-normal"}`}
            
            aria-pressed={language === "en"}
            onClick={() => onLanguageChange("en")}
        >
            ENG
        </button>
        </div>
    </div>
  );
}

export default SystemControls;