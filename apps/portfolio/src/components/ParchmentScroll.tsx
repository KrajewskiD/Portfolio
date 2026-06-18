import { type ReactNode, type RefObject } from "react";

import useParchmentScroll from "@portfolio/hooks/useParchmentScroll";

type ParchmentScrollProps = {
  children: ReactNode;
  tiltRef: RefObject<HTMLDivElement | null>;
};

function ParchmentScroll({ children, tiltRef }: ParchmentScrollProps) {
  useParchmentScroll(tiltRef);

  return <div className="site-parchment-sheet">{children}</div>;
}

export default ParchmentScroll;
