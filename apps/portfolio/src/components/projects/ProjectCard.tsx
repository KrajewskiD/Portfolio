import type { ReactNode } from "react";

type ProjectCardProps = {
  children: ReactNode;
  className?: string;
};

function ProjectCard({ children, className = "" }: ProjectCardProps) {
  return (
    <article
      className={["site-card--project", className].filter(Boolean).join(" ")}
    >
      {children}
    </article>
  );
}

export default ProjectCard;
