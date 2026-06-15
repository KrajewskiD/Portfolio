import type { ReactNode } from "react";

type AuthLayoutProps = {
  label: string;
  title: string;
  description: string;
  children?: ReactNode;
};

function AuthLayout({ label, title, description, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-200 px-6 py-10 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/20 bg-black/80 p-8 shadow-2xl backdrop-blur-xl">
        <p className="font-mono text-sm text-white/60">{label}</p>

        <h1 className="mt-4 text-4xl font-black leading-tight">{title}</h1>

        <p className="mt-4 text-base leading-7 text-white/70">{description}</p>

        {children && <div className="mt-8 grid gap-4">{children}</div>}
      </section>
    </main>
  );
}

export default AuthLayout;
