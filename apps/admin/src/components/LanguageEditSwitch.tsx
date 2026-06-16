import type { Language } from "@shared/types/language";

type LanguageEditSwitchProps = {
  value: Language;
  onChange: (language: Language) => void;
};

const languages: Array<{ value: Language; label: string }> = [
  { value: "pl", label: "PL" },
  { value: "en", label: "ENG" },
];

function LanguageEditSwitch({ value, onChange }: LanguageEditSwitchProps) {
  return (
    <div className="inline-flex rounded-full border border-white/10 bg-neutral-800 p-1">
      {languages.map((language) => {
        const isActive = language.value === value;

        return (
          <button
            key={language.value}
            type="button"
            onClick={() => onChange(language.value)}
            className={[
              "cursor-pointer rounded-full px-4 py-2 text-sm font-black transition",
              isActive
                ? "bg-neutral-600 text-white"
                : "text-white/50 hover:bg-neutral-700 hover:text-white",
            ].join(" ")}
          >
            {language.label}
          </button>
        );
      })}
    </div>
  );
}

export default LanguageEditSwitch;
