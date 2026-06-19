import type { ReactNode } from "react";

type SiteTooltipAlign = "center" | "end";

type SiteTooltipProps = {
  message: string;
  children: ReactNode;
  align?: SiteTooltipAlign;
  visible?: boolean;
  className?: string;
};

function SiteTooltip({
  message,
  children,
  align = "center",
  visible,
  className,
}: SiteTooltipProps) {
  const isControlled = visible !== undefined;
  const bubbleClassName = [
    "site-tooltip__bubble",
    align === "end" ? "site-tooltip__bubble--end" : "site-tooltip__bubble--center",
    isControlled ? "site-tooltip__bubble--visible" : "site-tooltip__bubble--hover",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={["site-tooltip", className].filter(Boolean).join(" ")}>
      {children}

      {isControlled ? (
        visible ? (
          <span className={bubbleClassName} role="status">
            {message}
          </span>
        ) : null
      ) : (
        <span className={bubbleClassName} aria-hidden="true">
          {message}
        </span>
      )}
    </span>
  );
}

export default SiteTooltip;
