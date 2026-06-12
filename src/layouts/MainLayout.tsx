import type { ReactNode } from "react";

type MainLayoutProps = {
  children: ReactNode;
};

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen">
      <header>Portfolio</header>
      <main>{children}</main>
      <footer>Stopka</footer>
    </div>
  );
}

export default MainLayout;