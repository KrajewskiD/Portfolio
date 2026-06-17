type AdminSegmentedControlItem<T extends string> = {
  id: T;
  label: string;
};

type AdminSegmentedControlProps<T extends string> = {
  items: AdminSegmentedControlItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  variant?: "tabs" | "toggle";
  borderless?: boolean;
  compact?: boolean;
};

function AdminSegmentedControl<T extends string>({
  items,
  activeId,
  onChange,
  variant = "tabs",
  borderless = false,
  compact = false,
}: AdminSegmentedControlProps<T>) {
  const tabButtonClass = compact
    ? "flex-none cursor-pointer whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-bold transition"
    : "flex-none cursor-pointer whitespace-nowrap rounded-full border px-5 py-2 font-bold transition";
  if (variant === "toggle") {
    return (
      <div className="inline-flex rounded-full border border-white/10 bg-neutral-800 p-1">
        {items.map((item) => {
          const isActive = item.id === activeId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onChange(item.id)}
              className={[
                "cursor-pointer rounded-full px-4 py-2 text-sm font-black transition",
                isActive
                  ? "bg-neutral-600 text-white"
                  : "text-white/50 hover:bg-neutral-700 hover:text-white",
              ].join(" ")}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    );
  }

  const tabButtons = items.map((item) => {
    const isActive = item.id === activeId;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => onChange(item.id)}
        className={[
          tabButtonClass,
          isActive
            ? "border-white/30 bg-neutral-700 text-white"
            : "border-white/10 bg-neutral-800 text-white/60 hover:border-white/20 hover:bg-neutral-700 hover:text-white",
        ].join(" ")}
      >
        {item.label}
      </button>
    );
  });

  return (
    <div
      className={
        borderless
          ? "flex min-w-max flex-nowrap gap-2"
          : "w-full max-w-full overflow-x-auto border-b border-white/10 pb-4"
      }
    >
      {borderless ? (
        tabButtons
      ) : (
        <div className="flex min-w-max flex-nowrap gap-2">{tabButtons}</div>
      )}
    </div>
  );
}

export default AdminSegmentedControl;
