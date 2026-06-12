import type { ReactNode } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import type { FooterData } from "../types/footer";
import type { LinkData } from "../types/link";

type MainLayoutProps = {
  children: ReactNode;
  footer: FooterData;
  navigationItems: LinkData[];
};

function MainLayout({
  children,
  footer,
  navigationItems,
}: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header navigationItems={navigationItems} />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4">
        {children}
      </main>

      <Footer footer={footer} />
    </div>
  );
}

export default MainLayout;