import type { ReactNode } from "react";

type ProjectDetailsProps = {
  code: string;
  title: string;
  technologies: ReactNode;
  topics: ReactNode;
};

function ProjectDetails({
  code,
  title,
  technologies,
  topics,
}: ProjectDetailsProps) {
  return (
    <div className="site-project-details">
      <p className="site-code">{code}</p>

      <h3 className="site-title--project">{title}</h3>
      <div className="mt-5 flex flex-wrap gap-2">{technologies}</div>
      {topics}
    </div>
  );
}

export default ProjectDetails;
