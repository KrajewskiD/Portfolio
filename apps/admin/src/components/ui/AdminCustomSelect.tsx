import { useEffect, useId, useRef, useState } from "react";

type AdminCustomSelectOption = {
  value: string;
  label: string;
};

type AdminCustomSelectProps = {
  id?: string;
  value: string;
  options: AdminCustomSelectOption[];
  disabled?: boolean;
  className?: string;
  compact?: boolean;
  ariaLabel?: string;
  onChange: (value: string) => void;
};

function AdminCustomSelect({
  id,
  value,
  options,
  disabled = false,
  className = "",
  compact = false,
  ariaLabel,
  onChange,
}: AdminCustomSelectProps) {
  const fallbackId = useId();
  const selectId = id ?? fallbackId;
  const rootRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [isOpen]);

  return (
    <div
      ref={rootRef}
      className={["relative", className].filter(Boolean).join(" ")}
    >
      <button
        id={selectId}
        type="button"
        disabled={disabled}
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className={[
          "admin-select flex w-full items-center justify-between gap-2 text-left",
          compact ? "admin-control-compact" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        title={selectedOption?.label}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <span className="text-white/40" aria-hidden>
          ▾
        </span>
      </button>

      {isOpen ? (
        <ul
          role="listbox"
          aria-labelledby={selectId}
          className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-2 shadow-2xl"
        >
          {options.map((option) => {
            const isSelected = option.value === value;

            return (
              <li key={option.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={[
                    "w-full rounded-xl px-4 py-3 text-left font-bold transition",
                    isSelected
                      ? "bg-neutral-700 text-white"
                      : "text-white/70 hover:bg-neutral-800 hover:text-white",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export default AdminCustomSelect;
