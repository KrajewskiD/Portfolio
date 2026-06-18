import type { ReactNode } from "react";

type SkillGroupProps = {
  title: string;
  children: ReactNode;
};

function SkillGroup({ title, children }: SkillGroupProps) {
  return (
    <article className="site-card--skill">
      <h3 className="site-title--skill-group">{title}</h3>

      <div className="mt-3">{children}</div>
    </article>
  );
}

export default SkillGroup;
