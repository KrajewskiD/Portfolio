import type { ReactNode } from "react";

type ProjectCardProps = {
  children: ReactNode;
};

function ProjectCard({ children }: ProjectCardProps) {
  return <article className="site-card--project">{children}</article>;
}

export default ProjectCard;
