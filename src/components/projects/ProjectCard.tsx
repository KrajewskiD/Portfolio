import type { ReactNode } from "react";

type ProjectCardProps = {
  children: ReactNode;
};

function ProjectCard({ children }: ProjectCardProps) {
  return (
    <article className="mt-8 grid w-full min-w-0 overflow-hidden rounded-3xl border lg:min-h-[75vh] lg:grid-cols-2">
      {children}
    </article>
  );
}

export default ProjectCard;
