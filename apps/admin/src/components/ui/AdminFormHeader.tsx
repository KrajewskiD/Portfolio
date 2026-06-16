import type { ReactNode } from "react";

type AdminFormHeaderProps = {
  title: string;
  description: string;
  actions?: ReactNode;
};

function AdminFormHeader({
  title,
  description,
  actions,
}: AdminFormHeaderProps) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-2 text-white/60">{description}</p>
      </div>

      {actions}
    </header>
  );
}

export default AdminFormHeader;
