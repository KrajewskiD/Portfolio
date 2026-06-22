import type { ReactNode } from "react";

type SectionStatePanelProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  errorMessage: string;
  emptyMessage?: string;
  loading: ReactNode;
  errorPanelClassName?: string;
  emptyPanelClassName?: string;
  children: ReactNode;
};

function SectionStatePanel({
  isLoading,
  isError,
  isEmpty = false,
  errorMessage,
  emptyMessage,
  loading,
  errorPanelClassName = "site-panel--alert",
  emptyPanelClassName = "site-panel--empty",
  children,
}: SectionStatePanelProps) {
  if (isLoading) {
    return loading;
  }

  if (isError) {
    return (
      <div role="alert" className={errorPanelClassName}>
        <p className="site-text-error">{errorMessage}</p>
      </div>
    );
  }

  if (isEmpty && emptyMessage) {
    return (
      <div className={emptyPanelClassName}>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return children;
}

export default SectionStatePanel;
