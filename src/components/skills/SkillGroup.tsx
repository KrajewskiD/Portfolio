import type { ReactNode } from "react";

type SkillGroupProps = {
  title: string;
  children: ReactNode;
};

function SkillGroup({ title, children }: SkillGroupProps) {
  return (
    <article className="self-start rounded-2xl border px-5 py-4">
      <h3 className="font-mono text-lg font-semibold">
        {title}
      </h3>

      <div className="mt-3">
        {children}
      </div>
    </article>
  );
}

export default SkillGroup;