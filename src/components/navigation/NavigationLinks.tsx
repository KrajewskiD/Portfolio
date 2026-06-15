import type { ReactNode } from "react";

type NavigationLinksProps = {
  children: ReactNode;
  mobile?: boolean;
};

function NavigationLinks({ children, mobile = false }: NavigationLinksProps) {
  return (
    <div
      className={mobile ? "flex flex-col" : "hidden items-center gap-1 sm:flex"}
    >
      {children}
    </div>
  );
}

export default NavigationLinks;
