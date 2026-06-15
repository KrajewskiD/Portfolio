import type { ReactNode } from "react";

type AuthLayoutProps = {
  label: string;
  title: string;
  description: string;
  children?: ReactNode;
};

function AuthLayout({ label, title, description, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-neutral-950 px-6 py-10 text-white">
      <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-neutral-900/80 p-8 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-10">
        <p className="font-mono text-sm text-white/50">{label}</p>

        <h1 className="mt-4 text-4xl font-black leading-tight text-white">
          {title}
        </h1>

        <p className="mt-4 text-base leading-7 text-white/60">{description}</p>

        {children && <div className="mt-8 grid gap-4">{children}</div>}
      </section>
    </main>
  );
}

export default AuthLayout;
