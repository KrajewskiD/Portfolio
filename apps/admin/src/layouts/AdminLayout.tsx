import type { ReactNode } from "react";

type AdminLayoutProps = {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
};

function AdminLayout({ title, children, actions }: AdminLayoutProps) {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-6 text-white">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-white/40">admin_panel</p>
            <h1 className="mt-2 text-4xl font-black">{title}</h1>
          </div>

          {actions && <div>{actions}</div>}
        </header>

        <div className="rounded-[2rem] border border-white/10 bg-neutral-900/80 p-6 shadow-2xl shadow-black/40">
          {children}
        </div>
      </section>
    </main>
  );
}

export default AdminLayout;
